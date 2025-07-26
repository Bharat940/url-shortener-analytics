import { getShortUrl } from "../dao/shortUrl.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/shortUrl.service.js";
import wrapAsync from "../utils/tryCatchWraper.js";

export const createShortUrl = wrapAsync(async (req, res) => {
  const { url, slug, generateQRCode } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  let newUrlDoc;

  if (req.user) {
    newUrlDoc = await createShortUrlWithUser(
      url,
      req.user._id,
      slug,
      generateQRCode
    );
  } else {
    newUrlDoc = await createShortUrlWithoutUser(url, generateQRCode);
  }

  res.status(200).json({
    message: "URL processed successfully!",
    data: {
      _id: newUrlDoc._id,
      full_url: newUrlDoc.full_url,
      short_url: `${(process.env.APP_URL || "http://localhost:3000").replace(
        /\/+$/,
        ""
      )}/${newUrlDoc.short_url}`,
      clicks: newUrlDoc.clicks,
      qrcode_image: newUrlDoc.qrcode_image || null,
    },
  });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
  const { id } = req.params;

  const url = await getShortUrl(id, req);

  if (url) {
    res.redirect(url.full_url);
  } else {
    res.status(404).send("Not found");
  }
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
  const { url, slug } = req.body;
  const shortUrl = await createShortUrlWithoutUser(url, slug);
  res.status(200).json({ shortUrl: process.env.APP_URL + shortUrl });
});
