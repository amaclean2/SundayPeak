const sharp = require('sharp')
const fs = require('fs')

const createThumb = ({ file }) => {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 300 })
      .toFile(
        `${file.destination}/thumbs/${file.originalname.replace(/ /g, '')}`,
        (error, resizeImage) => {
          error && reject(error)
          resolve(resizeImage)
        }
      )
  })
}

const createMain = ({ file }) => {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 1500, height: 1500, fit: 'contain' })
      .withMetadata()
      .toBuffer((error) => {
        error ? reject(error) : resolve()
      })
  })
}

/**
 * @param {Object} params
 * @param {string} params.directory
 * @param {number} params.userId
 * @returns {Promise<Object>} an object containing the new file name and the userId
 */
const createDefaultProfilePicture = async ({ directory, userId }) => {
  return new Promise((resolve, reject) => {
    const newFileName = userId + '.png'

    sharp({
      create: {
        // text: userInitials,
        font: 'sans',
        align: 'center',
        width: 200,
        height: 200,
        channels: 3,
        background: {
          r: Math.floor(Math.random() * 255),
          g: Math.floor(Math.random() * 255),
          b: Math.floor(Math.random() * 255)
        }
      }
    }).toFile(`${directory}/profile/${newFileName}`, (error) => {
      error && reject(error)
      resolve({ fileName: newFileName, userId })
    })
  })
}

const createProfilePicture = async ({ file }) => {
  return new Promise((resolve, reject) => {
    const image = sharp(file.path)
    image.metadata().then((meta) => {
      const { width: imageWidth, height: imageHeight } = meta
      let top, left, width, height

      // crop square to the center of the image
      if (imageWidth > imageHeight) {
        top = 0
        left = imageWidth / 2 - imageHeight / 2
        height = imageHeight
        width = imageHeight
      } else if (imageHeight > imageWidth) {
        top = imageHeight / 2 - imageWidth / 2
        left = 0
        width = imageWidth
        height = imageWidth
      } else {
        top = 0
        width = 0
        height = imageWidth
        width = imageWidth
      }

      return image
        .extract({
          left: Math.round(left),
          top: Math.round(top),
          width: Math.round(width),
          height: Math.round(height)
        })
        .resize({ width: 500 })
        .toFile(
          `${file.destination}/profile/${file.originalname.replace(/ /g, '')}`,
          (error, resizeImage) => {
            error && reject(error)

            fs.unlink(
              `${process.env.FILE_STORAGE_PATH}/${file.originalname.replace(
                / /g,
                ''
              )}`,
              (removeError) => {
                removeError && reject(removeError)

                resolve(resizeImage)
              }
            )
          }
        )
    })
  })
}

/**
 * @param {Object} params
 * @param {string} params.url
 * @returns {Promise<string>} response status
 */
const removeImage = async ({ url }) => {
  let finalPath

  if (!url || url === 'null') {
    return 'url must be present for image to be removed'
  }

  if (url?.includes('/profile')) {
    // remove a profile picture
    finalPath = url?.split('/profile')[1]
    return new Promise((resolve, reject) => {
      fs.unlink(
        `${process.env.FILE_STORAGE_PATH}/profile${finalPath}`,
        (error) => {
          if (error.errno.toString() === '-2') {
            return resolve('image already removed')
          } else if (error) {
            return reject(error)
          }

          return resolve('image removed successfully')
        }
      )
    })
  } else {
    // remove a regular image
    finalPath = url?.split('images/')[1]
    finalPath = finalPath?.replace('thumbs/', '')
    const mainRemoval = new Promise((resolve, reject) => {
      fs.unlink(`${process.env.FILE_STORAGE_PATH}/${finalPath}`, (error) => {
        if (error.errno.toString() === '-2') {
          return resolve('image already removed')
        } else if (error) {
          return reject(error)
        }

        return resolve('image removed successfully')
      })
    })

    const thumbRemoval = new Promise((resolve, reject) => {
      fs.unlink(
        `${process.env.FILE_STORAGE_PATH}/thumbs/${finalPath}`,
        (error) => {
          if (error.errno.toString() === '-2') {
            return resolve('thumb already removed')
          } else if (error) {
            return reject(error)
          }

          return resolve('thumb removed successfully')
        }
      )
    })

    return Promise.all([mainRemoval, thumbRemoval]).then((responses) => {
      return responses
    })
  }
}

module.exports = {
  createThumb,
  createMain,
  createProfilePicture,
  createDefaultProfilePicture,
  removeImage
}
