import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'de66dwuow',
    api_key: '857358565682715',
    api_secret: process.env.CLOUDINARY_API_SECRET  
});

export const uploadQR = async (base64QR) => {
    if (!base64QR) throw new Error("QR code is required");

    try {
        const result = await cloudinary.uploader.upload(base64QR, {
            folder: "stms",
        });
        return result.secure_url;
    } catch (err) {
        throw new Error("Failed to upload QR: " + err.message);
    }
};