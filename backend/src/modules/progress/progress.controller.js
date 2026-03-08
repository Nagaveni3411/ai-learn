const createError = require("http-errors");
const service = require("./progress.service");

async function getSubjectProgress(req, res, next) {
  try {
    const data = await service.getSubjectProgress(req.user.id, Number(req.params.subjectId));
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getVideoProgress(req, res, next) {
  try {
    const data = await service.getVideoProgress(req.user.id, Number(req.params.videoId));
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function upsertVideoProgress(req, res, next) {
  try {
    if (typeof req.body !== "object") throw createError(400, "Invalid request body");
    const data = await service.upsertVideoProgress(req.user.id, Number(req.params.videoId), req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSubjectProgress,
  getVideoProgress,
  upsertVideoProgress
};
