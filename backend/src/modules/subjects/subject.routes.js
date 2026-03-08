const router = require("express").Router();
const controller = require("./subject.controller");
const auth = require("../../middleware/authMiddleware");

router.get("/", controller.listSubjects);
router.get("/:subjectId", controller.getSubject);
router.get("/:subjectId/tree", auth, controller.getTree);
router.get("/:subjectId/first-video", auth, controller.firstVideo);

module.exports = router;
