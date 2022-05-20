const { Router } = require('express');

const router = Router();

router.post('/add' , (req, res) => {
    res.status(200).send({
        msg: 'add tick'
    });
});

router.get('/line' , (req, res) => {
    res.status(200).json({
        msg: 'all ticks for line'
    });
});

router.get('/user' , (req, res) => {
    res.status(200).json({
        msg: 'all ticks for user'
    });
});

module.exports = router;