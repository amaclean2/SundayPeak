const DataLayer = require('..')
const logger = require('../../Config/logger')
const { deleteAdventurePictures, getAdventurePictures } = require('../Pictures')
const { AdventureObject } = require('../../TypeDefs/adventures')
const {
  selectAdventuresInRangeStatement,
  updateAdventureStatements,
  createNewSkiStatement,
  createNewSkiAdventureStatement,
  createNewClimbStatement,
  createNewClimbAdventureStatement,
  createNewHikeStatement,
  createNewHikeAdventureStatement,
  searchAdventureStatement,
  addKeywordStatement,
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement,
  getKeywordsStatement,
  deleteTodosByAdventureStatement,
  deleteCompletedByAdventureStatement,
  selectAdventureByIdGroup
} = require('../Statements')
const {
  formatAdventureForGeoJSON,
  getSkiSpecificFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  getGeneralFields,
  adventureTemplates,
  getStatementKey
} = require('./utils')

// if everything is working right, the only time a cache is out of date is
// when a new adventure gets added or updated and then we update the cache
// const CACHE_TIMEOUT = 60000

class AdventureDataLayer extends DataLayer {
  /**
   *
   * @param {Object} adventure | the adventure object to be added
   * @returns {Promise} the new adventure id
   */
  addAdventure(adventure) {
    const { adventure_type } = adventure
    const adventureProperties = {}

    switch (adventure_type) {
      case 'ski':
        adventureProperties.createNewSpecificStatement = createNewSkiStatement
        adventureProperties.createNewGeneralStatement =
          createNewSkiAdventureStatement
        adventureProperties.specificFields = getSkiSpecificFields(adventure)
        adventureProperties.specificIdType = 'adventure_ski_id'
        break
      case 'climb':
        adventureProperties.createNewSpecificStatement = createNewClimbStatement
        adventureProperties.createNewGeneralStatement =
          createNewClimbAdventureStatement
        adventureProperties.specificFields = getClimbSpecificFields(adventure)
        adventureProperties.specificIdType = 'adventure_climb_id'
        break
      case 'hike':
        adventureProperties.createNewSpecificStatement = createNewHikeStatement
        adventureProperties.createNewGeneralStatement =
          createNewHikeAdventureStatement
        adventureProperties.specificFields = getHikeSpecificFields(adventure)
        adventureProperties.specificIdType = 'adventure_hike_id'
    }

    // there are two tables that need to get updated, the specific adventure values, (ski, climb, hike)
    // and the general adventures table. This statement updates the specific one and gets the specific id
    return this.sendQuery(
      adventureProperties.createNewSpecificStatement,
      adventureProperties.specificFields
    )
      .then(([{ insertId: specificId }]) =>
        getGeneralFields({
          ...adventure,
          [adventureProperties.specificIdType]: specificId
        })
      )
      .then((fields) => {
        // this is the last query to update the general adventures table and it returns the id of the adventure
        return this.sendQuery(
          adventureProperties.createNewGeneralStatement,
          fields
        )
      })
      .then(([{ insertId }]) => insertId)
      .catch((error) => {
        logger.error('DATABASE_INSERTION_FAILED', error)
        throw error
      })
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId
   * @param {string} params.adventureType
   * @returns {Promise<AdventureObject>}
   */
  getAdventure({ adventureId, adventureType }) {
    return this.sendQuery(selectAdventureByIdGroup[adventureType], [
      adventureId
    ])
      .then(([[selectedAdventure]]) => selectedAdventure)
      .catch((error) => {
        logger.error('DATABASE_QUERY_FAILED', error)
        throw error
      })
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.adventureType
   * @returns {Promise<AdventureObject[]>}
   */
  databaseGetTypedAdventures({ adventureType }) {
    // fetch all the adventures that pertain to that type from the database
    return this.sendQuery(selectAdventuresInRangeStatement, [adventureType])
      .then(([results]) => {
        return results.map((result) => formatAdventureForGeoJSON(result))
      })
      .then((formattedResults) => {
        // this is formatted as geoJSON because the mapbox api needs to read it
        return {
          type: 'FeatureCollection',
          features: formattedResults
        }
      })
      .catch((error) => {
        logger.error('DATABASE_QUERY_FAILED', error)
        throw error
      })
  }

  /**
   *
   * @param {Object} params
   * @param {Object} params.field
   * @param {string} params.field.name
   * @param {string} params.field.value
   * @param {number} params.field.adventure_id
   * @param {string} params.field.adventure_type
   * @returns {Promise<AdventureObject>} the updated adventure
   */
  databaseEditAdventure({ field }) {
    // some of the adventure fields are in the adventures table, some are in the specific-type table
    // if this field is in the general table then we just need to update that one. It requires another read
    // because we need to update the searchable statement table
    if (adventureTemplates.general.includes(field.name)) {
      return this.sendQuery(updateAdventureStatements[field.name], [
        field.value,
        field.adventure_id
      ])
        .then(() => this.sendQuery(getKeywordsStatement, [field.adventure_id]))
        .then(([[result]]) => result)
        .catch((error) => {
          logger.error('DATABASE_UPDATE_FAILED', error)
          throw error
        })
    } else {
      // if we are updating one of the specific adventure fields then we just do that
      return this.sendQuery(
        updateAdventureStatements[
          getStatementKey(field.name, field.adventure_type)
        ],
        [field.value, field.adventure_id]
      )
        .then(([result]) => result)
        .catch((error) => {
          logger.error('DATABASE_UPDATE_FAILED', error)
          throw error
        })
    }
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.keyword
   * @param {number} params.adventureId
   * @returns {Promise} void
   */
  updateSearchAdventureKeywords({ keyword, adventureId }) {
    return this.sendQuery(addKeywordStatement, [keyword, adventureId])
  }

  /**
   *
   * @param {Object} params
   * @param {string} params.search
   * @returns {Promise<AdventureObject[]>} a list of adventures matching the given string
   */
  searchDatabaseForAdventureString({ search }) {
    return this.sendQuery(searchAdventureStatement, [`%${search}%`])
      .then(([allResults]) => allResults)
      .catch((error) => {
        logger.error('DATABASE_RETRIEVAL_FAILED', error)
        throw error
      })
  }

  /**
   *
   * @param {Object} params
   * @param {number} params.adventureId
   * @param {string} params.adventureType
   * @return {Promise} void
   */
  async databaseDeleteAdventure({ adventureId, adventureType }) {
    // to delete an adventure, we have to delete all of the todos associated with that adventure,
    // then all the completed advnetures, then all the pictures for that adventure,
    // then we can delete the adventure and the specific adventure details
    return getAdventurePictures({ adventureId })
      .then((pictures) => {
        pictures.forEach((picture) => {
          const fileName = picture.split('thumbs/').pop()
          // deleteImageFromStorage(fileName)
          // deleteImageFromStorage(`thumbs/${fileName}`)
        })

        return deleteAdventurePictures({ file_names: pictures })
      })
      .then(() => {
        const databaseDeleteAdventureStatement =
          (adventureType === 'ski' && deleteSkiStatement) ||
          (adventureType === 'climb' && deleteClimbStatement) ||
          (adventureType === 'hike' && deleteHikeStatement)

        return this.sendQuery(databaseDeleteAdventureStatement, [
          Number(adventureId)
        ])
      })
      .then(([result]) => result)
      .catch((error) => {
        logger.error('DATABASE_DELETION_FAILED', error)
        throw error
      })
  }
}

module.exports = AdventureDataLayer
