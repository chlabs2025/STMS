import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../src/db/index.js";
import { ImliAssign } from "../src/models/imliAssign.model.js";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected.");

    // Find assignments with cleanedQuantity > 0 (pending payment)
    const assignments = await ImliAssign.find({ cleanedQuantity: { $gt: 0 } });
    console.log(`Found ${assignments.length} legacy assignments with pending cleanedQuantity.`);

    let fixedCount = 0;
    for (const assignment of assignments) {
      assignment.cleanedQuantity = 0; // wipe old pending payment state
      await assignment.save();
      fixedCount++;
    }

    console.log(`Successfully wiped ${fixedCount} legacy pending assignments.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
