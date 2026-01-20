import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb } from "./db/db.js";
import userRoutes from './routes/user.route.js'
import cookieParser from "cookie-parser";
import captainRoutes from './routes/captain.route.js';
const app=express();
dotenv.config();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true       
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
connectToDb();

app.get('/',(req,res)=>{
    res.send('Hello Bro')
})

app.use('/users',userRoutes);
app.use('/captains',captainRoutes);

export default app;


app.get('/',()=>{

})