import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb } from "./db/db.js";
import userRoutes from './routes/user.route.js'
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello Bro')
})

app.use('/users',userRoutes);

export default app;