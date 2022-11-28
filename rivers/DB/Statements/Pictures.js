const createUserPictureStatement =
  'INSERT INTO user_images (file_name, creator_id, public) VALUES (?, ?, 0)'
const createAdventurePictureStatement =
  'INSERT INTO user_images (file_name, creator_id, adventure_id, public) VALUES (?, ?, ?, 0)'
const getAdventurePicturesStatement =
  'SELECT file_name FROM user_images WHERE adventure_id = ?'
const getUserPicturesStatement =
  'SELECT file_name FROM user_images WHERE creator_id = ?'
const deletePictureStatement = 'DELETE FROM user_images WHERE file_name = ?'
const deleteProfilePictureStatement =
  'UPDATE users SET profile_picture_url = "", last_updated = NOW() WHERE id = ?'
const deletePictureByAdventureStatement =
  'DELETE FROM user_images WHERE file_name = ?'

module.exports = {
  createUserPictureStatement,
  createAdventurePictureStatement,
  getAdventurePicturesStatement,
  getUserPicturesStatement,
  deletePictureStatement,
  deleteProfilePictureStatement,
  deletePictureByAdventureStatement
}
