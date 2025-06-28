import express from 'express'

const app = express.Router();

import chatbotController from '../controllers/chatbotController.js';

app.get('/', chatbotController.healthCheck)
app.post('/ai/chat', chatbotController.chat)
app.post('/ai/guide', chatbotController.guide)

export default app;
