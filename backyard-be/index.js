import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

import authService from './Services/auth.service.js';
import router from './Routing';
import { corsHandler } from './Config/cors.js';

config();

const app = express();
const PORT = process.env.PORT || 8080;

// used for external apis
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// security middleware
app.use(cors({ origin: corsHandler }));
app.use(helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false
}));

// public routes
app.use('/api', authService.validate, router);

export const server = app.listen(PORT, () => {
    const host = server.address().address;
    const workingPort = server.address().port;

    console.log(`Backyard friends backend listening to http://${host}:${workingPort}`);
});