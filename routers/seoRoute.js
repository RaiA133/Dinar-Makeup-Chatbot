import express from 'express'

const app = express.Router();

import seoController from '../controllers/seoController.js';

app.post('/ai/seo', seoController.seo)

export default app;
