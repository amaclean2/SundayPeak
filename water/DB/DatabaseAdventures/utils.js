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

const getSkiSpecificFields = (adventure) => {
  return [
    adventure.avg_angle || 0,
    adventure.max_angle || 0,
    adventure.approach_distance || '',
    adventure.aspect || 'N',
    adventure.difficulty || 0,
    adventure.summit_elevation || 0,
    adventure.base_elevation || 0,
    adventure.exposure || 0,
    adventure.gear || '',
    adventure.season || ''
  ]
}

const getClimbSpecificFields = (adventure) => {
  return [
    adventure.grade || '',
    adventure.pitches || 0,
    adventure.protection || '',
    adventure.climb_type || '',
    adventure.light_times || '',
    adventure.season || '',
    adventure.approach || '',
    adventure.first_ascent || ''
  ]
}

const getHikeSpecificFields = (adventure) => {
  return [
    adventure.difficulty || 0,
    adventure.summit_elevation || 0,
    adventure.base_elevation || 0,
    adventure.duration || 0,
    adventure.season || ''
  ]
}

const getGeneralFields = (adventure) => {
  return [
    (adventure.adventure_type === 'ski' && adventure.adventure_ski_id) ||
      (adventure.adventure_type === 'climb' && adventure.adventure_climb_id) ||
      (adventure.adventure_type === 'hike' && adventure.adventure_hike_id),
    adventure.adventure_name,
    adventure.adventure_type,
    adventure.bio || '',
    adventure.coordinates_lat,
    adventure.coordinates_lng,
    adventure.creator_id,
    adventure.nearest_city,
    adventure.public,
    adventure.rating || 0
  ]
}

const adventureTemplates = {
  general: [
    'adventure_name',
    'bio',
    'coordinates_lat',
    'coordinates_lng',
    'nearest_city',
    'rating',
    'public'
  ],
  ski: [
    'approach_distance',
    'season',
    'avg_angle',
    'max_angle',
    'difficulty',
    'summit_elevation',
    'gear',
    'base_elevation'
  ],
  climb: [
    'climb_type',
    'grade',
    'protection',
    'pitches',
    'light_times',
    'season',
    'approach',
    'first_ascent'
  ],
  hike: ['duration', 'season', 'length', 'base_elevaiton', 'summit_elevation']
}

const getStatementKey = (name, type) => {
  switch (name) {
    case 'difficulty':
      if (type === 'ski') return 'ski_difficulty'
      else return 'hikedifficulty'
    case 'summit_elevation':
      if (type === 'ski') return 'ski_summit_elevation'
      else return 'hike_summit_elevation'
    case 'base_elevation':
      if (type === 'ski') return 'ski_base_elevation'
      else return 'hike_base_elevation'
    case 'season':
      if (type === 'ski') return 'ski_season'
      else if (type === 'climb') return 'climb_season'
      else return 'hike_season'
    case 'approach':
      return 'climb_approach'
    case 'distance':
      return 'hike_distance'
    default:
      return name
  }
}

module.exports = {
  formatAdventureForGeoJSON,
  getSkiSpecificFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  getGeneralFields,
  getStatementKey,
  adventureTemplates
}
