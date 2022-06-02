const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { ApolloServer} = require('apollo-server-express');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

const resolvers = require('./Schema/Resolvers');
const app = express();

// used for external apis
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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
        csrfPrevention: true
    });

    await server.start();

    server.applyMiddleware({
        app
    });
};

startApplication();

app.listen({ port: 5000}, () => {
    console.log(`Backyard friends running on http://localhost:5000`);
});