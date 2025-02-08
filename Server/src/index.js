import express, { urlencoded } from "express" ;
import dotenv, { config } from "dotenv";
import authRoute from "./Routes/auth-route.js"
import messageRoute from "./Routes/message-route.js"
import connectDB from "./Config/config.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import { app , server } from "./Middlewares/socket.js";
import path from "path";
dotenv.config();
// express app

const PORT = process.env.PORT ; 
const _dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true ,
}));

app.get("/", (req , res) =>{
    res.status(200).send("Server is running !");
});

// User Route 
app.use("/api/auth", authRoute);

// Message Route 
app.use("/api/messages", messageRoute);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"../Client/dist")));

    app.get("*", (req , res) => {
        res.sendFile(path.join(_dirname, "../Client" , "dist" , "index.html"));
    })
}

server.listen(PORT ,()=>{
    console.log("Server is running on PORT :" , PORT);
    connectDB();
});