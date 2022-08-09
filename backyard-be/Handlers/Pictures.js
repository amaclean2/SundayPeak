import multer from 'multer';
import multers3 from 'multer-s3';
import { nanoid } from 'nanoid';
import aws from 'aws-sdk';

import { returnError } from '../ErrorHandling';
import { CREATED, NO_CONTENT, SERVER_ERROR, SUCCESS } from '../ErrorHandling/statuses';
import { addAdventurePicture, addUserPicture, deleteUserPictures, getUserPictures } from '../DB/Pictures';

const endpoint = process.env.S3_ENDPOINT;
const bucket = process.env.DO_BUCKET;
const accessKeyId = process.env.DO_ACCESS_KEY_ID;
const secretAccessKey = process.env.DO_SECRET_ACCESS_KEY;

aws.config.update({ accessKeyId, secretAccessKey });

const spacesEndpoint = new aws.Endpoint(endpoint);
const s3 = new aws.S3({
    endpoint: spacesEndpoint
});

const upload = multer({
    storage: multers3({
        s3,
        bucket,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, req.file_id);
        }
    })
}).single('image');

const uploadHandler = (req, res) => {
    return upload(req, res, (error) => {
        if (error) {
            console.log('ERROR_UPLOADING_IMAGE', error);
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

export const uploadPictures = async (req, res) => {
    try {
        const fileId = nanoid();
        const prefix = `https://${bucket}.${endpoint}/`;
        req.file_id = fileId;

        await addUserPicture({ fileName: `${prefix}${fileId}`, userId: req.body.id_from_token });

        uploadHandler(req, res);
    } catch (error) {
        return returnError({ req, res, error, message: 'serverUploadPictures' });
    }
};

export const uploadAdventurePictures = async (req, res) => {
    try {
        const { adventure_id } = req.query;
        const fileId = nanoid();
        const prefix = `https://${bucket}.${endpoint}/`;
        req.file_id = fileId;

        await addAdventurePicture({
            fileName: `${prefix}${fileId}`,
            userId: req.body.id_from_token,
            adventureId: adventure_id
        });

        uploadHandler(req, res);
    } catch (error) {
        return returnError({ req, res, error, message: 'serverUploadPictures' });
    }
};

export const deletePictures = async (req, res) => {
    const { file_name } = req.body;
    
    try {
        const resp = await deleteUserPictures({ file_name });
        s3.deleteObject({ Bucket: bucket, Key: file_name.split('.com/')[1]}, (error, data) => {
            if (error) {
                console.log("S3_DELETION", error);
                throw error;
            }

            console.log("PICTURE_DELETION", resp, data);

            res.status(NO_CONTENT).json({
                data: {}
            });
        });

    } catch (error) {
        return returnError({ req, res, error, message: 'serverUploadPictures' });
    }
};