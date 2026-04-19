
import PDFDocument from "pdfkit";

const formatCurrency = (value) => `${Number(value || 0).toFixed(2)}`;

const createPdfBuffer = (doc) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });

const generateSlipPdf = async (slip) => {
  const doc = new PDFDocument({ size: "A5", margin: 20 });

  const pdfPromise = new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.font("Helvetica-Bold").fontSize(18).text(slip.senderName || "", { align: "center" });
  doc.moveDown(0.25);
  doc.font("Helvetica").fontSize(10).text(slip.senderAddress || "", { align: "center" });

  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(10).text(`Slip No: ${slip.slipNumber || ""}`);
  doc.font("Helvetica").fontSize(10).text(`Name: ${slip.receiverName || ""}`);
  doc.font("Helvetica").fontSize(10).text(`Date: ${slip.date ? new Date(slip.date).toLocaleDateString() : ""}`);

  doc.moveDown(0.5);

  const tableTop = doc.y;
  const tableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columnPositions = [doc.page.margins.left, doc.page.margins.left + 120, doc.page.margins.left + 180, doc.page.margins.left + 240, doc.page.margins.left + tableWidth];

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Product", columnPositions[0] + 2, tableTop + 4, { width: columnPositions[1] - columnPositions[0] - 4, align: "left" });
  doc.text("Quantity", columnPositions[1] + 2, tableTop + 4, { width: columnPositions[2] - columnPositions[1] - 4, align: "center" });
  doc.text("Weight (KG)", columnPositions[2] + 2, tableTop + 4, { width: columnPositions[3] - columnPositions[2] - 4, align: "center" });
  doc.text("Amount (Rs)", columnPositions[3] + 2, tableTop + 4, { width: columnPositions[4] - columnPositions[3] - 4, align: "right" });
  doc.moveTo(columnPositions[0], tableTop).lineTo(columnPositions[4], tableTop).stroke();

  let y = tableTop + 20;
  doc.font("Helvetica").fontSize(9);
  slip.items?.forEach((item) => {
    doc.text(item.product || "", columnPositions[0] + 2, y + 4, { width: columnPositions[1] - columnPositions[0] - 4, align: "left" });
    doc.text(`${item.quantity || 0}`, columnPositions[1] + 2, y + 4, { width: columnPositions[2] - columnPositions[1] - 4, align: "center" });
    doc.text(`${item.weight || 0}`, columnPositions[2] + 2, y + 4, { width: columnPositions[3] - columnPositions[2] - 4, align: "center" });
    doc.text(formatCurrency(item.amount || 0), columnPositions[3] + 2, y + 4, { width: columnPositions[4] - columnPositions[3] - 4, align: "right" });
    doc.moveTo(columnPositions[0], y).lineTo(columnPositions[4], y).stroke();
    y += 20;
  });

  doc.moveTo(columnPositions[0], y).lineTo(columnPositions[4], y).stroke();

  doc.font("Helvetica-Bold").text("Total", columnPositions[0] + 2, y + 4, { width: columnPositions[1] - columnPositions[0] - 4, align: "left" });
  doc.text("", columnPositions[1] + 2, y + 4, { width: columnPositions[2] - columnPositions[1] - 4, align: "center" });
  doc.text(`${slip.totalWeight || 0} kg`, columnPositions[2] + 2, y + 4, { width: columnPositions[3] - columnPositions[2] - 4, align: "center" });
  doc.text(formatCurrency(slip.totalAmount || 0), columnPositions[3] + 2, y + 4, { width: columnPositions[4] - columnPositions[3] - 4, align: "right" });
  doc.moveTo(columnPositions[0], y + 20).lineTo(columnPositions[4], y + 20).stroke();

  doc.y = y + 30;
  doc.font("Helvetica").fontSize(10).text(`Driver Name: ${slip.driverName || ""}`);

  doc.moveDown(2);
  doc.font("Helvetica-Bold").text("For SUPER IMLI TRADERS", { align: "right" });
  doc.moveDown(1.5);
  doc.text("Authorised Signature", { align: "right" });

  doc.end();
  return pdfPromise;
};

export default generateSlipPdf;
