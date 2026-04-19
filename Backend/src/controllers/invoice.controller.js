import Invoice from "../models/invoice.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import currency from "currency.js";
import numberToWords from "number-to-words";
import generatePdf from "../utils/generatePdf.js";
import Settings from "../models/settings.model.js";
import generateSlipPdf from "../utils/generateSlipPdf.js";
import Slip from "../models/slip.model.js";
import { ImliData } from "../models/imli.model.js";

// CREATE INVOICE
export const createInvoice = asyncHandler(async (req, res) => {
  console.log("[BILLING] Starting invoice creation, billType:", req.body.billType);
  console.log("[BILLING] User:", req.user?.username || "Unknown");

  const { billType } = req.body;

  // =======================================================
  //                SLIP BILL SECTION
  // =======================================================
  if (billType === "slip") {
    console.log("[BILLING] Processing slip bill");
    const { receiverName, items,driverName } = req.body;

    const settings = await Settings.findOne();
    console.log("[BILLING] Settings found:", !!settings);

    if (!settings || !settings.seller) {
      console.log("[BILLING] Settings or seller not configured");
      throw new ApiError(400, "Please configure business settings first");
    }

    const senderName = settings.seller.businessName;
    const senderAddress = settings.seller.address;
    if (!senderName || !items?.length) {
      throw new ApiError(400, "Missing invoice data");
    }

    if (!senderName || !items?.length) {
      throw new ApiError(400, "Incomplete slip data");
    }

    let totalWeight = 0;
    let totalAmount = 0;

    items.forEach((i) => {
      totalWeight += Number(i.weight);
      totalAmount += Number(i.amount);
    });

    let nextSlipNumber = 1;

    const lastSlip = await Slip.findOne({ slipNumber: { $exists: true } }).sort(
      { slipNumber: -1 },
    );

    if (lastSlip && typeof lastSlip.slipNumber === "number") {
      nextSlipNumber = lastSlip.slipNumber + 1;
    }
    // Save slip in DB
    const slip = await Slip.create({
      slipNumber: nextSlipNumber,
      senderName,
      receiverName,
      driverName,
      senderAddress,
      date: new Date(),
      items,
      totalWeight,
      totalAmount,
    });

    // Deduct cleaned imli from total stock
    await ImliData.findOneAndUpdate(
      {},
      { $inc: { totalCleanedImli: -totalWeight } },
      { upsert: true }
    );

    // Generate slip pdf
    console.log("[BILLING] Generating slip PDF");
    let pdf;
    try {
      pdf = await generateSlipPdf(slip);
      console.log("[BILLING] Slip PDF generated successfully, size:", pdf.length);
    } catch (pdfError) {
      console.error("[BILLING] PDF generation failed:", pdfError.message);
      throw new ApiError(500, "Failed to generate PDF. Please try again or contact support.");
    }

    res.status(200);
    res.type("application/pdf");
    res.attachment(`Slip-${slip.slipNumber}.pdf`);
    return res.send(pdf);
  }

  const { customer, items, transport } = req.body;

  // fetch seller from DB
  const settings = await Settings.findOne();

  if (!settings || !settings.seller) {
    throw new ApiError(400, "Please configure business settings first");
  }

  const seller = settings.seller;
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
  console.log("[BILLING] Generating invoice PDF");
  let pdfBuffer;
  try {
    pdfBuffer = await generatePdf(invoice);
    console.log("[BILLING] Invoice PDF generated successfully, size:", pdfBuffer.length);
  } catch (pdfError) {
    console.error("[BILLING] PDF generation failed:", pdfError.message);
    throw new ApiError(500, "Failed to generate PDF. Please try again or contact support.");
  }

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

// PDF HEALTH CHECK
export const pdfHealthCheck = asyncHandler(async (req, res) => {
  console.log("[HEALTH] Testing PDF generation");
  try {
    const testSlip = {
      slipNumber: 1,
      senderName: 'Test Sender',
      receiverName: 'Test Receiver',
      senderAddress: 'Test Address',
      date: new Date(),
      items: [{
        product: 'Test Product',
        quantity: 1,
        weight: 1,
        amount: 100
      }],
      totalWeight: 1,
      totalAmount: 100
    };

    const pdf = await generateSlipPdf(testSlip);
    console.log("[HEALTH] PDF test successful, size:", pdf.length);

    return res.status(200).json({
      status: "ok",
      message: "PDF generation is working",
      pdfSize: pdf.length
    });
  } catch (error) {
    console.error("[HEALTH] PDF test failed:", error.message);
    return res.status(500).json({
      status: "error",
      message: "PDF generation failed",
      error: error.message
    });
  }
});

// CLEAN ALL DATA - Keep only config/settings
export const cleanAllData = asyncHandler(async (req, res) => {
  console.log("[CLEANUP] Starting data cleanup - removing all transactions while keeping config");

  try {
    // Models to clean (transaction data)
    const { localData } = await import("../models/local.model.js");
    const { ImliAssign } = await import("../models/imliAssign.model.js");
    const { imliReturn } = await import("../models/imliReturn.model.js");
    const { Payment } = await import("../models/payment.model.js");
    const { ActivityLog } = await import("../models/activity.model.js");
    const { logs } = await import("../models/logs.model.js");

    // Delete all transactions
    const results = {
      invoices: await Invoice.deleteMany({}),
      slips: await Slip.deleteMany({}),
      locals: await localData.deleteMany({}),
      imliAssignments: await ImliAssign.deleteMany({}),
      imliReturns: await imliReturn.deleteMany({}),
      payments: await Payment.deleteMany({}),
      activityLogs: await ActivityLog.deleteMany({}),
      paymentLogs: await logs.deleteMany({})
    };

    // Reset ImliData to zero
    await ImliData.findOneAndUpdate(
      {},
      {
        totalRawImli: 0,
        totalCleanedImli: 0
      },
      { upsert: true }
    );

    console.log("[CLEANUP] Data cleanup completed:", results);

    res.status(200).json({
      status: "success",
      message: "All transaction data has been cleared. Config, settings, login credentials, and imli prices are preserved.",
      deletedRecords: results,
      preserved: {
        users: "✓ Login credentials intact",
        settings: "✓ Business profile intact",
        imliPrices: "✓ Imli pricing intact",
        config: "✓ System configuration intact"
      }
    });
  } catch (error) {
    console.error("[CLEANUP] Error during cleanup:", error.message);
    throw new ApiError(500, `Cleanup failed: ${error.message}`);
  }
});
