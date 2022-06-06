const errorTexts = require("../ResponseText/errors");
const { SERVER_ERROR } = require("../statuses");

const returnError = ({ req, res, status, message, error }) => {
    messageText = errorTexts[message] || message;

    const errorBody = {
        message: messageText
    };

    if (req?.body) {
        errorBody.credentials = req.body;
    }

    if (status) {
        errorBody.status = status;
    } else {
        errorBody.status = SERVER_ERROR;
    }

    if (error) {
        errorBody.error = error.toString();
    }

    res.status(!!status ? status : SERVER_ERROR).json(errorBody);

    console.error(error);
};

module.exports = {
    returnError
};