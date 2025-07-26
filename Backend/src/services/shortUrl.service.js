import { generateNanoId } from "../utils/helper.js";
import { getCustomShortUrl, saveShortUrl } from "../dao/shortUrl.js";
import { ConflictError } from "../utils/errorHandler.js";

export const createShortUrlWithoutUser = async (url, generateQRCode) => {
  const shortUrlId = generateNanoId(7);
  if (!shortUrlId) throw new Error("Short URL not generated");

  return await saveShortUrl(shortUrlId, url, null, generateQRCode);
};

export const createShortUrlWithUser = async (
  url,
  userId,
  slug = null,
  generateQRCode
) => {
  const shortUrlId = slug || generateNanoId(7);

  if (slug) {
    const exists = await getCustomShortUrl(slug);
    if (exists) throw new ConflictError("This custom URL already exists");
  }

  return await saveShortUrl(shortUrlId, url, userId, generateQRCode);
};
