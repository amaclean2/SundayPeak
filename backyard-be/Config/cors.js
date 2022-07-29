import errorTexts from "../ErrorHandling/ResponseText/errors";

export const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost',
    'https://friends-dot-backyardfriends.wl.r.appspot.com'
];

export const corsHandler = (origin, cb) => {
    if (!origin) return cb(null, true);
    else if (allowedOrigins.indexOf(origin) === -1) {
        return cb(new Error(errorTexts.corsError.messageText({ origin })), false);
    } else {
        return cb(null, true);
    }
};