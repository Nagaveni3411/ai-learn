const createError = require("http-errors");
const videoRepo = require("./video.repository");
const subjectRepo = require("../subjects/subject.repository");
const progressRepo = require("../progress/progress.repository");
const { flattenSubjectTree, applyLocking, buildVideoNavigation } = require("../../utils/ordering");

async function getVideoDetail(videoId, userId) {
  const video = await videoRepo.getVideoById(videoId);
  if (!video) throw createError(404, "Video not found");

  const tree = await subjectRepo.getTree(video.subject_id);
  const sequence = flattenSubjectTree(tree.sections);
  const progressRows = await progressRepo.getProgressForVideos(
    userId,
    sequence.map((v) => v.id)
  );
  const progressMap = progressRows.reduce((acc, row) => {
    acc[String(row.video_id)] = row;
    return acc;
  }, {});
  const lockedSequence = applyLocking(sequence, progressMap);
  const navMap = buildVideoNavigation(sequence);

  const lockInfo = lockedSequence.find((v) => String(v.id) === String(videoId));
  const nav = navMap.get(String(videoId)) || { previous_video_id: null, next_video_id: null };

  return {
    ...video,
    previous_video_id: nav.previous_video_id,
    next_video_id: nav.next_video_id,
    locked: Boolean(lockInfo?.locked),
    unlock_reason: lockInfo?.unlock_reason || "Unknown"
  };
}

module.exports = { getVideoDetail };
