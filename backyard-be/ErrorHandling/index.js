import { AuthenticationError, ValidationError, UserInputError, ApolloError } from 'apollo-server-express';
import errorTexts from './ResponseText/errors.js';
import { SERVER_ERROR } from './statuses.js';

export const returnError = ({ req, res, status: statusCode, message, error, gql = false }) => {
    const errorData = errorTexts[message];

    const messageText = errorData?.messageText || message;
    const messageCode = errorData?.status || statusCode;

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

export const catchBlock = ({ error, message }) => {
    if (error) {
        throw error;
    } else {
        throw returnError({ message, error });
    }
};