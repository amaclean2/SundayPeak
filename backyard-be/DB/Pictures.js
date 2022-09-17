const {
	createAdventurePictureStatement,
	createUserPictureStatement,
	deletePictureStatement,
	getAdventurePicturesStatement,
	getUserPicturesStatement
} = require('./Statements')
const db = require('../Config/db.js')

const addUserPicture = async ({ fileName, user_id }) => {
	return db.execute(createUserPictureStatement, [fileName, user_id])
		.then((results) => results)
		.catch((error) => {
			throw {
				message: 'Database insertion failed',
				error
			}
		})
}

const addAdventurePicture = async ({ fileName, user_id, adventure_id }) => {
	return db.execute(createAdventurePictureStatement, [fileName, user_id, adventure_id])
		.then((results) => results)
		.catch((error) => {
			throw {
				message: 'Database insertion failed',
				error
			}
		})
}

const getUserPictures = async ({ user_id }) => {
	try {
		const [results] = await db.execute(getUserPicturesStatement, [user_id])
		return results.map(({ file_name }) => file_name)
	} catch (error) {
		throw {
			message: 'Database retrieval failed',
			error
		}
	}
}

const getAdventurePictures = async ({ adventure_id }) => {
	return db.execute(getAdventurePicturesStatement, [adventure_id])
		.then(([results]) => results.map(({ file_name }) => file_name))
		.catch((error) => {
			throw {
				message: 'Database retrieval failed',
				error
			}
		})
}

const deleteUserPictures = async ({ file_name }) => {
	return db.execute(deletePictureStatement, [file_name])
		.then((results) => results)
		.catch((error) => {
			throw {
				message: 'Database deletion failed',
				error
			}
		})
}

module.exports = {
	addUserPicture,
	addAdventurePicture,
	getUserPictures,
	getAdventurePictures,
	deleteUserPictures
}
