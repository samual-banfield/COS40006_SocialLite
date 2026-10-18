const feedService = require("./feed.service");
const authService = require("../auth/auth.service");

exports.getFeed = async (req, res) => {
    const user = authService.userFromHeader(req.headers.authorization);
    res.json(await feedService.getFeed(user?.id));
};
