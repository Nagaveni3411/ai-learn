const router = require("express").Router();
const auth = require("../../middleware/authMiddleware");
const controller = require("./progress.controller");

router.get("/subjects/:subjectId", auth, controller.getSubjectProgress);
router.get("/videos/:videoId", auth, controller.getVideoProgress);
router.post("/videos/:videoId", auth, controller.upsertVideoProgress);

module.exports = router;
