import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../src/constants.js";

// Models to Reset
import { ImliData } from "../src/models/imli.model.js";

dotenv.config({ path: '.env' }); // Ensure it loads from Backend/.env

const cleanDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}${DB_NAME}`
        );
        console.log(`MongoDB connected! Host: ${connectionInstance.connection.host}`);

        console.log("\n⚠️ STARTING DATABASE CLEANUP ⚠️\n");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        // Collections to KEEP
        const keepCollections = ["users", "settings", "configs"];

        for (const collection of collections) {
            if (!keepCollections.includes(collection.name)) {
                if (collection.name === "imlidatas") {
                    // Reset inventory
                    const inventoryUpdate = await ImliData.updateMany({}, { 
                        $set: { rawImliQuantity: 0, totalCleanedImli: 0 } 
                    });
                    console.log(`✅ Reset Inventory record(s) to 0`);
                } else {
                    // Drop other operational collections
                    await db.dropCollection(collection.name);
                    console.log(`✅ Dropped collection: ${collection.name}`);
                }
            } else {
                console.log(`ℹ️ Preserved collection: ${collection.name}`);
            }
        }

        console.log("\n🎉 DATABASE CLEANUP COMPLETE! System is ready for delivery.");
        console.log("Admin Users, Settings, and Configurations were PRESERVED.\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ ERROR CLEANING DATABASE:", error);
        process.exit(1);
    }
};

cleanDB();
