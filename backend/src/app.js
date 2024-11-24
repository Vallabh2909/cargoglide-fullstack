import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin: `${process.env.ORIGIN}`,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("../public"))
app.use(cookieParser())

//User Router

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

import customerRouter from "./routes/customer.routes.js"
app.use("/api/v1/customers",customerRouter)

export default app;




