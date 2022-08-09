export const exemptQueries = [
    '/adventures/all',
    '/adventures/details',
    'savePasswordReset',
    'resetPassword',
    '/verify',
    '/users/login',
    '/users/create'
];

export const isPath = (req, query) => {
    return req.originalUrl.includes(query);
};

export const isExempt = (req) => {
    return exemptQueries.some((query) => req.originalUrl.includes(query));
};