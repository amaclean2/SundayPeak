
const { returnError } = require('../ResponseHandling')
const queries = require('../DB')

const buildUserObject = async ({ req, res, initiation: { id, email }}) => {

	const {
		getUserById,
		getUser,
		getActivityCountByUser,
		getTicksByUser,
		getFollowerCount,
		getFollowingCount,
		getUserPictures
	} = queries

	let userObject
	let derivedId = (id) ? id : null

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
	const follower_count = await getFollowerCount({ user_id: derivedId })
	const following_count = await getFollowingCount({ user_id: derivedId })
	const images = await getUserPictures({ user_id: derivedId }) || []

	const returnObj = {
		...userObject,
		activity_count,
		follower_count,
		following_count,
		images,
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