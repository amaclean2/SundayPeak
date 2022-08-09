import { validationResult } from 'express-validator';
import {
    getUserById as getUserByIdDB,
    getActivityCountByUser,
    getTicksByUser,
    getUser,
    getFollowerCount,
    getFollowingCount,
    deleteUser as deleteUserDB
} from '../DB';
import { returnError } from '../ErrorHandling';
import { getMapboxAccessToken } from '../Config/connections';
import { CREATED, NO_CONTENT, SUCCESS } from '../ErrorHandling/statuses';
import { comparePassword, hashPassword } from '../Crypto';
import authService from '../Services/auth.service';
import { sendEmail } from '../Services/resetPassword.service';
import {
    addUser,
    followUser as followUserDB
} from '../DB';
import { getUserPictures } from '../DB/Pictures';

export const buildUserObject = async ({ req, res, initiation: { id, email }}) => {

    let userObject;

    if (id) {
        userObject = await getUserByIdDB(id);
    } else if (email) {
        userObject = await getUser(email);

        if (!userObject) {
            throw returnError({ req, res, message: 'noAccountExists' });
        }

        id = userObject.id;
    } else if (!!created) {
        userObject = created;
    } else {
        throw returnError({ req, res, message: 'missingFieldsFetchUser' });
    }

    if (!userObject) {
        throw returnError({ req, res, message: 'noAccountExists' });
    }

    const activity_count = await getActivityCountByUser({ user_id: id });
    const ticks = await getTicksByUser({ user_id: id });
    const follower_count = await getFollowerCount({ user_id: id });
    const following_count = await getFollowingCount({ user_id: id });
    const images = await getUserPictures({ user_id: id }) || [];

    console.log({ follower_count, following_count, activity_count });

    const returnObj = {
        ...userObject,
        activity_count,
        follower_count,
        following_count,
        images,
        ticks: ticks.map((tick) => ({
            ...tick,
            user_id: tick.creator_id
        }))
    };

    return returnObj;
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('ERRORS', errors);
            return returnError({ req, res, error: errors.array()[0] });
        }

        const { email, password } = req.body;

        const user = await buildUserObject({req, res, initiation: { email }});

        if (comparePassword(password, user.password)) {
            delete user.password;
            const token = authService.issue({ id: user.id });

            console.log({ message: 'USER_LOGGED_IN', user, token });

            res.status(SUCCESS).json({
                data: {
                    user,
                    token
                }
            });

        } else {
            return returnError({ req, res, message: 'invalidField' });
        }
    } catch (error) {
        return returnError({ req, res, message: 'serverLoginUser', error });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.query;

    try {
        const userObject = await buildUserObject({ req, res, initiation: { id }});
        delete userObject.password;

        res.status(SUCCESS).json({
            data: { user: userObject }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverLoginUser', error });
    }
};

export const refetchUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {
        const userObject = await buildUserObject({ req, res, initiation: { id: id_from_token }});
        delete userObject.password;

        res.status(SUCCESS).json({
            data: { user: userObject }
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverLoginUser', error });
    }
};

export const getLoggedInUser = async (req, res) => {
    try {
        const { id_from_token } = req.body;

        if (id_from_token) {
            const userObject = await buildUserObject({ req, res, initiation: { id: id_from_token }});
            delete userObject.password;

            res.status(SUCCESS).json({
                data: {
                    user: userObject,
                    mapbox_token: getMapboxAccessToken()
                }
            });

        } else {
            throw returnError({ req, res, message: 'notLoggedIn' });
        }
    } catch (error) {
        return returnError({
            req, res, message: 'serverLoginUser', error });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const emailValidation = await sendEmail(email);

        console.log({ emailValidation });
        res.status(SUCCESS).json({
            data: { email }
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverValidateUser', error });
    }
};

export const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError({ req, res, error: errors.array()[0] });
        }

        const newUser = {
            ...req.body,
            password: hashPassword(req.body.password)
        };

        const newUserId = await addUser(newUser);
        const userObject = await buildUserObject({ req, res, initiation: { id: newUserId }});

        const { id } = userObject;
        const token = authService.issue({ id });
        delete userObject.password;

        console.log({ message: 'USER_CREATED', userObject, token });

        res.status(CREATED).json({
            data: {
                user: userObject,
                token
            }
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverCreateUser', error });
    }
};

export const savePasswordReset = async (req, res) => {
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

export const followUser = async (req, res) => {
    const { id_from_token } = req.body;
    const { leader_id } = req.query;

    try {
        await followUserDB({ follower_id: id_from_token, leader_id });

        res.status(200).json({
            data: {
                user_id: id_from_token,
                leader_id,
                followed: true
            }
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverFollowUser', error });
    }
};

export const editUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {
        
    } catch (error) {
        throw returnError({ req, res, message: 'serverValidationError', error });
    }
};

export const deleteUser = async (req, res) => {
    const { id_from_token } = req.body;

    try {
        const deleteResponse = await deleteUserDB(id_from_token);
        
        console.log("USER_DELETED", deleteResponse);

        res.status(NO_CONTENT).json({
            data: {}
        });
    } catch (error) {
        return returnError({ req, res, message: 'serverValidateUser', error });
    }
};