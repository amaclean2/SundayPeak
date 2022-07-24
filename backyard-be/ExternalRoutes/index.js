const { Router } = require('express');
const { NOT_FOUND } = require('../ErrorHandling/statuses');

const router = Router();

router.use('/', (req, res) => {
    res.status(NOT_FOUND).json({
        message: "No external routes are currently set up."
    });
});

module.exports = router;