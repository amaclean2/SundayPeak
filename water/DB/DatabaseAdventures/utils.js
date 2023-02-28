const formatAdventureForGeoJSON = (adventure) => {
  const newAdventure = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [adventure.coordinates_lng, adventure.coordinates_lat]
    },
    properties: {
      ...adventure,
      public: !!adventure.public
    }
  }

  delete newAdventure.properties.coordinates_lat
  delete newAdventure.properties.coordinates_lng

  return newAdventure
}

module.exports = {
  formatAdventureForGeoJSON
}
