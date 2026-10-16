const feedService = require("./feed.service");
const authService = require("../auth/auth.service");

exports.getFeed = (req, res) => {
    const username = authService.usernameFromHeader(req.headers.authorization);
    res.json(feedService.getFeed(username));
};
