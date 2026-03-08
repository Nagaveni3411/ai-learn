const db = require("../../config/db");
const { getSectionsWithVideos } = require("../sections/section.repository");

async function listPublished({ page = 1, pageSize = 10, q }) {
  const offset = (page - 1) * pageSize;
  const query = db("subjects").where({ is_published: 1 });
  if (q) query.andWhere("title", "like", `%${q}%`);

  const rows = await query
    .clone()
    .select("id", "title", "slug", "description", "created_at", "updated_at")
    .orderBy("created_at", "desc")
    .limit(pageSize)
    .offset(offset);

  const [{ count }] = await query.clone().count({ count: "*" });
  return { rows, total: Number(count) };
}

function getById(subjectId) {
  return db("subjects")
    .select("id", "title", "slug", "description", "is_published", "created_at", "updated_at")
    .where({ id: subjectId })
    .first();
}

async function getTree(subjectId) {
  const subject = await getById(subjectId);
  if (!subject) return null;
  const sections = await getSectionsWithVideos(subjectId);
  return {
    id: subject.id,
    title: subject.title,
    slug: subject.slug,
    description: subject.description,
    sections
  };
}

module.exports = {
  listPublished,
  getById,
  getTree
};
