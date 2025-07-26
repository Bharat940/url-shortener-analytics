export const normalizeUrl = (inputUrl) => {
  if (!inputUrl) return "";
  const trimmed = inputUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `http://${trimmed}`;
};

export const isValidUrl = (str) => {
  try {
    const url = new URL(str);

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    if (!url.hostname) {
      return false;
    }

    if (url.hostname === "localhost") {
      return true;
    }

    if (url.hostname.includes(".") || (url.pathname && url.pathname !== "/")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
