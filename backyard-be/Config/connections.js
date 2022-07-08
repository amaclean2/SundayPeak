const { config } = require('dotenv');

config();

const getDBConnectionObject = () => {

    console.log("NODE_ENV", process.env.NODE_ENV);

    switch (process.env.NODE_ENV) {
        case 'stage':
        case 'dev':
            return {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT
            };
        default:
            return {
                host: 'localhost',
                user: 'root',
                password: 'backyard',
                database: 'friends',
            };
    }
};

const getJWTSecret = () => {
    switch (process.env.NODE_ENV) {
        case 'stage':
            return process.env.JWT_SECRET;
        default:
            return 'secret';
    }
};

module.exports = {
    getDBConnectionObject,
    getJWTSecret
};