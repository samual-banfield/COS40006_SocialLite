const authService = require("./auth.service");

const USERNAME_PATTERN = /^[A-Za-z0-9._]{3,32}$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72; // bcrypt ignores anything past 72 bytes

exports.signup = async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "username and password are required" });
    }
    if (!USERNAME_PATTERN.test(username.trim())) {
        return res.status(400).json({
            error: "usernames must be 3-32 characters of letters, numbers, dots or underscores",
        });
    }
    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
        return res.status(400).json({
            error: `passwords must be ${PASSWORD_MIN}-${PASSWORD_MAX} characters`,
        });
    }
    const user = await authService.createUser(username.trim(), password);
    if (!user) {
        return res.status(409).json({ error: "that username is already taken" });
    }
    res.status(201).json({ token: authService.signToken(user), user });
};

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
