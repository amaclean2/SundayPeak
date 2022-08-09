import jwt from 'jsonwebtoken';

import { getJWTSecret } from '../Config/connections.js';
import { isExempt, isPath } from '../Config/exemptGql.js';
import { returnError } from '../ErrorHandling';

const authService = {
    issue: (payload) => jwt.sign(payload, getJWTSecret(), { expiresIn: '48h'}),
    validate: async (req, res, next) => {
        if (isExempt(req)) {
            return next();
        }

        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            let bearerToken = bearerHeader.split(' ')[1];

            while (bearerToken?.includes('\"')) {
                bearerToken = bearerToken.replace('\"', '');
            }

            await jwt.verify(bearerToken, getJWTSecret(), {}, (error, decoded) => {

                if (error) {
                    return returnError({
                        req,
                        res,
                        message: error.name,
                        error
                    });
                } else {

                    if (!req.body) req.body = { id_from_token: decoded.id };
                    else req.body.id_from_token = decoded.id;
                    
                    return next();
                }
            })
        } else if (isPath(req, '/initial')) {
            return next();
        } else {
            return returnError({
                req,
                res,
                message: 'notLoggedIn'
            })
        }
    }
};

export default authService;