export const normalizeUrl = (inputUrl) => {
  if (!inputUrl) return "";
  const trimmed = inputUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `http://${trimmed}`;
};
