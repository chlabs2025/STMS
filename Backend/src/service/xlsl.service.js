import * as XLSX from "xlsx";

export const xlslhandler = (data, sheetName) => {

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No data to export");
    }

    data = data.map(d => {
        if (d._id) d._id = d._id.toString();
        return d;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    return XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx"
    });
};