import mongoose from "mongoose";
import dotenv from "dotenv";
import { ImliAssign } from "../src/models/imliAssign.model.js";
import { imliReturn } from "../src/models/imliReturn.model.js";

dotenv.config();

async function run() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}STMS`);

        const localID = "22";

        const assigns = await ImliAssign.find({ localID }).sort({ createdAt: 1 });
        console.log(`\n--- ASSIGNMENTS for Local ${localID} ---`);
        for (const a of assigns) {
            console.log({
                _id: a._id.toString(),
                qty: a.assignedQuantity,
                returnBatchId: a.returnBatchId?.toString() || null,
                createdAt: a.createdAt
            });
        }

        const returns = await imliReturn.find({ localID }).sort({ createdAt: 1 });
        console.log(`\n--- RETURN BATCHES for Local ${localID} ---`);
        for (const r of returns) {
            console.log({
                _id: r._id.toString(),
                returnedQty: r.returnedQuantity,
                assignmentIds: r.assignmentIds?.map(id => id.toString()),
                isPaid: r.isPaid,
                createdAt: r.createdAt
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}

run();
