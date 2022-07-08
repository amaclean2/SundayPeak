const { AuthenticationError, ValidationError, UserInputError, ApolloError } = require("apollo-server-express");
const errorTexts = require("../ResponseText/errors");
const { SERVER_ERROR } = require("../statuses");

const returnError = ({ req, res, status: statusCode, message, error, gql }) => {
    messageText = errorTexts[message] || message;

    if (gql) {
        console.log(messageText, error);
        if (statusCode === 401) {
            return new AuthenticationError(messageText, error);
        } else if (statusCode === 406) {
            return new ValidationError(messageText, error);
        }
        else if (statusCode % 400 < 100) {
            return new UserInputError(messageText, error);
        } else {
            return new ApolloError(messageText, error);
        }
    }

    const errorBody = {
        message: messageText
    };

    if (req?.body) {
        errorBody.body = req.body;
    }

    if (statusCode) {
        errorBody.status = statusCode;
    } else {
        errorBody.status = SERVER_ERROR;
    }

    if (error) {
        errorBody.error = error;
    }

    console.error("\x1b[31m%s\x1b[0m", messageText);
    console.log(error);
    
    res.status(!!statusCode ? statusCode : SERVER_ERROR).json(errorBody);
};

module.exports = {
    returnError
};