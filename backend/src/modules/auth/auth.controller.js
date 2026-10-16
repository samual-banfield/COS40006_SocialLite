const authService = require("./auth.service");

exports.login = async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "username and password are required" });
    }
    const user = await authService.verifyCredentials(username.trim(), password);
    if (!user) {
        return res.status(401).json({ error: "invalid username or password" });
    }
    res.json({ token: authService.signToken(user), user });
};
