const jwt = require('jsonwebtoken');

const secret = 'secret';

const authService = {
    issue: (payload) => jwt.sign(payload, secret, { expiresIn: 10000}),
    validate: async (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];

            await jwt.verify(bearerToken, secret, {}, (error) => {
                if (error) {
                    return res.status(403).json({
                        message: 'Invalid token'
                    });
                }
            })

            next();
        } else {
            res.status(403).json({
                message: 'Invalid request'
            });
        }
    }
};

module.exports = authService;