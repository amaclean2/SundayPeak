const jwt = require('jsonwebtoken');

const { getJWTSecret } = require('../Config/connections');
const { exemptQueries, isOperation, isExempt } = require('../Config/exemptGql');
const { returnError } = require('../ErrorHandling');
const statuses = require('../ErrorHandling/statuses');
const { validateLoginUser, validateCreateUser } = require('../Validators/UserValidators');

const authService = {
    issue: (payload) => jwt.sign(payload, getJWTSecret(), { expiresIn: '48h'}),
    validate: async (req, res, next) => {
        if (isExempt(req.body)) {
            return next();
        }

        // validation for form inputs
        if (isOperation(req.body, 'login')) {
            return validateLoginUser(req, res, next);
        }

        if (isOperation(req.body, 'createUser')) {
            return validateCreateUser(req, res, next);
        }

        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            let bearerToken = bearerHeader.split(' ')[1];

            while (bearerToken?.includes('\"')) {
                bearerToken = bearerToken.replace('\"', '');
            }

            await jwt.verify(bearerToken, getJWTSecret(), {}, (error, decoded) => {
                if (error) {
                    throw returnError({ 
                        gql: false,
                        req,
                        res,
                        status: statuses.FORBIDDEN,
                        message: 'Invalid token',
                        error
                    });
                } else {
                    req.body.id = decoded.id;
                    return next();
                }
            })
        } else {
            throw returnError({
                gql: false,
                req,
                res,
                status: statuses.FORBIDDEN,
                message: 'Invalid request'
            })
        }
    }
};

module.exports = authService;