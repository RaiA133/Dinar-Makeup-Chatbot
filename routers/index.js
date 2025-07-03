import express from 'express'

const app = express.Router();

import chatbotRouter from './chatbotRoute.js';
import seoRouter from './seoRoute.js';

app.use('/', chatbotRouter)
app.use('/', seoRouter)

export default app;
