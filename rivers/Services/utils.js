const mapboxStyles = {
  default: 'mapbox://styles/amaclean/cl96apqbm000215lj13gii46x',
  topo: 'mapbox://styles/amaclean/cl96imu9s005q14pd6u8pqd0b'
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
    'elevation',
    'gear',
    'gain'
  ],
  climb: [
    'climb_type',
    'grade',
    'protection',
    'pitches',
    'light_times',
    'season'
  ],
  hike: ['duration', 'season', 'length', 'gain']
}

const getSkiSpecificFields = (adventure) => {
  return [
    adventure.avg_angle || 0,
    adventure.max_angle || 0,
    adventure.approach_distance || '',
    adventure.aspect || 'N',
    adventure.difficulty || '',
    adventure.elevation || '',
    adventure.exposure || '',
    adventure.gain || '',
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
    adventure.season || ''
  ]
}

const getHikeSpecificFields = (adventure) => {
  return [
    adventure.difficulty || 0,
    adventure.elevation || 0,
    adventure.duration || 0,
    adventure.season || '',
    adventure.gain || 0
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

const getStatementKey = (name, type) => {
  switch (name) {
    case 'difficulty':
      if (type === 'ski') return 'ski_difficulty'
      else return 'hike-difficulty'
    case 'elevation':
      if (type === 'ski') return 'ski_elevation'
      else return 'hike_elevation'
    case 'gain':
      if (type === 'ski') return 'ski_gain'
      else return 'hike_gain'
    case 'season':
      if (type === 'ski') return 'ski_season'
      else if (type === 'climb') return 'climb_season'
      else return 'hike_season'
    default:
      return name
  }
}

const adventureTypes = ['ski', 'climb', 'hike']

module.exports = {
  mapboxStyles,
  adventureTemplates,
  adventureTypes,
  getSkiSpecificFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  getGeneralFields,
  getStatementKey
}
