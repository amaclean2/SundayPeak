/**

const getListFiles = async (req, res) => {
  try {
    const [files] = await bucket.getFiles()
    const fileInfos = []

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink
      })
    })

    return sendResponse({ req, res, status: SUCCESS, data: fileInfos })
  } catch (error) {
    return returnError({
      req,
      res,
      status: SERVER_ERROR,
      message: 'Unable to read list of files!'
    })
  }
}

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.query.name).getMetadata()
    return sendResponse({ req, res, status: SUCCESS, data: metaData.mediaLink })
  } catch (error) {
    return returnError({
      req,
      res,
      status: SERVER_ERROR,
      message: `Could not download the file: ${error.message}`
    })
  }
}

*/
