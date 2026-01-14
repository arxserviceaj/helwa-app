import express from 'express';
import path from "path";
import {ENV} from "./src/config/env.js";
import { connectDB } from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import {functions,inngest} from "./src/config/inggest.js";
import { fileURLToPath } from 'url';

const app = express()
app.use(cors({
    origin: ENV.FRONTEND_URL,
    methods: ['GET','POST','DELETE','PUT'],
    allowedHeaders : [
        "Content-Type",
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma',
    ],
    credentials : true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(clerkMiddleware())
app.use(express.static(path.join(__dirname, "../admin/dist")));

app.use("/api/inngest", serve({client:inngest, functions}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(__filename);


app.get("/api/health",(req,res)=>{
    res.status(200).json({message:"Success"});
})

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../admin/dist/index.html")
  );
});


if(ENV.NODE_ENV = "production"){
    app.use(express.static(path.join(__dirname,"../admin/dist")))

    app.get("/{*any}",(req,res) => {
        res.sendFile(path.join(__dirname,"../admin","dist","index.html"))
    })
}

app.listen(ENV.PORT,()=>{ 
    console.log("Server1 is running ")
    connectDB();
})