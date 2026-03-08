function resolveApiBaseUrl() {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase && envBase.trim()) return envBase.trim();

  if (typeof window === "undefined") return "http://localhost:5000";
  const { origin, hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  // In deployed frontend, default to same-origin so reverse-proxy setups work.
  return origin;
}

export const API_BASE_URL = resolveApiBaseUrl();
