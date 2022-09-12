const { validationResult } = require('express-validator');
const { returnError } = require('../ResponseHandling');
const { getMapboxAccessToken } = require('../Config/connections');
const { CREATED, NO_CONTENT, SUCCESS, ACCEPTED } = require('../ResponseHandling/statuses');
const cryptoHandlers = require('../Crypto');
const authService = require('../Services/auth.service');
const { sendEmail } = require('../Services/resetPassword.service');
const queries = require('../DB');
const { buildUserObject } = require('../Services/user.service');
const logger = require('../Config/logger');
const { sendResponse } = require('../ResponseHandling/success');

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError({ req, res, error: errors.array()[0] });
        }

        const { email, password } = req.body;

        const user = await buildUserObject({ req, res, initiation: { email } });

        if (cryptoHandlers.comparePassword(password, user.password)) {
            delete user.password;
            const token = authService.issue({ id: user.id });

            logger.debug('USER_LOGGED_IN', user, token);

            return sendResponse({ req, res, data: { user, token }, status: SUCCESS });

        } else {
            return returnError({ req, res, message: 'invalidField' });
        }
    } catch (error) {
        return returnError({ req, res, message: 'serverLoginUser', error });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.query;

    try {
        if (!id) throw returnError({ req, res, message: 'idQueryRequired' });

        const userObject = await buildUserObject({ req, res, initiation: { id: Number(id) } });
        delete userObject.password;

        return sendResponse({ req, res, data: { user: userObject }, status: SUCCESS });

    } catch (error) {
        return returnError({ req, res, message: 'serverLoginUser', error });
    }
};

const refetchUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {
        const userObject = await buildUserObject({ req, res, initiation: { id: id_from_token } });
        delete userObject.password;

        return sendResponse({ req, res, data: { user: userObject }, status: SUCCESS });

        res.status(SUCCESS).json({
            data: { user: userObject }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverLoginUser', error });
    }
};

const getLoggedInUser = async (req, res) => {
    try {
        const { id_from_token } = req.body;

        if (id_from_token) {
            const userObject = await buildUserObject({ req, res, initiation: { id: id_from_token } });
            delete userObject.password;

            return sendResponse({ req, res, data: { user: userObject }, status: SUCCESS });

        } else {
            throw returnError({ req, res, message: 'notLoggedIn' });
        }
    } catch (error) {
        return returnError({
            req, res, message: 'serverLoginUser', error
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const emailValidation = await sendEmail(email);

        res.status(SUCCESS).json({
            data: { email }
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverValidateUser', error });
    }
};

const createUser = async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw returnError({ req, res, error: errors.array()[0] });
        }

        const newUser = {
            ...req.body,
            password: cryptoHandlers.hashPassword(req.body.password)
        };

        const newUserId = await queries.addUser(newUser);
        const userObject = await buildUserObject({ req, res, initiation: { id: newUserId } });

        const { id } = userObject;
        const token = authService.issue({ id });
        delete userObject.password;

        logger.debug({ userCreated: true, userObject, token });

        return sendResponse({ req, res, data: { user: userObject, token }, status: CREATED });

    } catch (error) {
        return returnError({ req, res, message: 'serverCreateUser', error });
    }
};

const savePasswordReset = async (req, res) => {
    const { signature, new_password, new_password_2 } = req.body;

    try {
        if (new_password !== new_password_2) {
            throw returnError({ req, res, message: 'nonMatchingPasswords' });
        }

        const response = await validateSignatureAndSave({ signature, new_password });

        res.status(SUCCESS).json({
            data: { email: response }
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverValidateUser', error });
    }
};

const followUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw returnError({ req, res, error: errors.array()[0] });
        }

        const { id_from_token, leader_id } = req.body;

        await queries.followUser({ follower_id: id_from_token, leader_id });

        return sendResponse({ req, res, data: {
            user_id: id_from_token,
            leader_id,
            followed: true
        }, status: ACCEPTED });

    } catch (error) {
        return returnError({ req, res, message: 'serverFollowUser', error });
    }
};

const editUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {

    } catch (error) {
        throw returnError({ req, res, message: 'serverValidationError', error });
    }
};

const deleteUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {
        const deleteResponse = await queries.deleteUser(id_from_token);

        logger.debug('USER_DELETED', deleteResponse);

        res.status(NO_CONTENT).json({
            data: {}
        });
    } catch (error) {
        return returnError({ req, res, message: 'serverValidateUser', error });
    }
};

module.exports = {
    loginUser,
    getUserById,
    refetchUser,
    getLoggedInUser,
    resetPassword,
    createUser,
    savePasswordReset,
    followUser,
    editUser,
    deleteUser
};