const createError = require("http-errors");
const { verifyAccessToken } = require("../utils/jwt");

function authMiddleware(req, _res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return next(createError(401, "Missing or invalid authorization header"));
  }
  const token = auth.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    return next();
  } catch (_) {
    return next(createError(401, "Invalid or expired access token"));
  }
}

module.exports = authMiddleware;
