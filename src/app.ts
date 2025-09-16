import express from 'express';
import routers from './routers';
import env from 'dotenv';
import cors from 'cors';
import path = require('path');
env.config()

const app = express();

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(cors());
app.use(express.json());
app.use('/api', routers);




export default app;