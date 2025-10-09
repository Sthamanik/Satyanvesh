import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// app configuration
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// routes imports


// route initialization


// error handling middleware


export default app;