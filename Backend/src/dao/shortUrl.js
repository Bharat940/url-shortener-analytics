import ShortUrl from "../models/shortUrl.model.js";
import { ConflictError } from "../utils/errorHandler.js";
import { generateQRCode } from "../utils/qrCodeGenerator.js";
import { recordClick } from "./analytics.js";

export const saveShortUrl = async (
  shortUrl,
  longUrl,
  userId,
  generateQR = false
) => {
  try {
    const baseUrl = (process.env.APP_URL || "http://localhost:3000").replace(
      /\/+$/,
      ""
    );
    const fullShortenedUrl = `${baseUrl}/${shortUrl}`;

    let qrCodeImage = null;
    if (generateQR) {
      qrCodeImage = await generateQRCode(fullShortenedUrl);
    }

    const newUrl = new ShortUrl({
      full_url: longUrl,
      short_url: shortUrl,
      qrcode_image: qrCodeImage,
    });

    if (userId) {
      newUrl.user = userId;
    }

    return await newUrl.save();
  } catch (err) {
    if (err.code == 11000) {
      throw new ConflictError("Short URL already exists");
    }
    throw err;
  }
};

export const getShortUrl = async (shortUrl, req = null) => {
  const url = await ShortUrl.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (url && req) {
    await recordClick(url._id, req);
  }

  return url;
};

export const getCustomShortUrl = async (slug) => {
  return await ShortUrl.findOne({ short_url: slug });
};
