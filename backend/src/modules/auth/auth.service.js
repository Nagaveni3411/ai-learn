const createError = require("http-errors");
const db = require("../../config/db");
const { findByEmail, createUser } = require("../users/user.model");
const { hashPassword, comparePassword } = require("../../utils/password");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken
} = require("../../utils/jwt");

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.name };
}

async function issueTokens(user) {
  const payload = { sub: user.id, email: user.email, name: user.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const token_hash = hashToken(refreshToken);
  const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db("refresh_tokens").insert({
    user_id: user.id,
    token_hash,
    expires_at
  });

  return { accessToken, refreshToken };
}

async function register({ email, password, name }) {
  const exists = await findByEmail(email);
  if (exists) throw createError(409, "Email already registered");

  const password_hash = await hashPassword(password);
  const user = await createUser({ email, password_hash, name });
  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) throw createError(401, "Invalid credentials");
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw createError(401, "Invalid credentials");

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw createError(401, "Missing refresh token");
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (_) {
    throw createError(401, "Invalid refresh token");
  }
  const token_hash = hashToken(refreshToken);

  const row = await db("refresh_tokens")
    .where({ user_id: decoded.sub, token_hash })
    .whereNull("revoked_at")
    .first();

  if (!row) throw createError(401, "Refresh token revoked");
  if (new Date(row.expires_at) < new Date()) throw createError(401, "Refresh token expired");

  const accessToken = signAccessToken({
    sub: decoded.sub,
    email: decoded.email,
    name: decoded.name
  });
  return { accessToken };
}

async function logout(refreshToken) {
  if (!refreshToken) return;
  const token_hash = hashToken(refreshToken);
  await db("refresh_tokens")
    .where({ token_hash })
    .whereNull("revoked_at")
    .update({ revoked_at: new Date() });
}

module.exports = {
  register,
  login,
  refresh,
  logout
};
