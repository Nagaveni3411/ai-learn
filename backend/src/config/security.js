const cors = require("cors");
const env = require("./env");

const isProd = env.NODE_ENV === "production";
const allowedOrigins = env.CORS_ORIGIN
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.length) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true
};

const refreshCookieName = "refresh_token";
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000
};
if (env.COOKIE_DOMAIN) {
  refreshCookieOptions.domain = env.COOKIE_DOMAIN;
}

module.exports = {
  corsMiddleware: cors(corsOptions),
  corsOptions,
  refreshCookieName,
  refreshCookieOptions
};
