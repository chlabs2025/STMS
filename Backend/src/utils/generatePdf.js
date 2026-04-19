import PDFDocument from "pdfkit";

const formatCurrency = (value) => `₹ ${Number(value || 0).toFixed(2)}`;

const addTableRow = (doc, row, positions, y, rowHeight = 20) => {
  let x = positions[0];
  const cellHeight = rowHeight;

  row.forEach((cell, index) => {
    const width = positions[index + 1] - x;
    doc.text(cell, x + 4, y + 4, {
      width: width - 8,
      align: index === 0 ? "center" : index === row.length - 1 ? "right" : "left",
    });
    x += width;
  });

  doc
    .lineWidth(0.5)
    .moveTo(positions[0], y)
    .lineTo(positions[positions.length - 1], y)
    .stroke();
  doc
    .moveTo(positions[0], y + cellHeight)
    .lineTo(positions[positions.length - 1], y + cellHeight)
    .stroke();
};

const generatePdf = async (invoice) => {
  const doc = new PDFDocument({ size: "A4", margin: 36 });
  const buffers = [];

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const leftWidth = pageWidth * 0.6;
  const rightWidth = pageWidth - leftWidth;

  doc.font("Helvetica-Bold").fontSize(18).text("TAX INVOICE", { align: "center" });
  doc.moveDown(1);

  doc.fontSize(10).font("Helvetica-Bold").text(invoice.seller?.businessName || "", { width: leftWidth });
  doc.font("Helvetica").text(invoice.seller?.address || "", { width: leftWidth });
  doc.text(`GSTIN/UIN: ${invoice.seller?.gstin || ""}`);
  doc.text(`State Name: ${invoice.seller?.state || ""}, Code: ${invoice.seller?.stateCode || ""}`);

  const invoiceDetailsX = doc.page.margins.left + leftWidth + 16;
  const invoiceDetailsY = doc.page.margins.top + 20;

  doc.text(`Invoice No.: ${invoice.invoiceNumber || ""}`, invoiceDetailsX, invoiceDetailsY, { width: rightWidth });
  doc.text(`Dated: ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : ""}`, invoiceDetailsX, invoiceDetailsY + 14, { width: rightWidth });

  doc.moveDown(1);

  doc.font("Helvetica-Bold").text("Buyer (Bill to)");
  doc.font("Helvetica").text(invoice.customer?.name || "");
  doc.text(invoice.customer?.address || "");
  doc.text(`GSTIN/UIN: ${invoice.customer?.gstin || ""}`);
  doc.text(`State Name: ${invoice.customer?.state || ""}, Code: ${invoice.customer?.stateCode || ""}`);

  doc.moveDown(0.5);
  doc.text(`Delivery Note: ${invoice.transport?.deliveryNote || ""}`);
  doc.text(`Dispatch Doc No: ${invoice.transport?.dispatchDocNo || ""}`);
  doc.text(`Destination: ${invoice.transport?.destination || ""}`);
  doc.text(`Motor Vehicle No: ${invoice.transport?.vehicleNo || ""}`);
  doc.text(`LR/RR No: ${invoice.transport?.lrNo || ""}`);

  doc.moveDown(1);

  const positions = [
    doc.page.margins.left,
    doc.page.margins.left + 30,
    doc.page.margins.left + 190,
    doc.page.margins.left + 250,
    doc.page.margins.left + 310,
    doc.page.margins.left + 355,
    doc.page.margins.left + 425,
    doc.page.margins.left + pageWidth,
  ];

  const tableTop = doc.y;
  doc.font("Helvetica-Bold").fontSize(9);
  addTableRow(doc, ["Sl", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"], positions, tableTop, 22);

  let y = tableTop + 22;
  doc.font("Helvetica").fontSize(9);
  invoice.items?.forEach((item, index) => {
    addTableRow(
      doc,
      [
        `${index + 1}`,
        item.description || "",
        item.hsn || "",
        `${item.quantity || 0} ${item.unit || ""}`,
        formatCurrency(item.rate || 0),
        "kgs",
        formatCurrency(item.amount || 0),
      ],
      positions,
      y,
      22,
    );
    y += 22;
  });

  if (invoice.igstTotal > 0) {
    addTableRow(doc, ["", "", "", "", "", "IGST", formatCurrency(invoice.igstTotal || 0)], positions, y, 22);
    y += 22;
  } else {
    addTableRow(doc, ["", "", "", "", "", "CGST", formatCurrency(invoice.cgstTotal || 0)], positions, y, 22);
    y += 22;
    addTableRow(doc, ["", "", "", "", "", "SGST", formatCurrency(invoice.sgstTotal || 0)], positions, y, 22);
    y += 22;
  }

  addTableRow(doc, ["", "", "", "", "", "Total", formatCurrency(invoice.grandTotal || 0)], positions, y, 22);

  doc.moveDown(2);
  doc.font("Helvetica-Bold").text("Amount Chargeable (in words)");
  doc.font("Helvetica").text(`INR ${invoice.amountWords || ""}`);
  doc.moveDown(0.5);
  doc.text("E. & O.E", { align: "center" });

  doc.moveDown(1);
  doc.font("Helvetica-Bold").text("HSN Tax Summary");
  doc.moveDown(0.5);

  const summaryPositions = [
    doc.page.margins.left,
    doc.page.margins.left + 90,
    doc.page.margins.left + 160,
    doc.page.margins.left + 230,
    doc.page.margins.left + 290,
    doc.page.margins.left + 360,
    doc.page.margins.left + 430,
    doc.page.margins.left + pageWidth,
  ];

  const isInterState = invoice.igstTotal > 0;
  const summaryHeaders = isInterState
    ? ["HSN/SAC", "Taxable Value", "IGST Rate", "IGST Amount", "", "", "Total Tax Amount"]
    : ["HSN/SAC", "Taxable Value", "CGST Rate", "CGST Amount", "SGST Rate", "SGST Amount", "Total Tax Amount"];

  addTableRow(doc, summaryHeaders, [summaryPositions[0], summaryPositions[1], summaryPositions[2], summaryPositions[3], summaryPositions[4], summaryPositions[5], summaryPositions[7]], doc.y, 22);

  y = doc.y + 22;
  doc.font("Helvetica").fontSize(9);

  invoice.items?.forEach((item) => {
    const itemTax = isInterState ? item.igst : (item.cgst || 0) + (item.sgst || 0);
    const halfRate = item.gstPercent ? item.gstPercent / 2 : 0;

    const row = isInterState
      ? [item.hsn || "", formatCurrency(item.amount || 0), `${item.gstPercent || 0}%`, formatCurrency(item.igst || 0), "", "", formatCurrency(itemTax || 0)]
      : [item.hsn || "", formatCurrency(item.amount || 0), `${halfRate}%`, formatCurrency(item.cgst || 0), `${halfRate}%`, formatCurrency(item.sgst || 0), formatCurrency(itemTax || 0)];

    addTableRow(doc, row, [summaryPositions[0], summaryPositions[1], summaryPositions[2], summaryPositions[3], summaryPositions[4], summaryPositions[5], summaryPositions[7]], y, 22);
    y += 22;
  });

  doc.moveDown(1);
  doc.font("Helvetica-Bold").text(`Tax Amount (in words): INR ${invoice.taxAmountWords || ""}`);
  doc.moveDown(1);
  doc.font("Helvetica").text(
    "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
  );
  doc.moveDown(2);
  doc.font("Helvetica-Bold").text(`for ${invoice.seller?.businessName || ""}`);
  doc.moveDown(3);
  doc.text("Authorised Signatory");
  doc.moveDown(1);
  doc.text("This is a Computer Generated Invoice", { align: "center" });

  doc.end();
  return pdfPromise;
};

export default generatePdf;
