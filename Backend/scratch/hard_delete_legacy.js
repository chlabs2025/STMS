import mongoose from "mongoose";
import dotenv from "dotenv";
import { localData } from "../src/models/local.model.js";
import { ImliAssign } from "../src/models/imliAssign.model.js";
import connectDB from "../src/db/index.js";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected.");

    const locals = await localData.find({});
    console.log(`Found ${locals.length} locals to process.`);

    for (const local of locals) {
      const activeTotal = Math.max(0, local.totalAssignedQuantity || 0);
      
      const assignments = await ImliAssign.find({ localID: String(local.LocalID) }).sort({ createdAt: -1 });
      
      let runningSum = 0;
      let deletedCount = 0;

      for (const assignment of assignments) {
        if (runningSum >= activeTotal) {
          // This assignment is completely outside the active window, so it was from a previous lifecycle.
          // The user requested we hard delete these legacy records.
          await ImliAssign.findByIdAndDelete(assignment._id);
          deletedCount++;
        } else {
          // It partially or fully fits in the active window, so keep it.
        }
        runningSum += (assignment.assignedQuantity || 0);
      }
      
      if (deletedCount > 0) {
        console.log(`Local ${local.LocalName} (ID: ${local.LocalID}): Hard deleted ${deletedCount} legacy assignments.`);
      }
    }
    
    // Now let's handle TRULY orphaned records (where the local was deleted entirely)
    const allAssignments = await ImliAssign.find({});
    const validLocalIDs = new Set(locals.map(l => String(l.LocalID)));
    let orphanDeletedCount = 0;
    
    for (const assignment of allAssignments) {
        if (!validLocalIDs.has(assignment.localID)) {
            await ImliAssign.findByIdAndDelete(assignment._id);
            orphanDeletedCount++;
        }
    }
    
    if (orphanDeletedCount > 0) {
        console.log(`Hard deleted ${orphanDeletedCount} orphaned assignments from completely deleted locals.`);
    }

    console.log("Done fixing legacy assignments.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
