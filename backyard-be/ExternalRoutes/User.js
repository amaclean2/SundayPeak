const { Router } = require('express');

const { validateLoginUser, validateCreateUser } = require('../Validators/UserValidators');
const authService = require('../Services/auth.sevice');
const { addUser: addUserDB, getUser: getUserDB } = require('../DB');
const { hashPassword, comparePassword } = require('../Crypto');
const { NOT_FOUND, ACCEPTED, NOT_ACCEPTABLE, SERVER_ERROR, CREATED } = require('../statuses');
const { returnError } = require('../ErrorHandling');


const userRouter = Router();

userRouter.post('/login', validateLoginUser, async (req, res) => {
    try {
        const { email, password } = req.body;
        // queries for the email address
        const user = await getUserDB(email);
        if (!user) {
            return returnError({ req, res, status: NOT_FOUND, message: 'noAccountExists' });
        }

        if (comparePassword(password, user.password)) {
            delete user.password;
            const token = authService.issue({ id: user.id });

            console.log({ message: 'USER_LOGGED_IN', user, token });
            res.status(ACCEPTED).json({ user, status: ACCEPTED, token });

        } else {
            return returnError({ req, res, status: NOT_ACCEPTABLE, message: 'invalidPassword' });
        }

    } catch (error) {
        return returnError({ req, res, status: SERVER_ERROR, message: 'serverLoginUser', error });
    }
});

userRouter.post('/signup', validateCreateUser, async (req, res) => {
    try {
        const newUser = {
            ...req.body,
            password: hashPassword(req.body.password)
        };

        const { id } = await addUserDB(newUser);
        const token = authService.issue({ id });
        delete newUser.password;

        console.log({ message: 'USER_CREATED', newUser, token });
        res.status(CREATED).json({
            user: newUser,
            status: CREATED,
            token
        });

    } catch (error) {
        return returnError({ req, res, status: SERVER_ERROR, message: 'serverCreateUser', error });
    }
});

module.exports = userRouter;