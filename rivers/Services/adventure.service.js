const queries = require('../DB')

const buildAdventureObject = async ({ id, type }) => {
  const { getAdventure, getTicksByAdventure, getAdventurePictures } = queries

  const adventure = await getAdventure(id, type)
  const ticks = await getTicksByAdventure({ adventureId: id })
  const images = await getAdventurePictures({ adventureId: id })

  return {
    ...adventure,
    images,
    ticks: ticks.map((tick) => ({
      ...tick,
      user_id: tick.creator_id
    }))
  }
}

const parseCoordinates = ({ boundingBox }) => {
  return {
    maxLat: boundingBox.NE.lat,
    minLat: boundingBox.SW.lat,
    maxLng: boundingBox.NE.lng,
    minLng: boundingBox.SW.lng
  }
}

module.exports = {
  buildAdventureObject,
  parseCoordinates
}
