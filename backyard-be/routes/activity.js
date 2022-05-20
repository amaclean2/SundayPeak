const { Router } = require('express');

const router = Router();

router.post('/add' , (req, res) => {
    res.status(200).send({
        msg: 'add activity'
    });
});

router.get('/line' , (req, res) => {
    res.status(200).json({
        msg: 'all activities for line'
    });
});

router.get('/user' , (req, res) => {
    res.status(200).json({
        msg: 'all activities for user'
    });
});

module.exports = router;