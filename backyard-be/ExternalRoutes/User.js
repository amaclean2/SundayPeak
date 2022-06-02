const { Router } = require("express");

const { validateLoginUser, validateCreateUser } = require("../Validators/UserValidators");
const Users = require('../SampleData/UserData.json');
const authService = require("../Services/auth.sevice");

const userRouter = Router();

const login = async (req, res, next) => {
    const credentials = req.body;

    try {
        await validateLoginUser(credentials);
        next();
    } catch(error) {
        res.status(400).json({
            message: 'Could not authenticate user',
            error: error.toString()
        });
    }
};

const register = async (req, res, next) => {
    const credentials = req.body;

    try {
        await validateCreateUser(credentials);
        next();
    } catch(error) {
        res.status(400).json({
            message: 'Could not create user',
            error: error.toString()
        });
    }
    console.log("REGISTRATION");
    next();
};

userRouter.post('/login', login, (req, res) => {
    try {
        const { email } = req.body;
        const selectedUser = Users.find((user) => user.email === email);
        const token = authService.issue({ id: selectedUser.id });

        res.status(200).json({
            user: selectedUser,
            token
        });
    } catch (error) {
        res.status(400).json({
            message: 'Could not authenticate user',
            credentials: req.body,
            error: error.toString()
        });
    }
});

userRouter.post('/signup', register, (req, res) => {
    try {
        const newUser = req.body;
        newUser.id = Users.length;

        Users.push(newUser);
        const token = authService.issue({ id: newUser.id });

        res.status(200).json({
            user: newUser,
            token
        });
    } catch (error) {
        res.status(400).json({
            message: 'Could not authenticate user',
            credentials: req.body,
            error: error.toString()
        });
    }
});

module.exports = userRouter;