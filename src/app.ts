import express from 'express';
import routers from './routers';
import env from 'dotenv';
import cors from 'cors';
env.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routers);



export default app;