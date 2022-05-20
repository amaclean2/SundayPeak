const { Router } = require('express');

const router = Router();

router.post('/' , (req, res) => {
    res.status(200).send({
        msg: 'lines for area'
    });
});

router.post('/add' , (req, res) => {
    res.status(200).json({
        msg: 'add line'
    });
});

router.get('/detail' , (req, res) => {
    res.status(200).json({
        msg: 'line details'
    });
});

router.put('/edit' , (req, res) => {
    res.status(200).json({
        msg: 'edit line'
    });
});

router.delete('/' , (req, res) => {
    res.status(200).send({
        msg: 'delete line'
    });
});

module.exports = router;