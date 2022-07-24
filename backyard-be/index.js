const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { config } = require('dotenv');

const resolvers = require('./Schema/Resolvers');
const authService = require('./Services/auth.service');
const router = require('./ExternalRoutes');

config();

const app = express();
const PORT = process.env.PORT || 8080;

// used for external apis
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// security middleware
app.use(cors());
app.use(helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false
}));

const startApplication = async () => {
    const typeDefs = await loadSchema('./Schema/TypeDefs/*.graphql', {
        loaders: [new GraphQLFileLoader()]
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        context: ({ req }) => ({
            user_id: req.body.id
        })
    });

    await server.start();

    server.applyMiddleware({
        app,
        cors: {
            origin: true,
            credentials: true,
            methods: ['POST'],
            allowedHeaders: [
                'X-Requested-With',
                'X-HTTP-Method-Override',
                'Content-Type',
                'Accept',
                'Authorization',
                'Access-Control-Allow-Origin'
            ]
        }
    });
};

// public routes
app.use('/api', router);

// private routes
app.use('/', authService.validate);

startApplication();

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const workingPort = server.address().port;

    console.log(`Backyard friends backend listening to http://${host}:${workingPort}`);
});

module.exports = {
    server
};