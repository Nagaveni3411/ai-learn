const createError = require("http-errors");
const subjectRepo = require("./subject.repository");
const progressRepo = require("../progress/progress.repository");
const { flattenSubjectTree, applyLocking } = require("../../utils/ordering");

async function listPublished(params) {
  return subjectRepo.listPublished(params);
}

async function getById(subjectId) {
  const subject = await subjectRepo.getById(subjectId);
  if (!subject || !subject.is_published) throw createError(404, "Subject not found");
  return subject;
}

async function getTreeForUser(subjectId, userId) {
  const tree = await subjectRepo.getTree(subjectId);
  if (!tree) throw createError(404, "Subject not found");

  const sequence = flattenSubjectTree(
    tree.sections.map((s) => ({
      id: s.id,
      subject_id: Number(subjectId),
      title: s.title,
      order_index: s.order_index,
      videos: s.videos
    }))
  );

  const progressRows = await progressRepo.getProgressForVideos(
    userId,
    sequence.map((v) => v.id)
  );
  const progressMap = progressRows.reduce((acc, row) => {
    acc[String(row.video_id)] = row;
    return acc;
  }, {});
  const lockedSequence = applyLocking(sequence, progressMap);
  const lockedMap = lockedSequence.reduce((acc, v) => {
    acc[String(v.id)] = v;
    return acc;
  }, {});

  return {
    id: tree.id,
    title: tree.title,
    sections: tree.sections.map((section) => ({
      id: section.id,
      title: section.title,
      order_index: section.order_index,
      videos: section.videos.map((video) => ({
        id: video.id,
        title: video.title,
        order_index: video.order_index,
        is_completed: Boolean(progressMap[String(video.id)]?.is_completed),
        locked: Boolean(lockedMap[String(video.id)]?.locked)
      }))
    }))
  };
}

async function getFirstUnlockedVideoId(subjectId, userId) {
  const tree = await subjectRepo.getTree(subjectId);
  if (!tree) throw createError(404, "Subject not found");
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
  const first = lockedSequence.find((v) => !v.locked);
  return { video_id: first ? first.id : null };
}

module.exports = {
  listPublished,
  getById,
  getTreeForUser,
  getFirstUnlockedVideoId
};
