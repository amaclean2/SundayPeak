const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer } = require('apollo-server-express');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

const resolvers = require('./Schema/Resolvers');
const authService = require('./Services/auth.sevice');
const router = require('./ExternalRoutes');

const app = express();
const port = process.env.PORT || 5000;

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
        context: (requestObject) => ({
            user_id: requestObject.req.body.id
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

app.listen({ port }, () => {
    console.log(`Backyard friends running on http://localhost:5000`);
});