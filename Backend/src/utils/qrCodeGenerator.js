import QRCode from "qrcode";

export const generateQRCode = async (url) => {
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 256,
    });
  } catch (err) {
    console.error("Failed to generate QR code", err);
    throw new Error("QR code generation failed");
  }
};
