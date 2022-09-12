const Logger = require('byf-custom-logger');

const logger = new Logger({ name: 'friends', verbose: process.env.NODE_ENV === 'dev' });

module.exports = logger;