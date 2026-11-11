const logger = require('../../Config/logger')
const {
  createNewSkiStatement,
  createNewSkiAdventureStatement,
  createNewClimbStatement,
  createNewClimbAdventureStatement,
  createNewHikeStatement,
  createNewHikeAdventureStatement,
  createNewBikeStatement,
  createNewBikeAdventureStatement,
  createNewSkiApproachStatement,
  createNewApproachStatement
} = require('../Statements')

const formatAdventureForGeoJSON = (adventures) => {
  const pointAdventures = []
  const lineAdventures = []

  for (let adventure of adventures) {
    if (
      [undefined, null].includes(adventure.path) ||
      adventure.path.length === 0
    ) {
      pointAdventures.push(adventure)
    } else {
      lineAdventures.push(adventure)
    }
  }

  return {
    points: {
      type: 'FeatureCollection',
      features: pointAdventures.map((point) => ({
        type: 'Feature',
        id: point.adventure_id,
        properties: {
          adventureType: point.adventure_type,
          adventureName: point.adventure_name,
          color: adventurePathColor(point.adventure_type)
        },
        geometry: {
          type: 'Point',
          coordinates: [point.coordinates_lng, point.coordiantes_lat]
        }
      }))
    },
    lines: {
      type: 'FeatureCollection',
      features: lineAdventures.map((line) => ({
        type: 'Feature',
        id: line.adventure_id,
        properties: {
          adventureType: line.adventure_type,
          adventureName: line.adventure_name,
          color: adventurePathColor(line.adventure_type)
        },
        geometry: {
          type: 'LineString',
          coordinates: line.path
        }
      }))
    }
  }
}

/**
 * @param {string} pathStr
 * @returns {Array.<Array} | an array, the first element is the path, the second element is the edit points
 */
const splitPath = (pathStr = '[]') => {
  // splitting the array around a point that's [0]. This point is there to split the
  // path shown on the map with the points used to edit the path
  let newPath, newPoints
  const pathArr = JSON.parse(pathStr)

  if (!pathArr) return []

  const splitIdx = pathArr?.findIndex((e) => e.length === 1)
  if (splitIdx !== -1) {
    newPath = pathArr.slice(0, splitIdx)
    newPoints = pathArr.slice(splitIdx + 1)
  } else {
    newPath = pathArr
    newPoints = []
  }

  return [newPath, newPoints]
}

const removeUnusedVariables = (adventure) => {
  switch (adventure.adventure_type) {
    case 'ski':
      adventure.path = splitPath(adventure.ski_path)[0]
      break
    case 'hike':
      adventure.path = splitPath(adventure.hike_path)[0]
      break
    case 'bike':
      adventure.path = splitPath(adventure.bike_path)[0]
      break
    case 'skiApproach':
      adventure.path = splitPath(adventure.ski_approach_path)[0]
      break
  }

  delete adventure.ski_path
  delete adventure.hike_path
  delete adventure.bike_path
  delete adventure.ski_approach_path

  return adventure
}

// all properties below must be in order of the database query
const getSkiSpecificFields = (adventure) => [
  adventure.avg_angle ?? 0,
  adventure.max_angle ?? 0,
  adventure.aspect ?? 'N',
  adventure.summit_elevation ?? 0,
  adventure.base_elevation ?? 0,
  adventure.exposure ?? 0,
  adventure.season ?? '',
  adventure.trail_path ?? '[]',
  adventure.elevations ?? '[]'
]

// all properties below must be in order of the database query
const getClimbSpecificFields = (adventure) => [
  adventure.pitches ?? 0,
  adventure.protection ?? '',
  adventure.climb_type ?? '',
  adventure.light_times ?? '',
  adventure.season ?? '',
  adventure.approach ?? '',
  adventure.first_ascent ?? ''
]

// all properties below must be in order of the database query
const getHikeSpecificFields = (adventure) => [
  adventure.summit_elevation ?? 0,
  adventure.base_elevation ?? 0,
  adventure.season ?? '',
  adventure.trail_path ?? '[]',
  adventure.elevations ?? '[]',
  adventure.climb ?? 0,
  adventure.descent ?? 0
]

// all properties below must be in order of the database query
const getBikeSpecificFields = (adventure) => [
  adventure.summit_elevation ?? 0,
  adventure.base_elevation ?? 0,
  adventure.season ?? '',
  adventure.trail_path ?? '[]',
  adventure.elevations ?? '[]',
  adventure.climb ?? 0,
  adventure.descent ?? 0
]

const getSkiApproachSpecificFields = (adventure) => [
  adventure.summit_elevation ?? 0,
  adventure.base_elevation ?? 0,
  adventure.gear ?? '',
  adventure.trail_path ?? '[]',
  adventure.elevations ?? '[]',
  adventure.exposure ?? 0
]

const getGeneralFields = (adventure) => {
  return [
    (adventure.adventure_type === 'ski' && adventure.adventure_ski_id) ||
      (adventure.adventure_type === 'climb' && adventure.adventure_climb_id) ||
      (adventure.adventure_type === 'hike' && adventure.adventure_hike_id) ||
      (adventure.adventure_type === 'bike' && adventure.adventure_bike_id) ||
      (adventure.adventure_type === 'skiApproach' && adventure.ski_approach_id),
    adventure.adventure_name,
    adventure.adventure_type,
    adventure.bio || '',
    adventure.coordinates_lat,
    adventure.coordinates_lng,
    adventure.creator_id,
    adventure.nearest_city,
    +adventure.public,
    adventure.rating || '0:0',
    adventure.difficulty || '0:0'
  ]
}

const adventureTemplate = [
  'adventure_name',
  'bio',
  'coordinates_lat',
  'coordinates_lng',
  'nearest_city',
  'rating',
  'public',
  'difficulty'
]

const adventurePathColor = (adventureType = 'ski') => {
  const colors = {
    ski: '#38e',
    hike: '#e53',
    climb: '#ccc',
    bike: '#3a3',
    skiApproach: '#d70'
  }

  return colors[adventureType]
}

const getPropsToImport = (adventure) => {
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
      break
    case 'bike':
      adventureProperties.createNewSpecificStatement = createNewBikeStatement
      adventureProperties.createNewGeneralStatement =
        createNewBikeAdventureStatement
      adventureProperties.specificFields = getBikeSpecificFields(adventure)
      adventureProperties.specificIdType = 'adventure_bike_id'
      break
    case 'skiApproach':
      adventureProperties.createNewSpecificStatement =
        createNewApproachStatement
      adventureProperties.createNewGeneralStatement =
        createNewSkiApproachStatement
      adventureProperties.specificFields =
        getSkiApproachSpecificFields(adventure)
      adventureProperties.specificIdType = 'ski_approach_id'
      break
  }

  return adventureProperties
}

const parseAdventures = (adventures) => {
  const parsedAdventures = {}
  parsedAdventures.ski = adventures.filter(
    ({ adventure_type }) => adventure_type === 'ski'
  )
  parsedAdventures.climb = adventures.filter(
    ({ adventure_type }) => adventure_type === 'climb'
  )
  parsedAdventures.hike = adventures.filter(
    ({ adventure_type }) => adventure_type === 'hike'
  )
  parsedAdventures.bike = adventures.filter(
    ({ adventure_type }) => adventure_type === 'bike'
  )
  parsedAdventures.skiApproach = adventures.filter(
    ({ adventure_type }) => adventure_type === 'skiApproach'
  )

  return parsedAdventures
}

const createSpecificProperties = (parsedAdventures) => {
  const specificProperties = {}
  specificProperties.ski = parsedAdventures.ski.map(getSkiSpecificFields)
  specificProperties.climb = parsedAdventures.climb.map(getClimbSpecificFields)
  specificProperties.hike = parsedAdventures.hike.map(getHikeSpecificFields)
  specificProperties.bike = parsedAdventures.bike.map(getBikeSpecificFields)
  specificProperties.skiApproach = parsedAdventures.skiApproach.map(
    getSkiApproachSpecificFields
  )

  return specificProperties
}

const pathAdventures = ['ski', 'hike', 'bike', 'skiApproach']

module.exports = {
  formatAdventureForGeoJSON,
  getSkiSpecificFields,
  getClimbSpecificFields,
  getHikeSpecificFields,
  getBikeSpecificFields,
  getGeneralFields,
  getPropsToImport,
  parseAdventures,
  createSpecificProperties,
  removeUnusedVariables,
  splitPath,
  adventurePathColor,
  adventureTemplate,
  pathAdventures
}
