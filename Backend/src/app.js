import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://superimlitraders.vercel.app"
    ],
    credentials: true,
}));



//Configurations set
// ─── Allowed Origins ─────────────────────────────────────────────────────────


app.use(express.json({ limit: "16kb" }))  //we accept json data
// app.use(express.urlencoded())       data is from url's
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import paymentRoutes from "./route/payment.admin.js"
app.use("/api", paymentRoutes)

import loginRoute from "./route/auth.route.js"
app.use("/api", loginRoute)

import addRawImli from "./route/addRawImli.route.js"
app.use("/api", addRawImli)

import addLocal from "./route/addlocal.route.js"
app.use("/api", addLocal)

import assignImli from "./route/assignImli.route.js"
app.use("/api", assignImli)

import returnImli from "./route/returnedimli.route.js"
app.use("/api", returnImli)

import localRoutes from "./route/local.operation.js";
app.use("/api", localRoutes);

import invoiceRoutes from "./route/invoice.route.js"
app.use("/api", invoiceRoutes)

import settingsRoutes from "./route/setting.route.js";
app.use("/api", settingsRoutes);

import excelRoutes from "./route/excel.route.js";
app.use("/api", excelRoutes);


// Global error handler — converts ApiError to JSON response
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        statusCode,
        message,
        success: false,
        errors: err.errors || [],
    });
});

export { app }