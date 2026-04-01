import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}${DB_NAME}`,
            {
                serverSelectionTimeoutMS: 10000,  // fail fast if can't connect (10s)
                socketTimeoutMS: 45000,           // close sockets after 45s inactivity
            }
        );
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        console.log('Mongoose defaultDB:', mongoose.connection.name);

        // Handle connection events for production stability
        mongoose.connection.on("error", (err) => {
            console.error("[MongoDB] Connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("[MongoDB] Disconnected. Mongoose will auto-reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("[MongoDB] Reconnected successfully");
        });

    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        return Promise.reject(error);
    }
}

export default connectDB