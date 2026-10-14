const feedService = require("./feed.service");

exports.getFeed = (req, res) => {
    res.json(feedService.getFeed());
};
