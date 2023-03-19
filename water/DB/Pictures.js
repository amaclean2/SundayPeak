const {
  createAdventurePictureStatement,
  deletePictureStatement,
  getAdventurePicturesStatement,
  getUserPicturesStatement,
  deleteProfilePictureStatement,
  deletePictureByAdventureStatement
} = require('./Statements')

const addUserPicture = async ({ fileName }) => {}

const addAdventurePicture = async ({ fileName, userId, adventure_id }) => {}

const getUserPictures = async ({ userId }) => {}

const getAdventurePictures = async ({ adventureId }) => []

const deleteAdventurePictures = async ({ file_names }) => {}

const deleteUserPictures = async ({ file_name }) => {}

const deleteProfilePicture = async ({ userId }) => {}

module.exports = {
  addUserPicture,
  addAdventurePicture,
  getUserPictures,
  getAdventurePictures,
  deleteUserPictures,
  deleteProfilePicture,
  deleteAdventurePictures
}
