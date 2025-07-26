import axiosInstance from "../utils/axiosInstance";

export const createShortUrl = async (
  url,
  customSlug = "",
  generateQRCode = false
) => {
  const payload = { url, generateQRCode };
  if (customSlug && customSlug.trim() !== "") {
    payload.slug = customSlug.trim();
  }

  const { data } = await axiosInstance.post("/api/create", payload);
  return data.data;
};
