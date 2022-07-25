import { AuthenticationError, ValidationError, UserInputError, ApolloError } from 'apollo-server-express';
import errorTexts from './ResponseText/errors.js';
import { SERVER_ERROR } from './statuses.js';

export const returnError = ({ req, res, status: statusCode, message, error, gql = true }) => {
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

export const catchBlock = ({ error, message, gql }) => {
    if (error) {
        throw error;
    } else {
        throw returnError({ gql, message, error });
    }
};