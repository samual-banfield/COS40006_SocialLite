const authService = require("../modules/auth/auth.service");

// expects an "Authorization: Bearer <token>" header and sets req.user from the token
const requireAuth = function (req, res, next) {
    const [scheme, token] = (req.headers.authorization ?? "").split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "you must be logged in" });
    }
    try {
        const payload = authService.verifyToken(token);
        req.user = { username: payload.username };
    } catch {
        return res.status(401).json({ error: "invalid or expired token" });
    }
    next();
};

module.exports = requireAuth;
