import express from 'express'
import routes from './routers/index.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', routes)

app.listen(process.env.PORT, () => {
  console.log(`App listening to http://localhost:${process.env.PORT}`);
})

export default app;