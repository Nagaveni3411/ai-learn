const db = require("../../config/db");

async function getSectionsWithVideos(subjectId) {
  const sections = await db("sections")
    .select("id", "subject_id", "title", "order_index")
    .where({ subject_id: subjectId })
    .orderBy("order_index", "asc");

  const sectionIds = sections.map((s) => s.id);
  const videos = sectionIds.length
    ? await db("videos")
        .select("id", "section_id", "title", "description", "youtube_url", "order_index", "duration_seconds")
        .whereIn("section_id", sectionIds)
        .orderBy("order_index", "asc")
    : [];

  const bySection = videos.reduce((acc, v) => {
    acc[v.section_id] = acc[v.section_id] || [];
    acc[v.section_id].push(v);
    return acc;
  }, {});

  return sections.map((section) => ({
    ...section,
    videos: bySection[section.id] || []
  }));
}

module.exports = {
  getSectionsWithVideos
};
