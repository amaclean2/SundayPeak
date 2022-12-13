const { db } = require('../Config/db')
const logger = require('../Config/logger')
const { deleteImageFromStorage } = require('../Services/multer.service')
const {
  getSkiSpecificFields,
  getGeneralFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  adventureTemplates,
  getStatementKey
} = require('../Services/utils')
const { deleteAdventurePictures, getAdventurePictures } = require('./Pictures')
const {
  deleteActivityByAdventureStatement,
  deleteAdventureStatement,
  deleteTickByAdventureStatement,
  selectAdventuresInRangeStatement,
  updateAdventureStatements
} = require('./Statements')
const {
  createNewSkiStatement,
  createNewSkiAdventureStatement,
  createNewClimbStatement,
  createNewClimbAdventureStatement,
  createNewHikeStatement,
  createNewHikeAdventureStatement,
  selectAdventureByIdGroup,
  getSpecificAdventureId,
  searchAdventureStatement,
  getAdventureTypeStatement
} = require('./Statements/Adventures')

const addAdventure = async (adventure) => {
  try {
    /**
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

    const { adventure_type } = adventure
    let generalAdventureId
    switch (adventure_type) {
      case 'ski': {
        const specificFields = getSkiSpecificFields(adventure)
        const [{ insertId: specificId }] = await db.execute(
          createNewSkiStatement,
          specificFields
        )
        const generalFields = getGeneralFields({
          ...adventure,
          adventure_ski_id: specificId
        })
        const [{ insertId }] = await db.execute(
          createNewSkiAdventureStatement,
          generalFields
        )
        generalAdventureId = insertId
        break
      }
      case 'climb': {
        const specificFields = getClimbSpecificFields(adventure)
        const [{ insertId: specificId }] = await db.execute(
          createNewClimbStatement,
          specificFields
        )
        const generalFields = getGeneralFields({
          ...adventure,
          adventure_climb_id: specificId
        })
        const [{ insertId }] = await db.execute(
          createNewClimbAdventureStatement,
          generalFields
        )
        generalAdventureId = insertId
        break
      }
      case 'hike': {
        const specificFields = getHikeSpecificFields(adventure)
        const [{ insertId: specificId }] = await db.execute(
          createNewHikeStatement,
          specificFields
        )
        const generalFields = getGeneralFields({
          ...adventure,
          adventure_hike_id: specificId
        })
        const [{ insertId }] = await db.execute(
          createNewHikeAdventureStatement,
          generalFields
        )
        generalAdventureId = insertId
        break
      }
      default:
        logger.debug({ adventure_type })
        throw 'there is not a valid adventure type'
    }

    return generalAdventureId
  } catch (error) {
    logger.error('DATABASE_INSERTION_FAILED', error)
    throw error
  }
}

const getAdventure = async (id) => {
  try {
    const [[{ adventure_type }]] = await db.execute(getAdventureTypeStatement, [
      id
    ])

    const [[selectedAdventure]] = await db.execute(
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

const getAdventures = async (coordinates, type) => {
  try {
    const [results] = await db.execute(selectAdventuresInRangeStatement, [
      coordinates.maxLat,
      coordinates.minLat,
      coordinates.minLng,
      coordinates.maxLng,
      type
    ])

    return results.map((result) => {
      const newResult = {
        ...result,
        coordinates: {
          lat: result.coordinates_lat,
          lng: result.coordinates_lng
        },
        public: !!result.public
      }
      delete newResult.coordinates_lat
      delete newResult.coordinates_lng

      return newResult
    })
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const updateAdventure = async ({ fields }) => {
  const responses = await Promise.all([
    fields.map((field) => {
      if (adventureTemplates.general.includes(field.field_name)) {
        return db
          .execute(updateAdventureStatements[field.field_name], [
            field.field_value,
            field.adventure_id
          ])
          .then(([result]) => result)
          .catch((error) => {
            logger.error('DATABASE_UPDATE_FAILED', error)
            throw error
          })
      } else {
        return db
          .execute(getSpecificAdventureId, [field.adventure_id])
          .then(([[result]]) => {
            const statementKey = getStatementKey(
              field.field_name,
              result.adventure_type
            )
            return db
              .execute(updateAdventureStatements[statementKey], [
                field.field_value,
                result.specific_adventure_id
              ])
              .then(([result]) => result)
              .catch((error) => {
                logger.error('DATABASE_UPDATE_FAILED', error)
                throw error
              })
          })
      }
    })
  ])

  return responses
}

const searchAdventures = async ({ keywords }) => {
  try {
    const [results] = await db.execute(searchAdventureStatement, [
      `%${keywords}%`
    ])
    return results.map((result) => {
      const newResult = {
        ...result,
        coordinates: {
          lat: result.coordinates_lat,
          lng: result.coordinates_lng
        }
      }
      delete newResult.coordinates_lat
      delete newResult.coordinates_lng

      return newResult
    })
  } catch (error) {
    logger.error('DATABASE_QUERY_FAILED', error)
    throw error
  }
}

const deleteAdventure = async (adventureId) => {
  return db
    .execute(deleteTickByAdventureStatement, [adventureId])
    .then(() => db.execute(deleteActivityByAdventureStatement, [adventureId]))
    .then(() => getAdventurePictures({ adventureId }))
    .then((pictures) => {
      pictures.forEach((picture) => {
        const fileName = picture.split('thumbs/').pop()
        deleteImageFromStorage(fileName)
        deleteImageFromStorage(`thumbs/${fileName}`)
      })

      deleteAdventurePictures({ file_names: pictures })

      return db.execute(deleteAdventureStatement, [adventureId])
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
  searchAdventures,
  updateAdventure,
  deleteAdventure
}
