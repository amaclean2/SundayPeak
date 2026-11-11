const DataLayer = require('..')
const { AdventureObject } = require('../../TypeDefs/adventures')
const {
  selectAdventuresStatement,
  updateAdventureStatements,
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement,
  selectAdventureByIdGroup,
  createNewClimbStatement,
  createNewHikeStatement,
  createNewSkiStatement,
  createNewSkiAdventureStatement,
  createNewClimbAdventureStatement,
  createNewHikeAdventureStatement,
  getAdventurePicturesStatement,
  createAdventurePictureStatement,
  deleteBikeStatement,
  getCloseAdventures,
  createNewBikeStatement,
  createNewBikeAdventureStatement,
  createNewApproachStatement,
  createNewSkiApproachStatement,
  selectSkiApproachStatement,
  buildBreadcrumbStatement,
  updateAdventureGeneralStatement,
  updateSpecificStatements,
  getCloseAdventuresGivenZone
} = require('../Statements')
const {
  formatAdventureForGeoJSON,
  adventureTemplate,
  getPropsToImport,
  parseAdventures,
  createSpecificProperties,
  getGeneralFields,
  pathAdventures,
  removeUnusedVariables,
  splitPath
} = require('./utils')
const {
  failedInsertion,
  failedQuery,
  failedUpdate,
  failedDeletion
} = require('../utils')
const { removeImage } = require('../../Services/utils/sharp')
const logger = require('../../Config/logger')

// if everything is working right, the only time a cache is out of date is
// when a new adventure gets added or updated and then we update the cache
// const CACHE_TIMEOUT = 60000

class AdventureDataLayer extends DataLayer {
  /**
   * @param {Object} adventure | the adventure object to be added
   * @returns {Promise} the new adventure id
   */
  async addAdventure(adventure) {
    try {
      const adventureProperties = getPropsToImport(adventure)

      logger.info(`adventure properties built for new adventure`)

      // there are two tables that need to get updated, the specific adventure values, (ski, climb, hike, bike)
      // and the general adventures table. This statement updates the specific one and gets the specific id
      const [{ insertId: specificId }] = await this.sendQuery(
        adventureProperties.createNewSpecificStatement,
        [[adventureProperties.specificFields]]
      )

      logger.info(`specific information saved for new adventure`)

      const fields = getGeneralFields({
        ...adventure,
        [adventureProperties.specificIdType]: specificId
      })

      logger.info(`fields obtained for general information`)

      const [{ insertId }] = await this.sendQuery(
        adventureProperties.createNewGeneralStatement,
        [[fields]]
      )

      logger.info(`general information saved for adventure ${insertId}`)

      return insertId
    } catch (error) {
      logger.error(error)
      throw failedInsertion(error)
    }
  }

  async bulkAddAdventures({ adventures }) {
    try {
      const parsedAdventures = parseAdventures(adventures)
      const specificProperties = createSpecificProperties(parsedAdventures)
      const ids = {}
      const generalProperties = {}

      const createNewSpecificStatements = {
        ski: createNewSkiStatement,
        climb: createNewClimbStatement,
        hike: createNewHikeStatement,
        bike: createNewBikeStatement,
        skiApproach: createNewApproachStatement
      }

      const createNewGeneralStatements = {
        ski: createNewSkiAdventureStatement,
        climb: createNewClimbAdventureStatement,
        hike: createNewHikeAdventureStatement,
        bike: createNewBikeAdventureStatement,
        skiApproach: createNewSkiApproachStatement
      }

      const responses = await Promise.all(
        ['ski', 'climb', 'hike', 'bike', 'skiApproach'].map(async (type) => {
          logger.info(`inserting adventures for ${type}`)

          // return an empty array if there's not adventures for that type
          if (!parsedAdventures[type].length) {
            return []
          }

          // first insert the properties for fields specific to that adventure
          // then with the specific id, you can insert that into the general adventures

          // this statement potentially inserts multiple entries at once
          const [{ insertId }] = await this.sendQuery(
            createNewSpecificStatements[type],
            [specificProperties[type]]
          )

          // the database only returns the id of the first element inserted
          // so to get all the ids, you have to add the insertId to each element
          ids[type] = parsedAdventures[type].map((_, idx) => insertId + idx)

          generalProperties[type] = parsedAdventures[type].map(
            (adventure, idx) => {
              switch (adventure.adventure_type) {
                case 'ski':
                  adventure.adventure_ski_id = ids[type][idx]
                  break
                case 'climb':
                  adventure.adventure_climb_id = ids[type][idx]
                  break
                case 'hike':
                  adventure.adventure_hike_id = ids[type][idx]
                  break
                case 'skiApproach':
                  adventure.ski_approach_id = ids[type][idx]
                  break
              }

              return getGeneralFields(adventure)
            }
          )

          const [{ insertId: adventureId }] = await this.sendQuery(
            createNewGeneralStatements[type],
            [generalProperties[type]]
          )

          return parsedAdventures[type].map((adventure, idx) => ({
            ...adventure,
            id: adventureId + idx
          }))
        })
      )

      return responses
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.adventureId
   * @param {string} params.adventureType
   * @returns {Promise<AdventureObject>}
   */
  async getAdventure({ adventureId, adventureType }) {
    try {
      const [[selectedAdventure]] = await this.sendQuery(
        selectAdventureByIdGroup[adventureType],
        [adventureId]
      )

      if (!selectedAdventure) {
        return null
      }

      selectedAdventure.public = Boolean(selectedAdventure.public)

      // convert the stringified path back to an object
      // pathAdventures are any adventures that would have a path/elevations property
      if (
        pathAdventures.includes(adventureType) &&
        selectedAdventure.path &&
        selectedAdventure?.path?.length !== 0
      ) {
        // splitting the array around a point that's [0]. This point is there to split the
        // path shown on the map with the points used to edit the path

        const [path, points] = splitPath(selectedAdventure.path ?? '[]')
        selectedAdventure.path = path
        selectedAdventure.points = points

        selectedAdventure.elevations = JSON.parse(
          selectedAdventure.elevations ?? '[]'
        )
      } else if (!selectedAdventure.path) {
        selectedAdventure.path = []
      }

      selectedAdventure.rating = `${Math.round(
        selectedAdventure.rating.split(':')[0]
      )}:${selectedAdventure.rating.split(':')[1]}`

      return selectedAdventure
    } catch (error) {
      return failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.adventureType | 'ski' | 'hike' | 'climb' | 'bike' | 'skiApproach'
   * @param {Object} params.coordinates
   * @param {number} params.coordinates.lat
   * @param {number} params.coordinates.lng
   * @param {number} params.count
   * @param {number} [params.excludeId] | an adventure id to leave out of the results
   * @returns {Promise<Object[]>} | returns a promise containing an array of adventure objects that are closest to the given coordinates
   */
  async getClosestAdventuresFromDB({
    adventureType,
    coordinates,
    count,
    excludeId
  }) {
    try {
      logger.info(
        JSON.stringify({
          centerCoordinatesOfAdventures: coordinates,
          adventureType
        })
      )
      const [results] = await this.sendQuery(getCloseAdventures, [
        adventureType,
        excludeId ?? 0,
        coordinates.lat,
        coordinates.lng,
        count
      ])
      return results
    } catch (error) {
      return failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.adventureType
   * @param {number} params.zoneId
   * @param {Object} params.coordinates
   * @param {number} params.coordiantes.lat
   * @param {number} params.coordiantes.lng
   * @param {number} [params.excludeId] | an adventure id to leave out of the results
   * @returns {Promise<Object>} an array of adventures that match up to the given parameters
   */
  async getClosestZoneAdventures({
    adventureType,
    zoneId,
    coordinates,
    count,
    excludeId
  }) {
    try {
      const [results] = await this.sendQuery(getCloseAdventuresGivenZone, [
        adventureType,
        zoneId,
        excludeId ?? 0,
        coordinates.lat,
        coordinates.lng,
        count
      ])
      return results
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.adventureType
   * @returns {Promise<AdventureObject[]>}
   */
  async databaseGetTypedAdventures({ adventureType }) {
    try {
      if (!adventureType) {
        throw 'adventureType parameter required'
      }

      // fetch all the adventures that pertain to that type from the database
      const [results] = await this.sendQuery(selectAdventuresStatement, [
        adventureType
      ])

      logger.info(`selecting all results for adventure type: ${adventureType}`)

      const formattedResults = formatAdventureForGeoJSON(
        results.map((rs) => removeUnusedVariables(rs))
      )

      if (adventureType === 'ski') {
        const [skiApproachResults] = await this.sendQuery(
          selectSkiApproachStatement
        )

        logger.info('ski results fetched')

        return {
          ski: formattedResults,
          skiApproach: formatAdventureForGeoJSON(
            skiApproachResults.map((sa) => removeUnusedVariables(sa))
          )
        }
      } else {
        logger.info('non-ski results fetched')
        return {
          [adventureType]: formattedResults
        }
      }
    } catch (error) {
      logger.error(error)
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {Object} params.field
   * @param {number} params.field.adventure_id
   * @param {string} params.field.adventure_type
   * @param {string} params.field.path
   * @param {string} params.field.elevations
   * @param {string} params.field.base_elevation
   * @param {string} params.field.summit_elevation
   * @param {string} params.field.climb
   * @param {string} params.field.descent
   * @param {('remove'|'add')} params.field.action
   * @returns {Promise<false>}
   */
  async databaseEditAdventurePaths({ field }) {
    try {
      logger.info(`editing trail_paths for ${field.adventure_id}`)
      if (field.action === 'remove') {
        const type =
          field.adventure_type === 'ski'
            ? 'remove_ski_trail_path'
            : field.adventure_type === 'hike'
            ? 'remove_hike_trail_path'
            : field.adventure_type === 'bike'
            ? 'remove_bike_trail_path'
            : 'remove_ski_approach_trail_path'

        await this.sendQuery(updateAdventureStatements[type], [
          field.adventure_id
        ])
      }

      if (field.adventure_type === 'bike') {
        await this.sendQuery(updateAdventureStatements['bike_trail_path'], [
          field.path,
          field.elevations,
          field.summit_elevation,
          field.base_elevation,
          field.climb,
          field.descent,
          field.adventure_id
        ])
        return splitPath(field.path)
      } else if (field.adventure_type === 'ski') {
        await this.sendQuery(updateAdventureStatements['ski_trail_path'], [
          field.path,
          field.elevations,
          field.summit_elevation,
          field.base_elevation,
          field.adventure_id
        ])
      } else if (field.adventure_type === 'hike') {
        await this.sendQuery(updateAdventureStatements['hike_trail_path'], [
          field.path,
          field.elevations,
          field.summit_elevation,
          field.base_elevation,
          field.climb,
          field.descent,
          field.adventure_id
        ])
      } else if (field.adventure_type === 'skiApproach') {
        await this.sendQuery(
          updateAdventureStatements['ski_approach_trail_path'],
          [
            field.path,
            field.elevations,
            field.summit_elevation,
            field.base_elevation,
            field.adventure_id
          ]
        )
      }
      logger.info(`finished editing trail_paths for ${field.adventure_id}`)

      return false
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  /**
   * @param {Object} params
   * @param {Object} params.field
   * @param {string} params.field.name
   * @param {string} params.field.value
   * @param {number} params.field.adventure_id
   * @param {string} params.field.adventure_type
   * @returns {Promise<void>} nothing
   */
  async databaseEditAdventure({ field }) {
    // some of the adventure fields are in the adventures table, some are in the specific-type table
    // if this field is in the general table then we just need to update that one.
    try {
      if (field.name === 'paths') {
        throw 'paths have their own edit statement'
      }

      if (adventureTemplate.includes(field.name)) {
        // general adventure property
        logger.info(
          `edit new general query on ${field.adventure_id}, ${field.name}`
        )

        await this.sendQuery(updateAdventureGeneralStatement, [
          field.name,
          field.name === 'public' ? +field.value : field.value,
          field.adventure_id
        ])

        logger.info(
          `finished editing query on ${field.adventure_id}, ${field.name}`
        )
      } else {
        // specific adventure property
        logger.info(
          `edit new specific query on ${field.adventure_id}, ${field.name}`
        )
        // if we are updating one of the specific adventure fields then we just do that
        await this.sendQuery(updateSpecificStatements[field.adventure_type], [
          field.name,
          field.value,
          field.adventure_id
        ])
        logger.info(
          `finished editing query on ${field.adventure_id}, ${field.name}`
        )
        return false
      }
    } catch (error) {
      throw failedUpdate(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.adventureId
   * @param {string} params.adventureType
   * @return {Promise} void
   */
  async databaseDeleteAdventure({ adventureId, adventureType }) {
    // to delete an adventure, we have to delete all the pictures for that adventure,
    // then we can delete the adventure and the specific adventure details
    return this.getAdventureImages({ adventureId })
      .then((pictures) => {
        pictures.forEach((picture) => {
          removeImage({ url: picture })
        })
      })
      .then(() => {
        const databaseDeleteAdventureStatement =
          (adventureType === 'ski' && deleteSkiStatement) ||
          (adventureType === 'climb' && deleteClimbStatement) ||
          (adventureType === 'hike' && deleteHikeStatement) ||
          (adventureType === 'bike' && deleteBikeStatement)

        return this.sendQuery(databaseDeleteAdventureStatement, [
          Number(adventureId)
        ])
      })
      .then(([result]) => result)
      .catch(failedDeletion)
  }

  /**
   * @param {Object} params
   * @param {number} params.adventureId
   * @returns {Promise<string[]>} | a list of urls attributed to that adventure
   */
  async getAdventureImages({ adventureId }) {
    try {
      const [results] = await this.sendQuery(getAdventurePicturesStatement, [
        adventureId
      ])
      return results.map(({ url }) => url.replace('images/', 'images/thumbs/'))
    } catch (error) {
      throw failedQuery(error)
    }
  }

  /**
   * @param {Object} params
   * @param {string} params.url
   * @param {number} params.userId
   * @param {number} params.adventureId
   * @returns {Promise<string>}
   */
  async saveImageToAdventure({ url, userId, adventureId }) {
    try {
      const [results] = await this.sendQuery(createAdventurePictureStatement, [
        url,
        userId,
        adventureId
      ])
      if (Object.keys(results)?.length) {
        return 'adventure image saved'
      } else {
        throw 'saving adventure image failed'
      }
    } catch (error) {
      throw failedInsertion(error)
    }
  }

  /**
   * @param {Object} params
   * @param {number} params.adventureId
   * @returns {Promise<Object[]>} a list of objects containing the
   */
  async buldBreadcrumb({ adventureId }) {
    try {
      const [results] = await this.sendQuery(buildBreadcrumbStatement, [
        adventureId
      ])
      return results.map((result, idx) => ({
        ...result,
        category_type: idx === 0 ? 'adventure' : 'zone'
      }))
    } catch (error) {
      throw failedQuery(error)
    }
  }
}

module.exports = AdventureDataLayer
