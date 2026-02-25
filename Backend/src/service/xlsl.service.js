import * as XLSX from "xlsx";

/**
 * Convert camelCase / PascalCase field names to readable headers
 * e.g. "orderReference" → "Order Reference", "LocalID" → "Local ID"
 */
const toReadableHeader = (key) => {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")   // camelCase split
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // consecutive caps
        .replace(/^./, (c) => c.toUpperCase());     // capitalize first letter
};

/**
 * Format a Date value to DD-MM-YYYY
 */
const formatDate = (value) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

/**
 * Sanitize a single row:
 *  - Remove internal Mongo fields (_id, __v)
 *  - Format dates to DD-MM-YYYY
 *  - Convert any remaining ObjectId-like values to string
 *  - Format createdAt / updatedAt as readable dates
 */
const sanitizeRow = (row) => {
    const clean = {};

    for (const [key, value] of Object.entries(row)) {
        // Skip internal mongo fields
        if (key === "_id" || key === "__v") continue;

        // Date fields → formatted string
        if (value instanceof Date || key === "period" || key === "createdAt" || key === "updatedAt") {
            clean[key] = formatDate(value);
            continue;
        }

        // ObjectId-like (has toString and _bsontype or is 24-char hex)
        if (value && typeof value === "object" && value._bsontype) {
            clean[key] = value.toString();
            continue;
        }

        clean[key] = value;
    }

    return clean;
};

/**
 * Calculate optimal column widths based on header + data lengths
 */
const getColumnWidths = (headers, rows) => {
    return headers.map((header) => {
        const headerLen = toReadableHeader(header).length;
        const maxDataLen = rows.reduce((max, row) => {
            const val = row[header];
            const len = val != null ? String(val).length : 0;
            return Math.max(max, len);
        }, 0);
        return { wch: Math.max(headerLen, maxDataLen) + 2 }; // +2 padding
    });
};

/**
 * Main handler: converts an array of Mongo documents into an XLSX buffer
 *
 * @param {Array<Object>} data    - Array of .lean() Mongoose documents
 * @param {string}        sheetName - Name shown on the Excel sheet tab
 * @returns {Buffer} XLSX file buffer ready to send as response
 */
export const xlslhandler = (data, sheetName) => {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data to export");
    }

    // 1. Sanitize every row
    const cleanData = data.map(sanitizeRow);

    // 2. Extract column keys from first row (order preserved)
    const headers = Object.keys(cleanData[0]);

    // 3. Build header row with readable names
    const readableHeaders = headers.map(toReadableHeader);

    // 4. Build rows as arrays (matching header order)
    const rowArrays = cleanData.map((row) =>
        headers.map((h) => (row[h] != null ? row[h] : ""))
    );

    // 5. Combine header + data
    const sheetData = [readableHeaders, ...rowArrays];

    // 6. Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // 7. Auto-fit column widths
    worksheet["!cols"] = getColumnWidths(headers, cleanData);

    // 8. Style header row — bold via cell format (xlsx community edition)
    //    Note: basic xlsx lib doesn't support full styling, but column widths work

    // 9. Create workbook & append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 10. Write to buffer — wrap in Buffer.from() because xlsx@0.18.5
    //     returns ArrayBuffer, not Node.js Buffer
    const output = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });
    return Buffer.from(output);
};