const { nanoid } = require('nanoid')
const sharp = require('sharp')

const createThumb = async (input) => ({
  originalname: `thumbs/${input.originalname}`,
  encoding: input.encoding,
  mimetype: input.mimetype,
  buffer: await sharp(input.buffer).jpeg().resize({ width: 500 }).toBuffer()
})

const createMain = async (input) => ({
  originalname: input.originalname,
  encoding: input.encoding,
  mimetype: input.mimetype,
  buffer: await sharp(input.buffer)
    .resize({ width: 1500, height: 1500, fit: 'contain' })
    .withMetadata()
    .webp()
    .toBuffer()
})

const createDefaultProfilePicture = async ({ userFirstName, userLastName }) => {
  // const [firstInitial] = userFirstName.split('')
  // const [lastInitial] = userLastName.split('')
  return sharp({
    create: {
      // text: `${firstInitial} ${lastInitial}`,
      // font: 'sans',
      // align: 'center',
      width: 200,
      height: 200,
      channels: 3,
      background: {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
      }
    }
  })
    .png()
    .toBuffer()
    .then((resp) => ({
      originalname: `profile_pictures/${userFirstName}_${userLastName}.png`,
      buffer: resp
    }))
}

const createProfilePicture = async (input) => {
  const image = sharp(input.buffer)
  const croppedImage = await image.metadata().then((meta) => {
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
      .webp()
      .toBuffer()
  })

  return {
    originalname: `profile_pictures/${nanoid(10)}`,
    encoding: input.encoding,
    mimetype: input.mimetype,
    buffer: croppedImage
  }
}

module.exports = {
  createThumb,
  createMain,
  createProfilePicture,
  createDefaultProfilePicture
}
