import mongoose from 'mongoose';
import { localData } from './src/models/local.model.js';
import { ImliAssign } from './src/models/imliAssign.model.js';
import { imliReturn } from './src/models/imliReturn.model.js';

async function fixBalances() {
  await mongoose.connect(`mongodb+srv://managestms_db_user:6Py3ltNCRYBXGkxZ@cluster0.pfpgnzu.mongodb.net/STMS`);
  console.log("Connected to MongoDB.");

  const locals = await localData.find({});
  let fixedCount = 0;

  for (const local of locals) {
    // Calculate pending assigned (unreturned raw imli)
    const pendingAssigns = await ImliAssign.find({
      localID: String(local.LocalID),
      returnBatchId: null
    });
    const correctAssigned = pendingAssigns.reduce((sum, a) => sum + (a.assignedQuantity || 0), 0);

    // Calculate pending returned (unpaid cleaned imli)
    const unpaidReturns = await imliReturn.find({
      localID: String(local.LocalID),
      isPaid: false
    });
    const correctReturned = unpaidReturns.reduce((sum, a) => sum + (a.returnedQuantity || 0), 0);

    if (local.totalAssignedQuantity !== correctAssigned || local.totalReturnedQuantity !== correctReturned) {
      console.log(`Local ${local.LocalID} (${local.LocalName}):`);
      console.log(`  Assigned: ${local.totalAssignedQuantity} -> ${correctAssigned}`);
      console.log(`  Returned: ${local.totalReturnedQuantity} -> ${correctReturned}`);
      
      await localData.updateOne(
        { _id: local._id },
        { 
          $set: { 
            totalAssignedQuantity: correctAssigned,
            totalReturnedQuantity: correctReturned
          }
        }
      );
      fixedCount++;
    }
  }

  console.log(`Fixed balances for ${fixedCount} locals.`);
  process.exit(0);
}

fixBalances().catch(console.error);
