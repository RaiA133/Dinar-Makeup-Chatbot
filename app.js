import express from 'express'
import routes from './routers/index.js'
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const whitelist = ['http://localhost:5173', 'https://ai-dinar-makeup-official-website.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', routes)

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${port}`);
});


export default app;