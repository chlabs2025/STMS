import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express()

// ─── CORS — must be FIRST ─────────────────────────────────────────────────────
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://10.101.36.1:5173",
        "http://10.76.145.1:5173",
        "http://192.168.1.15:5173",
        "https://superimlitraders.vercel.app",
        "https://superimlitraders-plum.vercel.app",
        "https://stms-backend-i44c.onrender.com",
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
}

app.use(cors(corsOptions))
app.options("/*splat", cors(corsOptions))   // handle preflight for ALL routes

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// ─── Request Timeout (60s) — prevents hung requests ──────────────────────────
app.use((req, res, next) => {
    req.setTimeout(60000, () => {
        if (!res.headersSent) {
            res.status(408).json({
                statusCode: 408,
                message: "Request timed out",
                success: false,
            });
        }
    });
    next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is healthy 🚀",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
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

import dashboardRoutes from "./route/dashboard.route.js";
app.use("/api", dashboardRoutes);

import excelRoutes from "./route/excel.route.js";
app.use("/api", excelRoutes);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
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