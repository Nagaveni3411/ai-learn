const db = require("../../config/db");

function getProgressByUserAndVideo(userId, videoId) {
  return db("video_progress")
    .where({ user_id: userId, video_id: videoId })
    .first();
}

function getProgressForVideos(userId, videoIds) {
  if (!videoIds.length) return Promise.resolve([]);
  return db("video_progress").where({ user_id: userId }).whereIn("video_id", videoIds);
}

async function upsertVideoProgress({ user_id, video_id, last_position_seconds, is_completed }) {
  const existing = await getProgressByUserAndVideo(user_id, video_id);
  const now = new Date();

  if (!existing) {
    const payload = {
      user_id,
      video_id,
      last_position_seconds,
      is_completed,
      completed_at: is_completed ? now : null
    };
    await db("video_progress").insert(payload);
    return getProgressByUserAndVideo(user_id, video_id);
  }

  const nextIsCompleted = Boolean(existing.is_completed) || Boolean(is_completed);
  const nextPosition = nextIsCompleted
    ? Math.max(Number(existing.last_position_seconds || 0), Number(last_position_seconds || 0))
    : Number(last_position_seconds || 0);

  await db("video_progress")
    .where({ id: existing.id })
    .update({
      last_position_seconds: nextPosition,
      is_completed: nextIsCompleted,
      completed_at: nextIsCompleted ? existing.completed_at || now : null,
      updated_at: now
    });

  return getProgressByUserAndVideo(user_id, video_id);
}

async function getSubjectProgressSummary(userId, subjectId) {
  const totalRow = await db("videos as v")
    .join("sections as s", "s.id", "v.section_id")
    .where("s.subject_id", subjectId)
    .count({ total: "*" })
    .first();

  const completedRow = await db("video_progress as vp")
    .join("videos as v", "v.id", "vp.video_id")
    .join("sections as s", "s.id", "v.section_id")
    .where("vp.user_id", userId)
    .andWhere("vp.is_completed", 1)
    .andWhere("s.subject_id", subjectId)
    .count({ completed: "*" })
    .first();

  const lastRow = await db("video_progress as vp")
    .join("videos as v", "v.id", "vp.video_id")
    .join("sections as s", "s.id", "v.section_id")
    .where("vp.user_id", userId)
    .andWhere("s.subject_id", subjectId)
    .orderBy("vp.updated_at", "desc")
    .select("vp.video_id as last_video_id", "vp.last_position_seconds")
    .first();

  const total = Number(totalRow?.total || 0);
  const completed = Number(completedRow?.completed || 0);
  return {
    total_videos: total,
    completed_videos: completed,
    percent_complete: total ? Math.round((completed / total) * 100) : 0,
    last_video_id: lastRow?.last_video_id || null,
    last_position_seconds: lastRow?.last_position_seconds || 0
  };
}

module.exports = {
  getProgressByUserAndVideo,
  getProgressForVideos,
  upsertVideoProgress,
  getSubjectProgressSummary
};
