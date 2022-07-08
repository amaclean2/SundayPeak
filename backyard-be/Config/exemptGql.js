const exemptQueries = [
    'getAllAdventures',
    'IntrospectionQuery'
];

const isOperation = (body, query) => {
    if (body.operationName && body.operationName === query) {
        return true;
    } else if (body.query && body.query.includes(query)) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    exemptQueries,
    isOperation
};