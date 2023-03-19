const Water = require('.')
const SearchService = require('./search.service')
const { Cache } = require('memory-cache')
const { updateAdventureCache } = require('./utils/caching')
const logger = require('../Config/logger')

const CACHE_TIMEOUT = 1000 * 360

/**
 * @class
 * @param {function} sendQuery | function to make a database call
 * @param {string} jwtSecret | secret used for JsonWebToken
 */
class AdventureService extends Water {
  constructor(sendQuery, jwtSecret) {
    super(sendQuery, jwtSecret)
    this.search = new SearchService(sendQuery, jwtSecret)
    this.adventureCache = new Cache()
  }
  /**
   * @private
   * @param {Object} params
   * @param {number} params.id
   * @param {string} params.type
   * @param {Object} params.availableFields
   * @param {AdventureObject} [params.providedObject] | if we don't want to call the database, we can fill in the adventure with this
   * @returns {Promise<AdventureObject>} an adventure object
   */
  async #buildAdventureObject({ id, type, providedObject }) {
    if (providedObject) {
      const basicAdventure = {
        ...providedObject,
        id,
        todo_users: [],
        completed_users: [],
        images: [],
        coordinates: {
          lat: providedObject.coordinates_lat,
          lng: providedObject.coordinates_lng
        }
      }

      return basicAdventure
    }

    const adventure = await this.adventureDB.getAdventure({
      adventureId: id,
      adventureType: type
    })

    if (!adventure) {
      throw "adventure couldn't be found"
    }

    const todoUsers = await this.todoDB.getAdventureTodoList({
      adventureId: id
    })
    const completedUsers = await this.completedDB.getCompletedUsers({
      adventureId: id
    })
    // const images = await getAdventurePictures({ adventureId: id })
    const images = []

    const formattedAdventure = {
      ...adventure,
      images,
      todo_users: todoUsers,
      completed_users: completedUsers,
      public: !!adventure.public,
      coordinates: {
        lat: adventure.coordinates_lat,
        lng: adventure.coordinates_lng
      }
    }

    delete formattedAdventure.coordinates_lat
    delete formattedAdventure.coordinates_lng

    return formattedAdventure
  }

  /**
   * @typedef {Object} CreateAdventureResponse
   * @property {AdventureObject} adventure
   * @property {AdventureGeoJsonObject} adventureList
   */

  /**
   *
   * @param {Object} params
   * @param {AdventureObject} params.AdventureObject
   * @returns {Promise<CreateAdventureResponse>} | an object containing the adventure and the geojson list
   */
  async createAdventure({ adventureObject }) {
    const adventureId = await this.adventureDB.addAdventure(adventureObject)
    const adventure = await this.#buildAdventureObject({
      id: adventureId,
      type: adventureObject.adventure_type,
      providedObject: adventureObject
    })

    // we need to rebuild the cached adventure list. Since we can do this with data we already have,
    // it doesn't require another round trip to the database
    const updatedCacheObject = updateAdventureCache({
      cacheObject: {
        ...this.adventureCache.get(adventureObject.adventure_type)
      },
      adventureObject: { ...adventureObject, id: adventureId }
    })

    this.adventureCache.put(
      adventureObject.adventure_type,
      updatedCacheObject,
      CACHE_TIMEOUT
    )

    this.search.saveAdventureKeywords({
      searchableFields: adventure,
      id: adventure.id
    })

    return { adventure, adventureList: updatedCacheObject }
  }

  /**
   * @param {Object} params
   * @param {AdventureObject[]} params.adventures
   * @returns {Promise<void>} | there's too much stuff to return
   */
  bulkAdventureCreation({ adventures }) {
    return this.adventureDB
      .bulkAddAdventures({ adventures })
      .then((response) => {
        const allAdventures = response.reduce(
          (adventureList, adventureType) => [
            ...adventureList,
            ...adventureType
          ],
          []
        )

        for (const adventure in allAdventures) {
          this.search.saveAdventureKeywords({
            searchableFields: allAdventures[adventure],
            id: allAdventures[adventure].id
          })
        }

        this.adventureCache.clear()
        return allAdventures
      })
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.adventureType | the adventure type to get
   * @returns {Promise<AdventureGeoJsonObject>} a list of adventures formatted as geoJson
   */
  getAdventureList({ adventureType }) {
    // if there is already a cached adventure list, just return that
    const cachedResults = this.adventureCache.get(adventureType)

    if (cachedResults) {
      return cachedResults
    }

    return this.adventureDB
      .databaseGetTypedAdventures({ adventureType })
      .then((adventures) => {
        this.adventureCache.put(adventureType, adventures, CACHE_TIMEOUT)
        return adventures
      })
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.search | the search string to use against the users list
   * @returns {Promise<AdventureObject[]>} a list of adventures
   */
  searchForAdventures({ search }) {
    if (!search?.length) return []

    return this.search.handleAdventureSearch({ search })
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId | the id of the adventure to search for
   * @param {string} params.adventureType | the type of the adventure to search for
   * @returns {Promise<AdventureObject>}
   */
  getSpecificAdventure({ adventureId, adventureType }) {
    if (!adventureId || !adventureType) {
      throw 'The adventureId and adventureType fields are required to be non-falsy. Please supply the missing field(s).'
    }
    return this.#buildAdventureObject({ id: adventureId, type: adventureType })
  }

  /**
   *
   * @param {Object} params
   * @param {Object} params.field | the field to update
   * @param {string} params.field.name | the name of the field to update
   * @param {string} params.field.value | the value of the field to update
   * @param {number} params.field.adventure_id | the id of the adventure to update
   * @param {string} params.field.adventure_type | the type of the adventure to update
   * @return {Promise} void
   */
  editAdventure({ field }) {
    return this.adventureDB
      .databaseEditAdventure({ field })
      .then((adventureKeywords) => {
        // we need to rebuild the cached adventure list. Since we can do this with data we already have,
        // it doesn't require another round trip to the database

        this.adventureCache.del(adventureKeywords.adventure_type)

        if (this.search.adventureKeywordLibrary.includes(field.name)) {
          this.search.saveAdventureKeywords({
            searchableFields: adventureKeywords,
            id: field.adventure_id
          })
        }
      })
  }

  /**
   * @param {Object} params
   * @param {number} params.adventureId | the id of the adventure to delete
   * @param {string} params.adventureType | the type of the adventure to delete
   * @returns {Promise<DeletionResponse>} | an object containing affectedRows
   */
  deleteAdventure({ adventureId, adventureType }) {
    return this.adventureDB
      .databaseDeleteAdventure({
        adventureId,
        adventureType
      })
      .then((resp) => {
        this.adventureCache.del(adventureType)
        return resp
      })
  }

  /**
   * @param {Object} params
   * @param {string} csvString
   * @returns {Object} a JSON object of all the adventures
   */
  processCSVToAdventure({ csvString }) {
    if (!csvString.length) throw 'There was no data to process'

    const data = csvString.split('\r\n')
    if (data.length < 2) throw 'The data was formatted incorrectly'

    const [keys, ...values] = data
    const strippedKeys = keys.replace(/["|\r]/g, '').split(',')

    const newData = values.map((value) => {
      value = value.replace(/(".*?")|,/g, (...m) => m[1] || '|')
      const strippedValue = value.split('|')

      const assembledObject = strippedValue.reduce(
        (object, value, idx) => ({ ...object, [strippedKeys[idx]]: value }),
        {}
      )
      if (assembledObject.id) {
        assembledObject.id = Number(assembledObject.id.replace('"', ''))
      }

      assembledObject['coordinates_lat'] = Number(
        assembledObject['coordinates.lat'].replace('"', '')
      )
      assembledObject['coordinates_lng'] = Number(
        assembledObject['coordinates.lng'].replace('"', '')
      )
      assembledObject.public = [true, 'true', 'TRUE'].includes(
        assembledObject.public
      )
        ? 1
        : 0
      assembledObject.creator_id = Number(assembledObject.creator_id)

      if (
        assembledObject.adventure_type === 'ski' &&
        assembledObject.gear &&
        assembledObject.season
      ) {
        assembledObject.gear = assembledObject.gear.replaceAll('"', '')
        assembledObject.season = assembledObject.season.replaceAll('"', '')
      }

      assembledObject.nearest_city = assembledObject.nearest_city.replaceAll(
        '"',
        ''
      )
      return assembledObject
    })

    return newData
  }
}

module.exports = AdventureService
