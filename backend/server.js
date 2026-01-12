import express from 'express';
import path from "path";
import {ENV} from "./src/config/env.js";
import { connectDB } from './src/config/db.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

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

const __dirname = path.resolve();


app.get("/api/health",(req,res)=>{
    res.status(200).json({message:"Success"});
})

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