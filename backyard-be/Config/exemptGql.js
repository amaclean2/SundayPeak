export const exemptQueries = [
    'adventures/all',
    'savePasswordReset',
    'resetPassword',
    'verify',
    'users/login',
    'users/create'
];

export const isOperation = (req, query) => {
    return req.originalUrl.includes(query);
};

export const isExempt = (req) => {
    return exemptQueries.some((query) => req.originalUrl.includes(query));
};