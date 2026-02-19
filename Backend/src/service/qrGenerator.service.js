import qrcode from "qrcode";
import { uploadQR } from "./cloudinary.service.js";

export const generateQRCode = async (text) => {
    if (!text) throw new Error("Text is required to generate QR code");

    try {
        // 1. Generate QR as base64 Data URL
        const base64QR = await qrcode.toDataURL(text);

        // 2. Upload to Cloudinary and get the secure URL
        const cloudinaryUrl = await uploadQR(base64QR);

        // 3. Return the Cloudinary URL (this is what gets saved in DB)
        return cloudinaryUrl;
    } catch (err) {
        throw new Error("Failed to generate/upload QR code: " + err.message);
    }
};

export const getOrGenerateQR = async (localDoc) => {
    if (!localDoc) throw new Error("Local document is required");

    // Return existing Cloudinary QR URL if already saved
    if (localDoc.payment?.upiQRCode) {
        return localDoc.payment.upiQRCode;
    }

    if (!localDoc.payment?.upiId) {
        throw new Error("UPI ID is required to generate QR code");
    }

    // Generate QR + upload to Cloudinary, do NOT save here
    return await generateQRCode(localDoc.payment.upiId);
};