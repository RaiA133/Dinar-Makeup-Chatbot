import express from 'express'

const app = express.Router();

import chatbotRouter from './chatbotRoute.js';

app.use('/', chatbotRouter)

export default app;
