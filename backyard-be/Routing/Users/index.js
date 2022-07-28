import { Router } from 'express';
import { userCreateValidator, userLoginValidator } from '../../Validators/UserValidators';
import { CREATED, NOT_FOUND, SUCCESS } from '../../ErrorHandling/statuses';
import { sendEmail } from '../../Services/resetPassword.service';
import { returnError } from '../../ErrorHandling';
import { buildUserObject } from '../../Handlers/Users';
import { comparePassword, hashPassword } from '../../Crypto';
import authService from '../../Services/auth.service';
import { validationResult } from 'express-validator';
import { addUser, followUser } from '../../DB';

const router = Router();

router.post('/login', userLoginValidator(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("ERRORS", errors);
            return returnError({ req, res, error: errors.array()[0] });
        }

        const { email, password } = req.body;
        const user = await buildUserObject({ email });

        if (comparePassword(password, user.password)) {
            delete user.password;
            const token = authService.issue({ id: user.id });

            console.log({ message: 'USER_LOGGED_IN', user, token });

            res.status(SUCCESS).json({
                user,
                token
            });

        } else {
            return returnError({ req, res, message: 'invalidPassword' });
        }
    } catch (error) {
        return returnError({ req, res, message: 'serverLoginUser', error });
    }
});

router.get('/id', async (req, res) => {
    const { id } = req.query;

    try {
        const userObject = await buildUserObject({ id });

        res.status(SUCCESS).json(userObject);

    } catch (error) {
        throw returnError({ req, res, message: 'serverLoginUser', error });
    }
});

router.get('/loggedIn', async (req, res) => {
    try {
        const { id_from_token } = req.body;

        if (id_from_token) {
            const userObject = await buildUserObject({ id: id_from_token });

            res.status(SUCCESS).json(userObject);

        } else {
            throw returnError({ req, res, message: 'notLoggedIn' });
        }
    } catch (error) {
        throw returnError({ req, res, message: 'serverLoginUser', error });
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const { email } = req.body;
        const emailValidation = await sendEmail(email);

        console.log({ emailValidation });
        res.status(SUCCESS).json({ email });

    } catch (error) {
        throw returnError({ req, res, message: 'serverValidateUser', error });
    }
});

router.post('/create', userCreateValidator(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError({ req, res, error: errors.array()[0] });
        }

        const newUser = {
            ...req.body,
            password: hashPassword(req.body.password)
        };

        const createdUser = await addUser(newUser);
        const { id } = createdUser;
        const token = authService.issue({ id });
        delete createdUser.password;

        console.log({ message: 'USER_CREATED', createdUser, token });

        res.status(CREATED).json({
            user: createdUser,
            token
        });

    } catch (error) {
        return returnError({ req, res, message: 'serverCreateUser', error });
    }
});

router.post('/savePasswordReset', async (req, res) => {
    const { signature, new_password, new_password_2 } = req.body;

    try {
        if (new_password !== new_password_2) {
            throw returnError({ req, res, message: 'nonMatchingPasswords' });
        }

        const response = await validateSignatureAndSave({ signature, new_password });

        res.status(SUCCESS).json({
            email: response
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverValidateUser', error });
    }
});

router.put('/edit', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.delete('/delete', (req, res) => {
    res.status(NOT_FOUND).json({
        message: 'API to be created'
    });
});

router.get('/follow', async (req, res) => {
    const { id_from_token } = req.body;
    const { leader_id } = req.query;

    try {
        await followUser({ follower_id: id_from_token, leader_id });

        res.status(200).json({
            user_id: id_from_token,
            leader_id,
            followed: true
        });

    } catch (error) {
        throw returnError({ req, res, message: 'serverFollowUser', error });
    }
});

router.use('/', (req, res) => {
    res.status(400).json({
        message: 'Please select a method on Users'
    });
});

export default router;