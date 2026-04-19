import PDFDocument from "pdfkit";

const formatCurrency = (value) => `Rs. ${(Number(value) || 0).toFixed(2)}`;

const generatePdf = async (invoice) => {
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  const buffers = [];

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  const startX = 30;
  const endX = 565;
  const width = endX - startX; // 535

  let currentY = 30;

  // Function to draw text with specific formatting
  const drawText = (text, x, y, options = {}) => {
    if (options.font) doc.font(options.font);
    if (options.size) doc.fontSize(options.size);
    doc.text(text || "", x, y, options);
  };

  // 1. Tax Invoice Header Box
  doc.rect(startX, currentY, width, 20).stroke();
  drawText("TAX INVOICE", startX, currentY + 5, { width, align: "center", font: "Helvetica-Bold", size: 12 });
  currentY += 20;

  // 2. Seller and Invoice Details
  const row2Height = 80;
  doc.rect(startX, currentY, width, row2Height).stroke();
  const midX2 = 320; // Move split more to the right to fit long addresses
  doc.moveTo(midX2, currentY).lineTo(midX2, currentY + row2Height).stroke();
  
  // Left: Seller
  drawText(invoice.seller?.businessName, startX + 5, currentY + 5, { font: "Helvetica-Bold", size: 10 });
  drawText(invoice.seller?.address, startX + 5, currentY + 18, { font: "Helvetica", size: 8, width: 280 });
  drawText(`GSTIN/UIN: `, startX + 5, currentY + 50, { font: "Helvetica", size: 8, continued: true });
  drawText(invoice.seller?.gstin || "", startX + 5, currentY + 50, { font: "Helvetica-Bold", size: 8 });
  drawText(`State Name: ${invoice.seller?.state || ""}, Code: ${invoice.seller?.stateCode || ""}`, startX + 5, currentY + 62, { font: "Helvetica", size: 8 });

  // Right: Invoice Details
  drawText(`Invoice No.: `, midX2 + 5, currentY + 5, { font: "Helvetica", size: 8, continued: true });
  drawText(invoice.invoiceNumber || "", midX2 + 5, currentY + 5, { font: "Helvetica-Bold", size: 8 });
  drawText(`Dated: `, midX2 + 5, currentY + 18, { font: "Helvetica", size: 8, continued: true });
  drawText(invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : "", midX2 + 5, currentY + 18, { font: "Helvetica-Bold", size: 8 });
  currentY += row2Height;

  // 3. Buyer and Transport Details
  const row3Height = 75;
  doc.rect(startX, currentY, width, row3Height).stroke();
  doc.moveTo(midX2, currentY).lineTo(midX2, currentY + row3Height).stroke();

  // Left: Buyer
  drawText("Buyer (Bill to)", startX + 5, currentY + 5, { font: "Helvetica-Bold", size: 8 });
  drawText(invoice.customer?.name, startX + 5, currentY + 16, { font: "Helvetica-Bold", size: 9 });
  drawText(invoice.customer?.address, startX + 5, currentY + 28, { font: "Helvetica", size: 8, width: 280 });
  drawText(`GSTIN/UIN: `, startX + 5, currentY + 50, { font: "Helvetica", size: 8, continued: true });
  drawText(`${invoice.customer?.gstin || ""}`, startX + 5, currentY + 50, { font: "Helvetica-Bold", size: 8 });
  drawText(`State Name: ${invoice.customer?.state || ""}, Code: ${invoice.customer?.stateCode || ""}`, startX + 5, currentY + 62, { font: "Helvetica", size: 8 });

  // Right: Transport
  drawText(`Delivery Note: ${invoice.transport?.deliveryNote || ""}`, midX2 + 5, currentY + 5, { font: "Helvetica", size: 8 });
  drawText(`Dispatch Doc No: ${invoice.transport?.dispatchDocNo || ""}`, midX2 + 5, currentY + 17, { font: "Helvetica", size: 8 });
  drawText(`Destination: ${invoice.transport?.destination || ""}`, midX2 + 5, currentY + 29, { font: "Helvetica", size: 8 });
  drawText(`Motor Vehicle No: ${invoice.transport?.vehicleNo || ""}`, midX2 + 5, currentY + 41, { font: "Helvetica", size: 8 });
  drawText(`LR/RR No: ${invoice.transport?.lrNo || ""}`, midX2 + 5, currentY + 53, { font: "Helvetica", size: 8 });
  currentY += row3Height;

  // 4. Products Table
  const tableStartY = currentY;
  const colX = [startX, 60, 240, 300, 360, 420, 460, endX];
  
  // Header
  doc.rect(startX, currentY, width, 20).stroke();
  const headers = ["Sl", "Description of Goods", "HSN/SAC", "Quantity", "Rate", "per", "Amount"];
  headers.forEach((text, i) => {
    drawText(text, colX[i] + 2, currentY + 6, { 
      width: colX[i+1] - colX[i] - 4, 
      align: "center", 
      font: "Helvetica-Bold", 
      size: 8 
    });
  });
  currentY += 20;

  // Items
  let itemY = currentY + 5;
  invoice.items?.forEach((item, index) => {
    drawText(`${index + 1}`, colX[0], itemY, { width: colX[1]-colX[0], align: "center", font: "Helvetica", size: 8 });
    drawText(item.description || "Tamarind Seeds", colX[1]+5, itemY, { width: colX[2]-colX[1]-10, align: "left" });
    drawText(item.hsn || "121190", colX[2], itemY, { width: colX[3]-colX[2], align: "center" });
    drawText(`${item.quantity || 0} ${item.unit || "kgs"}`, colX[3], itemY, { width: colX[4]-colX[3], align: "center" });
    drawText(formatCurrency(item.rate || 0), colX[4]-5, itemY, { width: colX[5]-colX[4], align: "right" });
    drawText(item.unit || "kgs", colX[5], itemY, { width: colX[6]-colX[5], align: "center" });
    drawText(formatCurrency(item.amount || 0), colX[6]-5, itemY, { width: colX[7]-colX[6], align: "right" });
    itemY += 15;
  });

  currentY = Math.max(itemY + 30, currentY + 100); // Ensure table has some minimum height

  // Table Totals / Tax Lines
  const isInterState = invoice.igstTotal > 0;
  
  doc.moveTo(startX, currentY).lineTo(endX, currentY).stroke();
  
  if (isInterState) {
    currentY += 5;
    drawText("IGST", colX[5]-5, currentY, { width: colX[6]-colX[5], align: "right", font: "Helvetica-Bold", size: 8 });
    drawText(formatCurrency(invoice.igstTotal || 0), colX[6]-5, currentY, { width: colX[7]-colX[6], align: "right" });
    currentY += 15;
  } else {
    currentY += 5;
    drawText("CGST", colX[5]-5, currentY, { width: colX[6]-colX[5], align: "right", font: "Helvetica-Bold", size: 8 });
    drawText(formatCurrency(invoice.cgstTotal || 0), colX[6]-5, currentY, { width: colX[7]-colX[6], align: "right" });
    currentY += 15;
    
    doc.moveTo(startX, currentY).lineTo(endX, currentY).stroke();
    currentY += 5;
    drawText("SGST", colX[5]-5, currentY, { width: colX[6]-colX[5], align: "right", font: "Helvetica-Bold", size: 8 });
    drawText(formatCurrency(invoice.sgstTotal || 0), colX[6]-5, currentY, { width: colX[7]-colX[6], align: "right" });
    currentY += 15;
  }

  doc.moveTo(startX, currentY).lineTo(endX, currentY).stroke();
  currentY += 5;
  drawText("Total", colX[5]-5, currentY, { width: colX[6]-colX[5], align: "right", font: "Helvetica-Bold", size: 8 });
  drawText(formatCurrency(invoice.grandTotal || 0), colX[6]-5, currentY, { width: colX[7]-colX[6], align: "right" });
  currentY += 15;

  // Draw vertical lines for the entire table
  doc.rect(startX, tableStartY, width, currentY - tableStartY).stroke();
  for (let i = 1; i < colX.length - 1; i++) {
    doc.moveTo(colX[i], tableStartY).lineTo(colX[i], currentY).stroke();
  }

  // 5. Amount Words
  const row5Height = 25;
  doc.rect(startX, currentY, width, row5Height).stroke();
  const eoeX = endX - 60;
  doc.moveTo(eoeX, currentY).lineTo(eoeX, currentY + row5Height).stroke();
  
  drawText("Amount Chargeable (in words)", startX + 5, currentY + 3, { font: "Helvetica", size: 8 });
  drawText(`INR ${invoice.amountWords || ""}`, startX + 5, currentY + 13, { font: "Helvetica-Bold", size: 9 });
  drawText("E. & O.E", eoeX, currentY + 13, { width: 60, align: "center", font: "Helvetica-Bold", size: 8 });
  
  currentY += row5Height;
  currentY += 5; // small gap

  // 6. HSN Tax Summary
  const taxColX = isInterState 
    ? [startX, 120, 240, 340, 450, endX]
    : [startX, 100, 190, 240, 330, 380, 470, endX];
  const taxHeaders = isInterState
    ? ["HSN/SAC", "Taxable Value", "IGST Rate", "IGST Amount", "Total Tax Amount"]
    : ["HSN/SAC", "Taxable Value", "CGST Rate", "CGST Amount", "SGST Rate", "SGST Amount", "Total Tax Amount"];

  const taxBoxStartY = currentY;
  
  // Tax Header
  doc.rect(startX, currentY, width, 15).stroke();
  taxHeaders.forEach((text, i) => {
    drawText(text, taxColX[i] + 2, currentY + 4, { 
      width: taxColX[i+1] - taxColX[i] - 4, align: "center", font: "Helvetica-Bold", size: 8 
    });
  });
  currentY += 15;

  // Tax Items
  let taxItemY = currentY + 4;
  invoice.items?.forEach((item) => {
    const halfRate = item.gstPercent ? item.gstPercent / 2 : 0;
    const itemTax = isInterState ? item.igst : (item.cgst || 0) + (item.sgst || 0);

    drawText(item.hsn || "121190", taxColX[0], taxItemY, { width: taxColX[1]-taxColX[0], align: "center", font: "Helvetica", size: 8 });
    drawText(formatCurrency(item.amount || 0), taxColX[1]-5, taxItemY, { width: taxColX[2]-taxColX[1], align: "right" });
    
    if (isInterState) {
      drawText(`${item.gstPercent || 0}%`, taxColX[2], taxItemY, { width: taxColX[3]-taxColX[2], align: "center" });
      drawText(formatCurrency(item.igst || 0), taxColX[3]-5, taxItemY, { width: taxColX[4]-taxColX[3], align: "right" });
      drawText(formatCurrency(itemTax || 0), taxColX[4]-5, taxItemY, { width: taxColX[5]-taxColX[4], align: "right" });
    } else {
      drawText(`${halfRate}%`, taxColX[2], taxItemY, { width: taxColX[3]-taxColX[2], align: "center" });
      drawText(formatCurrency(item.cgst || 0), taxColX[3]-5, taxItemY, { width: taxColX[4]-taxColX[3], align: "right" });
      drawText(`${halfRate}%`, taxColX[4], taxItemY, { width: taxColX[5]-taxColX[4], align: "center" });
      drawText(formatCurrency(item.sgst || 0), taxColX[5]-5, taxItemY, { width: taxColX[6]-taxColX[5], align: "right" });
      drawText(formatCurrency(itemTax || 0), taxColX[6]-5, taxItemY, { width: taxColX[7]-taxColX[6], align: "right" });
    }
    taxItemY += 15;
  });
  
  currentY = taxItemY + 5;
  doc.moveTo(startX, currentY).lineTo(endX, currentY).stroke();
  
  // Tax Total
  currentY += 4;
  drawText("Total", taxColX[0]-5, currentY, { width: taxColX[1]-taxColX[0], align: "right", font: "Helvetica-Bold", size: 8 });
  drawText(formatCurrency(invoice.subtotal || 0), taxColX[1]-5, currentY, { width: taxColX[2]-taxColX[1], align: "right" });
  if (isInterState) {
    drawText(formatCurrency(invoice.igstTotal || 0), taxColX[3]-5, currentY, { width: taxColX[4]-taxColX[3], align: "right" });
    drawText(formatCurrency(invoice.igstTotal || 0), taxColX[4]-5, currentY, { width: taxColX[5]-taxColX[4], align: "right" });
  } else {
    drawText(formatCurrency(invoice.cgstTotal || 0), taxColX[3]-5, currentY, { width: taxColX[4]-taxColX[3], align: "right" });
    drawText(formatCurrency(invoice.sgstTotal || 0), taxColX[5]-5, currentY, { width: taxColX[6]-taxColX[5], align: "right" });
    drawText(formatCurrency((invoice.cgstTotal||0)+(invoice.sgstTotal||0)), taxColX[6]-5, currentY, { width: taxColX[7]-taxColX[6], align: "right" });
  }
  currentY += 15;

  // Draw tax vertical lines & boundary
  doc.rect(startX, taxBoxStartY, width, currentY - taxBoxStartY).stroke();
  for (let i = 1; i < taxColX.length - 1; i++) {
    doc.moveTo(taxColX[i], taxBoxStartY).lineTo(taxColX[i], currentY).stroke();
  }

  // 7. Tax Word Amount
  doc.rect(startX, currentY, width, 15).stroke();
  drawText(`Tax Amount (in words)  :  INR ${invoice.taxAmountWords || ""}`, startX + 5, currentY + 4, { font: "Helvetica-Bold", size: 8 });
  currentY += 15;

  // 8. Declaration & Signatory
  const row8Height = 60;
  doc.rect(startX, currentY, width, row8Height).stroke();
  const signatureX = 350;
  doc.moveTo(signatureX, currentY).lineTo(signatureX, currentY + row8Height).stroke();
  
  // Declaration
  drawText("Declaration", startX + 5, currentY + 5, { font: "Helvetica-Bold", size: 8 });
  drawText("We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.", startX + 5, currentY + 15, { font: "Helvetica", size: 8, width: signatureX - startX - 10 });
  
  // Signatory
  drawText(`for ${invoice.seller?.businessName || ""}`, signatureX, currentY + 5, { width: endX - signatureX, align: "center", font: "Helvetica-Bold", size: 8 });
  drawText("Authorised Signatory", signatureX, currentY + row8Height - 15, { width: endX - signatureX, align: "center", font: "Helvetica", size: 8 });
  
  currentY += row8Height;
  currentY += 10;
  
  drawText("This is a Computer Generated Invoice", startX, currentY, { width, align: "center", font: "Helvetica", size: 8 });

  doc.end();
  return pdfPromise;
};

export default generatePdf;
