const createError = require("http-errors");
const repo = require("./progress.repository");
const db = require("../../config/db");

async function getVideoProgress(userId, videoId) {
  const row = await repo.getProgressByUserAndVideo(userId, videoId);
  return {
    last_position_seconds: row?.last_position_seconds || 0,
    is_completed: Boolean(row?.is_completed)
  };
}

async function upsertVideoProgress(userId, videoId, payload) {
  const video = await db("videos").where({ id: videoId }).first();
  if (!video) throw createError(404, "Video not found");

  const rawSeconds = Number(payload.last_position_seconds ?? 0);
  const safeSeconds = Number.isFinite(rawSeconds) ? Math.max(0, Math.floor(rawSeconds)) : 0;
  const cappedSeconds =
    video.duration_seconds && video.duration_seconds > 0
      ? Math.min(safeSeconds, video.duration_seconds)
      : safeSeconds;

  const isCompleted = Boolean(payload.is_completed);
  const result = await repo.upsertVideoProgress({
    user_id: userId,
    video_id: videoId,
    last_position_seconds: isCompleted && video.duration_seconds ? video.duration_seconds : cappedSeconds,
    is_completed: isCompleted
  });

  return {
    last_position_seconds: result.last_position_seconds,
    is_completed: Boolean(result.is_completed)
  };
}

function getSubjectProgress(userId, subjectId) {
  return repo.getSubjectProgressSummary(userId, subjectId);
}

module.exports = {
  getVideoProgress,
  upsertVideoProgress,
  getSubjectProgress
};
