const { AuthenticationError, ValidationError, UserInputError, ApolloError } = require("apollo-server-express");
const errorTexts = require('./ResponseText/errors');
const { SERVER_ERROR } = require("./statuses");

const returnError = ({ req, res, status: statusCode, message, error, gql = true }) => {
    const errorData = errorTexts[message];

    const messageText = errorData?.messageText || message;
    const messageCode = errorData?.status || statusCode;

    // handle gql calls
    if (gql) {
        console.log(messageText, error, messageCode % 400);
        if (messageCode === 401) {
            throw new AuthenticationError(messageText, error);
        } else if (messageCode === 406) {
            throw new ValidationError(messageText, error);
        }
        else if (messageCode % 400 < 100) {
            throw new UserInputError(messageText, error);
        } else {
            throw new ApolloError(messageText, error);
        }
    }

    // handle all other calls
    const errorBody = {
        message: messageText
    };

    if (req?.body) {
        errorBody.body = req.body;
    }

    if (messageCode) {
        errorBody.status = messageCode;
    } else {
        errorBody.status = SERVER_ERROR;
    }

    if (error) {
        errorBody.error = error;
    }

    console.error("\x1b[31m%s\x1b[0m", messageText);
    console.log(error);
    
    res.status(!!messageCode ? messageCode : SERVER_ERROR).json(errorBody);
};

const catchBlock = ({ error, message, gql }) => {
    if (error) {
        throw error;
    } else {
        throw returnError({ gql, message, error });
    }
};

module.exports = {
    returnError,
    catchBlock
};