const {
    createAdventurePictureStatement,
    createUserPictureStatement,
    deletePictureStatement,
    getAdventurePicturesStatement,
    getUserPicturesStatement
} = require('./Statements');
const db = require('../Config/db.js');

const addUserPicture = async ({ fileName, userId }) => {
    return db.promise().execute(createUserPictureStatement, [fileName, userId])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

const addAdventurePicture = async ({ fileName, userId, adventureId }) => {
    return db.promise().execute(createAdventurePictureStatement, [fileName, userId, adventureId])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database insertion failed',
                error
            };
        });
};

const getUserPictures = async ({ user_id }) => {
    try {
        const [results, ...extras] = await db.execute(getUserPicturesStatement, [user_id]);
        return results.map(({ file_name }) => file_name);
    } catch (error) {
        throw {
            message: 'Database retrieval failed',
            error
        };
    };
};

const getAdventurePictures = async ({ adventure_id }) => {
    return db.promise().execute(getAdventurePicturesStatement, [adventure_id])
        .then(([results, ...extras]) => results.map(({ file_name }) => file_name))
        .catch((error) => {
            throw {
                message: 'Database retrieval failed',
                error
            };
        });
}

const deleteUserPictures = async ({ file_name }) => {
    return db.promise().execute(deletePictureStatement, [file_name])
        .then((results) => results)
        .catch((error) => {
            throw {
                message: 'Database deletion failed',
                error
            };
        });
};

module.exports = {
    addUserPicture,
    addAdventurePicture,
    getUserPictures,
    getAdventurePictures,
    deleteUserPictures
};
