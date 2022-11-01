const { returnError } = require('../ResponseHandling')
const queries = require('../DB')
const { getActivitiesByUser } = require('../DB')
const { mapboxStyles } = require('./utils')

const buildUserObject = async ({ req, res, initiation: { id, email } }) => {
  const {
    getUserById,
    getUser,
    getActivityCountByUser,
    getTicksByUser,
    getFriendCount,
    getUserPictures
  } = queries

  let userObject
  let derivedId = id ? id : null

  if (id) {
    userObject = await getUserById(id)
  } else if (email) {
    userObject = await getUser(email)

    if (!userObject) {
      throw returnError({ req, res, message: 'noAccountExists' })
    }

    derivedId = userObject.id
  } else {
    throw returnError({ req, res, message: 'missingFieldsFetchUser' })
  }

  if (!userObject) {
    throw returnError({ req, res, message: 'noAccountExists' })
  }

  const activity_count = await getActivityCountByUser({ user_id: derivedId })
  const ticks = await getTicksByUser({ user_id: derivedId })
  const activities = await getActivitiesByUser({ user_id: derivedId })
  const friend_count = await getFriendCount({ user_id: derivedId })
  const images = (await getUserPictures({ user_id: derivedId })) || []

  const returnObj = {
    ...userObject,
    activity_count,
    friend_count,
    images,
    map_style: userObject.map_style || mapboxStyles.default,
    activities: activities.map((activity) => ({
      ...activity,
      user_id: activity.creator_id
    })),
    ticks: ticks.map((tick) => ({
      ...tick,
      user_id: tick.creator_id
    }))
  }

  return returnObj
}

module.exports = {
  buildUserObject
}
