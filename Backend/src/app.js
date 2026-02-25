import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express()

//Configurations set
// ─── Allowed Origins (add your network IP origin here) ───────────────────────
const allowedOrigins = [
    "http://localhost:5173",          // local browser
    "http://10.101.36.1:5173",
    "http://10.76.145.1:5173"       // LAN / mobile access
]

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS: Origin not allowed → ${origin}`))
        }
    },
    credentials: true,
}))

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