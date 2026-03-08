const cors = require("cors");
const env = require("./env");

const isProd = env.NODE_ENV === "production";

const corsOptions = {
  origin: env.CORS_ORIGIN,
  credentials: true
};

const refreshCookieName = "refresh_token";
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  domain: env.COOKIE_DOMAIN,
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000
};

module.exports = {
  corsMiddleware: cors(corsOptions),
  corsOptions,
  refreshCookieName,
  refreshCookieOptions
};
