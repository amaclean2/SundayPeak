const queries = require('../DB')

const buildAdventureObject = async ({ id, type }) => {
  const { getAdventure, getTicksByAdventure, getAdventurePictures } = queries

  const adventure = await getAdventure(id, type)
  const ticks = await getTicksByAdventure({ adventureId: id })
  const images = await getAdventurePictures({ adventureId: id })

  const formattedAdventure = {
    ...adventure,
    images,
    ticks: ticks.map((tick) => ({
      ...tick
    })),
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
