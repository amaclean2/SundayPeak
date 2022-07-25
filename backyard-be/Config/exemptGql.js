export const exemptQueries = [
    'getAllAdventures',
    'IntrospectionQuery',
    'savePasswordReset',
    'resetPasswordEmail'
];

export const isOperation = (body, query) => {
    if (body.operationName && body.operationName === query) {
        return true;
    } else if (body.query && body.query.includes(query)) {
        return true;
    } else {
        return false;
    }
};

export const isExempt = (body) => {
    if (body.operationName && exemptQueries.includes(body.operationName)) {
        return true;
    } else if (body.query) {
        return exemptQueries.find((query) => body.query.includes(query));
    } else {
        return false;
    }
};