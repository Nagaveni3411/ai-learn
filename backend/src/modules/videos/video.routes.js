const router = require("express").Router();
const auth = require("../../middleware/authMiddleware");
const controller = require("./video.controller");

router.get("/:videoId", auth, controller.getVideo);

module.exports = router;
