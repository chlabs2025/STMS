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
      let fixedCount = 0;

      for (const assignment of assignments) {
        if (runningSum >= activeTotal) {
          // This assignment is completely outside the active window, so it was fully returned in the past
          if ((assignment.returnedQuantity || 0) < assignment.assignedQuantity) {
            assignment.returnedQuantity = assignment.assignedQuantity;
            await assignment.save();
            fixedCount++;
          }
        } else {
          // It partially or fully fits in the active window
          const neededToFit = activeTotal - runningSum;
          if (assignment.assignedQuantity > neededToFit) {
            // Only part of this assignment is active, the rest was returned
            const returnedAmount = assignment.assignedQuantity - neededToFit;
            if ((assignment.returnedQuantity || 0) !== returnedAmount) {
              assignment.returnedQuantity = returnedAmount;
              await assignment.save();
              fixedCount++;
            }
          }
        }
        runningSum += assignment.assignedQuantity;
      }
      if (fixedCount > 0) {
        console.log(`Local ${local.LocalName} (${local.LocalID}): Fixed ${fixedCount} legacy assignments.`);
      }
    }

    console.log("Done fixing legacy assignments.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
