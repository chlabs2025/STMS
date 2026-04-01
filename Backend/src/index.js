import mongoose from "mongoose";
import express from "express";
import { app } from './app.js';
import createDefaultUser from "./utils/defaultUser.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import startKeepAlive from "./utils/keepAlive.js";

dotenv.config();

// ─── Crash Protection ─────────────────────────────────────────────────────────
// Prevent silent crashes in production

process.on("unhandledRejection", (reason, promise) => {
    console.error("[FATAL] Unhandled Rejection:", reason);
    // Don't exit — let the server keep running
});

process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught Exception:", err);
    // Graceful exit — give time for in-flight requests
    setTimeout(() => process.exit(1), 1000);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
    console.log(`\n[${signal}] Shutting down gracefully...`);
    try {
        await mongoose.connection.close();
        console.log("[shutdown] MongoDB connection closed");
    } catch (err) {
        console.error("[shutdown] Error closing MongoDB:", err.message);
    }
    process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8080;

        app.listen(PORT, () => {
            console.log(`Server is running at port :${PORT}`);
        });

        createDefaultUser();

        // Self-ping to keep free-tier hosts alive (only when SERVER_URL is set)
        startKeepAlive(process.env.SERVER_URL);
    })
    .catch((err) => {
        console.log("MONGODB connection failed !!!", err);
        process.exit(1);
    });