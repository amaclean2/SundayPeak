const { Router } = require('express');

const router = Router();

const loginValidation = (req, res, next) => {
    console.log('validating user credentials...');
    next();
};

router.post('/login', loginValidation, (req, res) => {
    res.status(200).send({
        msg: 'login user'
    });
});

router.post('/add' , (req, res) => {
    res.status(200).json({
        msg: 'add user'
    });
});

router.get('/other' , (req, res) => {
    res.status(200).json({
        msg: 'other user'
    });
});

router.put('/edit' , (req, res) => {
    res.status(200).json({
        msg: 'edit user'
    });
});

router.delete('/' , (req, res) => {
    res.status(200).send({
        msg: 'delete user'
    });
});

module.exports = router;