
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = "mongodb+srv://managestms_db_user:6Py3ltNCRYBXGkxZ@cluster0.pfpgnzu.mongodb.net/STMS"; 

async function finalCleanup() {
    console.log("Starting FINAL PRODUCTION CLEANUP...");
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        const db = mongoose.connection.db;

        // Collections to wipe (Transactions & Logs)
        const collectionsToWipe = [
            'invoices',
            'slips',
            'imliprices', // Wait, keep imli prices? User said "imli price and the business profile information; keep this thing as it is"
            'localdatas',
            'imliassigns',
            'imlireturns',
            'payments',
            'activitylogs', // Audit data
            'logs'          // Audit data
        ];

        for (const collName of collectionsToWipe) {
            if (collName === 'imliprices') {
                console.log("Skipping imliprices (preserved config)");
                continue;
            }
            await db.collection(collName).deleteMany({});
            console.log(`- Wiped collection: ${collName}`);
        }

        // Reset stock counters
        await db.collection('imlidatas').updateOne({}, {
            $set: { totalRawImli: 0, totalCleanedImli: 0 }
        }, { upsert: true });
        console.log("- Reset Imli stock to zero.");

        console.log("Cleanup COMPLETED successfully.");
    } catch (err) {
        console.error("Cleanup FAILED:", err);
    } finally {
        await mongoose.disconnect();
    }
}

finalCleanup();
