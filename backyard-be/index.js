const express = require('express');
const { ApolloServer} = require('apollo-server-express');
const { loadSchema } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

const resolvers = require('./Schema/Resolvers');

const app = express();

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