import errorTexts from './ResponseText/errors.js';
import { SERVER_ERROR } from './statuses.js';

export const returnError = ({ req, res, status: statusCode, message = 'Error', error }) => {

    if (error?.handled) {
        return null;
    }

    let errorData;
    let messageText;
    let messageCode;

    if (error?.msg) {
        errorData = errorTexts[error.msg];
        messageText = errorData?.messageText;
        messageCode = errorData?.status;
    } else {
        errorData = errorTexts[message];
        messageText = errorData?.messageText || message;
        messageCode = errorData?.status || statusCode;
    }

    const errorBody = {
        message: messageText,
        handled: true
    };

    if (req?.body) {
        errorBody.body = req.body;
    }

    if (messageCode) {
        errorBody.status = messageCode;
    } else {
        errorBody.status = SERVER_ERROR;
    }

    if (error && !error.msg) {
        errorBody.error = error;
    }

    console.error("\x1b[31m%s\x1b[0m", messageText);
    console.log(error);

    res.status(!!messageCode ? messageCode : SERVER_ERROR).json(errorBody);

    return errorBody;
};