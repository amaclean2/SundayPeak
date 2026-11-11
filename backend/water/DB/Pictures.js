const {
  deletePictureStatement,
  deleteProfilePictureStatement,
  deletePictureByAdventureStatement
} = require('./Statements')

const deleteAdventurePictures = async ({ file_names }) => {}

const deleteUserPictures = async ({ file_name }) => {}

const deleteProfilePicture = async ({ userId }) => {}

module.exports = {
  deleteUserPictures,
  deleteProfilePicture,
  deleteAdventurePictures
}
