async function run() {
    try {
        const response = await fetch("http://localhost:8000/api/assignment-history?localID=22");
        const json = await response.json();
        
        if (json.data) {
            const batches = json.data.filter(d => d.type === "batch");
            console.log("\n--- BATCH ENTRIES FROM API ---");
            for (const b of batches) {
                console.log({
                    _id: b._id,
                    quantity: b.quantity,
                    cleanedQuantity: b.cleanedQuantity,
                    hasAssignments: !!b.assignments
                });
            }
        }
    } catch (e) {
        console.error(e);
    }
}

run();
