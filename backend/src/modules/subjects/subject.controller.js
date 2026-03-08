const createError = require("http-errors");
const service = require("./subject.service");

async function listSubjects(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize || 10), 1), 50);
    const q = req.query.q ? String(req.query.q) : undefined;
    const result = await service.listPublished({ page, pageSize, q });
    res.json({
      page,
      pageSize,
      total: result.total,
      items: result.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getSubject(req, res, next) {
  try {
    const subject = await service.getById(Number(req.params.subjectId));
    res.json(subject);
  } catch (err) {
    next(err);
  }
}

async function getTree(req, res, next) {
  try {
    const tree = await service.getTreeForUser(Number(req.params.subjectId), req.user.id);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

async function firstVideo(req, res, next) {
  try {
    const data = await service.getFirstUnlockedVideoId(Number(req.params.subjectId), req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSubjects,
  getSubject,
  getTree,
  firstVideo
};
