import mongoose from "mongoose";
import express from "express";
import { app } from './app.js';
import createDefaultUser from "./utils/defaultUser.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8080;

        app.listen(PORT, () => {
            console.log(`Server is running at port :${PORT}`);
        });

        createDefaultUser();
    })
    .catch((err) => {
        console.log("MONGODB connection failed !!!", err);
        process.exit(1);
    });