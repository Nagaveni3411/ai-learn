const createError = require("http-errors");
const { registerSchema, loginSchema } = require("./auth.validator");
const authService = require("./auth.service");
const { refreshCookieName, refreshCookieOptions } = require("../../config/security");

async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw createError(400, "Invalid request body");
    const result = await authService.register(parsed.data);
    res.cookie(refreshCookieName, result.refreshToken, refreshCookieOptions);
    res.status(201).json({
      user: result.user,
      access_token: result.accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw createError(400, "Invalid request body");
    const result = await authService.login(parsed.data);
    res.cookie(refreshCookieName, result.refreshToken, refreshCookieOptions);
    res.json({
      user: result.user,
      access_token: result.accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[refreshCookieName];
    const result = await authService.refresh(refreshToken);
    res.json({ access_token: result.accessToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.[refreshCookieName];
    await authService.logout(refreshToken);
    res.clearCookie(refreshCookieName, refreshCookieOptions);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout
};
