import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from 'apollo-server-express';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { config } from 'dotenv';

import resolvers from './Schema/Resolvers';
import authService from './Services/auth.service.js';
import router from './Routing';

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
app.use('/api', authService.validate, router);

startApplication();

export const server = app.listen(PORT, () => {
    const host = server.address().address;
    const workingPort = server.address().port;

    console.log(`Backyard friends backend listening to http://${host}:${workingPort}`);
});