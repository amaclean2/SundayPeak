const logger = require('../Config/logger');

const sendResponse = ({ req, res, data, status}) => {
    logger.debug({ data, status });

    return res.status(status).json({
        data,
        statusCode: status
    });
};

module.exports = {
    sendResponse
};