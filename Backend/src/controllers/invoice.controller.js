import Invoice from "../models/invoice.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import currency from "currency.js";
import numberToWords from "number-to-words";
import generatePdf from "../utils/generatePdf.js";

// CREATE INVOICE
export const createInvoice = asyncHandler(async (req, res) => {
  const { seller, customer, items, transport } = req.body;

  if (!seller || !customer || !items?.length) {
    throw new ApiError(400, "Missing invoice data");
  }

  // check interstate
  const isInterState = seller.stateCode !== customer.stateCode;

  let subtotal = 0,
    cgstTotal = 0,
    sgstTotal = 0,
    igstTotal = 0;

  const calculatedItems = items.map((item) => {
    const taxable = currency(item.quantity).multiply(item.rate).value;

    const gstAmount = currency(taxable).multiply(item.gstPercent / 100).value;

    let cgst = 0,
      sgst = 0,
      igst = 0;

    if (isInterState) {
      igst = gstAmount;
      igstTotal += igst;
    } else {
      cgst = gstAmount / 2;
      sgst = gstAmount / 2;
      cgstTotal += cgst;
      sgstTotal += sgst;
    }

    subtotal += taxable;

    return {
      ...item,
      amount: taxable,
      cgst,
      sgst,
      igst,
    };
  });

  const grandTotal = currency(subtotal)
    .add(cgstTotal)
    .add(sgstTotal)
    .add(igstTotal).value;

  const grandTotalWords =
    numberToWords.toWords(Math.round(grandTotal)) + " Rupees Only";

  const totalTax = igstTotal + cgstTotal + sgstTotal;

  const taxAmountWords =
    numberToWords.toWords(Math.round(totalTax)) + " Rupees Only";

  const invoice = await Invoice.create({
    invoiceNumber: `INV-${Date.now()}`,
    invoiceDate: new Date(),
    seller,
    customer,
    transport,
    items: calculatedItems,
    subtotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    grandTotal,
    amountWords: grandTotalWords,
    taxAmountWords: taxAmountWords,
  });

  // generate pdf

  const pdfBuffer = await generatePdf(invoice);

  // 👇 direct download response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`,
  );

  res.status(200);
  res.type("application/pdf");
  res.attachment(`${invoice.invoiceNumber}.pdf`);
  res.send(pdfBuffer);
});

// GET PDF
export const getInvoicePdf = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new ApiError(404, "Invoice not found");

  const pdfBuffer = await generatePdf(invoice);

  // 👇 THIS makes browser download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`,
  );

  res.send(pdfBuffer);
});
