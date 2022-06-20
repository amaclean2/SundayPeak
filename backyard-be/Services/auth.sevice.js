const jwt = require('jsonwebtoken');
const { returnError } = require('../ErrorHandling');
const statuses = require('../statuses');

const secret = 'secret';

const authService = {
    issue: (payload) => jwt.sign(payload, secret, { expiresIn: 17280}),
    validate: async (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            let bearerToken = bearerHeader.split(' ')[1];

            while (bearerToken?.includes('\"')) {
                bearerToken = bearerToken.replace('\"', '');
            }

            await jwt.verify(bearerToken, secret, {}, (error, decoded) => {
                if (error) {
                    return returnError({ 
                        req,
                        res,
                        status: statuses.FORBIDDEN,
                        message: 'Invalid token',
                        error
                    });
                } else {
                    req.body.id = decoded.id;
                    next();
                }
            })
        } else {
            return returnError({
                req,
                res,
                status: statuses.FORBIDDEN,
                message: 'Invalid request'
            })
        }
    }
};

module.exports = authService;