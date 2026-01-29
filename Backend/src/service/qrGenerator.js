import qrcode from "qrcode";

/**
 * Generate QR code from text
 */
export const generateQRCode = async (text) => {
    if (!text) {
        throw new Error("Text is required to generate QR code");
    }

    try {
        return await qrcode.toDataURL(text);
    } catch {
        throw new Error("Failed to generate QR code");
    }
};

/**
 * Get existing QR or generate and persist a new one
 */
export const getOrGenerateQR = async (localDoc) => {
    if (!localDoc) {
        throw new Error("Local document is required");
    }

    if (localDoc.payment?.upiQRCode) {
        return localDoc.payment.upiQRCode;
    }

    if (!localDoc.payment?.upiId) {
        throw new Error("UPI ID is required to generate QR code");
    }

    const qrCodeDataURL = await generateQRCode(localDoc.payment.upiId);

    // Persist QR in DB
    localDoc.payment.upiQRCode = qrCodeDataURL;
    await localDoc.save();

    return qrCodeDataURL;
};
