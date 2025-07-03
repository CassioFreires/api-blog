import express from 'express';
import routers from './routers';
import env from 'dotenv';
env.config()

const app = express();
app.use(express.json());
app.use('/api', routers);


export default app;