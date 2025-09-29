import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import shareRoutes from './routes/share.routes.js'

dotenv.config();

const PORT =  process.env.PORT;
const app = express();
app.use(cookieParser());

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/shares', shareRoutes);

mongoose.connect(process.env.MONGO_URI, {dbName: 'vistagram'})
.then(()=> console.log('connected to database'))
.catch(err => console.log('databse connection failed', err))

app.listen(PORT , ()=>{
    console.log('server is running on port: ', PORT) ;
})

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});