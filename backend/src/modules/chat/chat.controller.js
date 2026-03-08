const createError = require("http-errors");
const { askChat } = require("./chat.service");

async function chat(req, res, next) {
  try {
    const messages = req.body?.messages;
    if (!Array.isArray(messages)) throw createError(400, "messages must be an array");
    const sanitized = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20);
    const result = await askChat(sanitized);
    res.json({ reply: result.reply, source: result.source || "openai" });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
