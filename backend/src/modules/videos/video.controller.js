const service = require("./video.service");

async function getVideo(req, res, next) {
  try {
    const data = await service.getVideoDetail(Number(req.params.videoId), req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getVideo };
