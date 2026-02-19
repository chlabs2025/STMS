import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express()

//Configurations set
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json({limit:"16kb"}))  //we accept json data
// app.use(express.urlencoded())       data is from url's
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import qrHandler from "./route/payment.admin.js"
app.use("/api", qrHandler)

import loginRoute from "./route/auth.route.js"
app.use("/api",loginRoute)

import addRawImli from "./route/addRawImli.route.js"
app.use("/api",addRawImli)

import addLocal from "./route/addlocal.route.js"
app.use("/api",addLocal)

import assignImli from "./route/assignImli.route.js"
app.use("/api",assignImli)

import returnImli from "./route/returnedimli.route.js"
app.use("/api",returnImli)

import localRoutes from "./route/local.operation.js";
app.use("/api", localRoutes);

export {app}