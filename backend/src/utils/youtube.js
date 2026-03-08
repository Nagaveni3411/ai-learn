function extractYouTubeVideoId(input) {
  if (!input || typeof input !== "string") return null;
  const value = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const embedded = parts[1];
      if ((parts[0] === "embed" || parts[0] === "shorts") && /^[a-zA-Z0-9_-]{11}$/.test(embedded)) {
        return embedded;
      }
    }
  } catch (_) {
    return null;
  }
  return null;
}

module.exports = { extractYouTubeVideoId };
