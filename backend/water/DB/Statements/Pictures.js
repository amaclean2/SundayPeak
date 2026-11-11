const createUserPictureStatement =
  'INSERT INTO images (url, creator_id, public) VALUES (?, ?, 1)'
const createAdventurePictureStatement =
  'INSERT INTO images (url, creator_id, adventure_id, public) VALUES (?, ?, ?, 1)'
const getAdventurePicturesStatement =
  'SELECT url FROM images WHERE adventure_id = ?'
const getUserPicturesStatement = 'SELECT url FROM images WHERE creator_id = ?'
const deletePictureStatement = 'DELETE FROM images WHERE url = ?'
const deleteProfilePictureStatement =
  'UPDATE users SET profile_picture_url = "", last_updated = NOW() WHERE id = ?'
const deletePictureByAdventureStatement = 'DELETE FROM images WHERE url = ?'

module.exports = {
  createUserPictureStatement,
  createAdventurePictureStatement,
  getAdventurePicturesStatement,
  getUserPicturesStatement,
  deletePictureStatement,
  deleteProfilePictureStatement,
  deletePictureByAdventureStatement
}
