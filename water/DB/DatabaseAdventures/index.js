const adventureCache = require('../../Config/caching')
const { sendQuery } = require('../../Config/db')
const logger = require('../../Config/logger')
const { deleteImageFromStorage } = require('../../Services/multer.service')
const {
  getSkiSpecificFields,
  getGeneralFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  adventureTemplates,
  getStatementKey
} = require('../../Services/utils')
const { deleteAdventurePictures, getAdventurePictures } = require('../Pictures')
const {
  deleteActivityByAdventureStatement,
  deleteTickByAdventureStatement,
  selectAdventuresInRangeStatement,
  updateAdventureStatements
} = require('../Statements')
const {
  createNewSkiStatement,
  createNewSkiAdventureStatement,
  createNewClimbStatement,
  createNewClimbAdventureStatement,
  createNewHikeStatement,
  createNewHikeAdventureStatement,
  selectAdventureByIdGroup,
  searchAdventureStatement,
  getAdventureTypeStatement,
  addKeywordStatement,
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement,
  getKeywordsStatement
} = require('../Statements/Adventures')
const { formatAdventureForGeoJSON } = require('./utils')

const CACHE_TIMEOUT = 60000

/**
 *
 * @param {Object} adventure | the adventure object to be added
 * @returns | a new adventure
 *
 * 1. Get adventure type from 'adventure'
 * 2. Figure out what properties of that specific adventure type
 *    exist in the new adventure
 * 3. Fill in the rest with default values
 * 4. Create the specific adventure
 * 5. Get the id from the specific adventure
 * 6. Fill in the missing properties of a general adventure
 * 7. Fill in the id from the specific adventure
 * 8. Create the general adventure
 * 9. Return the general adventure id
 */
const addAdventure = async (adventure) => {
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

  return sendQuery(
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
      const oldAdventureList = adventureCache.get(
        `adventures-${adventure_type}`
      )

      if (oldAdventureList) {
        const newAdventureList = {
          ...oldAdventureList
        }

        newAdventureList.features = [
          ...newAdventureList.features,
          formatAdventureForGeoJSON(adventure)
        ]
        adventureCache.put(
          `adventure-${adventure_type}`,
          newAdventureList,
          CACHE_TIMEOUT
        )
      }

      return sendQuery(adventureProperties.createNewGeneralStatement, fields)
    })
    .then(([{ insertId }]) => insertId)
    .catch((error) => {
      logger.error('DATABASE_INSERTION_FAILED', error)
      throw error
    })
}

const getAdventure = async (id) => {
  try {
    const [[{ adventure_type }]] = await sendQuery(getAdventureTypeStatement, [
      id
    ])

    const [[selectedAdventure]] = await sendQuery(
      selectAdventureByIdGroup[adventure_type],
      [id]
    )
    logger.debug({ selectedAdventure })
    return selectedAdventure
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const getAdventures = async (type) => {
  try {
    // try if the adventures are saved in the memory cache
    const cachedResults = adventureCache.get(`adventures-${type}`)
    // return the cached adventures
    if (cachedResults) {
      return cachedResults
    }

    // otherwise get the adventures from the database
    const [results] = await sendQuery(selectAdventuresInRangeStatement, [type])

    const dataPoints = results.map((result) =>
      formatAdventureForGeoJSON(result)
    )

    const geoJSONFormatted = {
      type: 'FeatureCollection',
      features: dataPoints
    }
    // before sending the adventures back, save them in the memory cache
    adventureCache.put(`adventures-${type}`, geoJSONFormatted, CACHE_TIMEOUT)

    // return the database adventures
    return geoJSONFormatted
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

/**
 *
 * @param {*} params | the parameters passed to updateAdventure
 * @param {string} params.name | the field name to update
 * @param {string} params.value | the field value to update
 * @param {int} params.adventure_id | the id of the adventure to update
 * @param {string} params.adventure_type | the type of the adventure to update
 * @returns a promise returning the updated adventure
 */
const updateAdventure = async ({ field }) => {
  if (adventureTemplates.general.includes(field.name)) {
    return sendQuery(updateAdventureStatements[field.name], [
      field.value,
      field.adventure_id
    ])
      .then(() => sendQuery(getKeywordsStatement, [field.adventure_id]))
      .then(([[result]]) => {
        const oldAdventureList = adventureCache.get(
          `adventures-${field.adventure_type}`
        )

        if (oldAdventureList) {
          const newAdventureList = {
            ...oldAdventureList
          }
          newAdventureList.features = [
            ...newAdventureList.features,
            formatAdventureForGeoJSON(result)
          ]
          adventureCache.put(
            `adventure-${field.adventure_type}`,
            newAdventureList,
            CACHE_TIMEOUT
          )
        }

        return result
      })
      .catch((error) => {
        logger.error('DATABASE_UPDATE_FAILED', error)
        throw error
      })
  } else {
    return sendQuery(
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
 * @param {Object} params | parameters for the method
 * @param {string} params.keyword | the keyword to add to the list
 * @param {int} params.adventureId | the adventure the keyword is found in
 * @returns a promise inserting the adventure keywords into the database
 */
const updateSearchAdventureKeywords = ({ keyword, adventureId }) =>
  sendQuery(addKeywordStatement, [keyword, adventureId])

/**
 *
 * @param {Object} params | paramters for the method
 * @param {string} params.keyword | the string to search for against the keywords
 * @returns a promise finding the correct adventure from the database
 */
const searchDatabaseForAdventureString = ({ keyword }) =>
  sendQuery(searchAdventureStatement, [`%${keyword}%`])
    .then(([results]) => results)
    .catch((error) => {
      logger.error('DATABASE_RETRIEVAL_FAILED', error)
      throw error
    })

const deleteAdventure = async ({ adventureId, adventureType }) => {
  return sendQuery(deleteTickByAdventureStatement, [adventureId])
    .then(() => sendQuery(deleteActivityByAdventureStatement, [adventureId]))
    .then(() => getAdventurePictures({ adventureId }))
    .then((pictures) => {
      pictures.forEach((picture) => {
        const fileName = picture.split('thumbs/').pop()
        deleteImageFromStorage(fileName)
        deleteImageFromStorage(`thumbs/${fileName}`)
      })

      return deleteAdventurePictures({ file_names: pictures })
    })
    .then(() => {
      const databaseDeleteAdventureStatement =
        (adventureType === 'ski' && deleteSkiStatement) ||
        (adventureType === 'climb' && deleteClimbStatement) ||
        (adventureType === 'hike' && deleteHikeStatement)

      logger.info({
        adventureType,
        adventureId,
        databaseDeleteAdventureStatement
      })

      return sendQuery(databaseDeleteAdventureStatement, [Number(adventureId)])
    })
    .then(([result]) => result)
    .catch((error) => {
      logger.error('DATABASE_DELETION_FAILED', error)
      throw error
    })
}

module.exports = {
  addAdventure,
  getAdventure,
  getAdventures,
  searchDatabaseForAdventureString,
  updateAdventure,
  deleteAdventure,
  updateSearchAdventureKeywords
}
