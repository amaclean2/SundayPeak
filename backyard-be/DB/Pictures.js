import { createAdventurePictureStatement, createUserPictureStatement, deletePictureStatement, getAdventurePicturesStatement, getUserPicturesStatement } from './Statements';
import db from '../Config/db.js';

export const addUserPicture = async ({ fileName, userId }) => {
    return db.promise().execute(createUserPictureStatement, [fileName, userId])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

export const addAdventurePicture = async ({ fileName, userId, adventureId }) => {
    return db.promise().execute(createAdventurePictureStatement, [fileName, userId, adventureId])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

export const getUserPictures = async ({ user_id }) => {
    return db.promise().execute(getUserPicturesStatement, [user_id])
        .then(([results, ...extras]) => results.map(({ file_name }) => file_name))
        .catch((error) => {
            throw {
                message: 'Database retrieval failed',
                error
            };
        });
};

export const getAdventurePictures = async ({ adventure_id }) => {
    return db.promise().execute(getAdventurePicturesStatement, [adventure_id])
        .then(([results, ...extras]) => results.map(({ file_name }) => file_name))
        .catch((error) => {
            throw {
                message: 'Database retrieval failed',
                error
            };
        });
}

export const deleteUserPictures = async ({ file_name }) => {
    return db.promise().execute(deletePictureStatement, [file_name])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database deletion failed',
                error
            };
        });
};
