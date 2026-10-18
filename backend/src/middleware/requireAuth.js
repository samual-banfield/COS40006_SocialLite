const authService = require("../modules/auth/auth.service");

// sets req.user to { id, username }, or responds with 401 if the user isn't logged in
const requireAuth = function (req, res, next) {
    req.user = authService.userFromHeader(req.headers.authorization);
    if (!req.user) {
        return res.status(401).json({ error: "you must be logged in" });
    }
    next();
};

module.exports = requireAuth;
