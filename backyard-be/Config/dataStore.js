const multer = require('multer');
const multers3 = require('multer-s3');
const aws = require('aws-sdk');
const logger = require('../Config/logger');

const { CREATED, SERVER_ERROR } = require('../ResponseHandling/statuses');

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.DO_BUCKET;
const accessKeyId = process.env.DO_ACCESS_KEY_ID;
const secretAccessKey = process.env.DO_SECRET_ACCESS_KEY;

const connectS3 = () => {
    const spacesEndpoint = new aws.Endpoint(endpoint);
    return new aws.S3({ endpoint: spacesEndpoint });
};

const uploadHandler = (req, res) => {

    if (process.env.NODE_ENV === 'test') {
        return res.status(CREATED).json({
            data: {
                message: 'File uploaded successfully',
                status: CREATED
            }
        });
    }

    aws.config.update({ accessKeyId, secretAccessKey });

    const upload = multer({
        storage: multers3({
            s3: connectS3(),
            bucket,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, req.file_id);
            }
        })
    }).single('image');

    return upload(req, res, (error) => {
        if (error) {
            logger.error('ERROR_ UPLOADING_IMAGE', error);
            
            return res.status(SERVER_ERROR).json({
                data: {
                    message: 'Error uploading image',
                    error,
                    status: SERVER_ERROR
                }
            });
        }

        res.status(CREATED).json({
            data: {
                message: 'File uploaded successfully',
                status: CREATED
            }
        });
    });
};

module.exports = {
    connectS3,
    uploadHandler
};