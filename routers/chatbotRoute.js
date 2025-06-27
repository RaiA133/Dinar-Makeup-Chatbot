import express from 'express'

const app = express.Router();

import chatbotController from '../controllers/chatbotController.js';

app.post('/chatbot', chatbotController.index)
app.get('/', chatbotController.healthCheck)

export default app;
