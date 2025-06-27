import express from 'express'
import routes from './routers/index.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', routes)

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${port}`);
});


export default app;