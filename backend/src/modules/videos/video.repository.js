const db = require("../../config/db");

function getVideoById(videoId) {
  return db("videos as v")
    .join("sections as s", "s.id", "v.section_id")
    .join("subjects as sub", "sub.id", "s.subject_id")
    .select(
      "v.id",
      "v.title",
      "v.description",
      "v.youtube_url",
      "v.order_index",
      "v.duration_seconds",
      "v.section_id",
      "s.title as section_title",
      "sub.id as subject_id",
      "sub.title as subject_title"
    )
    .where("v.id", videoId)
    .first();
}

function getSubjectSectionsWithVideos(subjectId) {
  return db("sections as s")
    .leftJoin("videos as v", "v.section_id", "s.id")
    .where("s.subject_id", subjectId)
    .select(
      "s.id as section_id",
      "s.subject_id",
      "s.title as section_title",
      "s.order_index as section_order_index",
      "v.id as video_id",
      "v.title as video_title",
      "v.description as video_description",
      "v.youtube_url",
      "v.order_index as video_order_index",
      "v.duration_seconds"
    )
    .orderBy("s.order_index", "asc")
    .orderBy("v.order_index", "asc");
}

module.exports = {
  getVideoById,
  getSubjectSectionsWithVideos
};
