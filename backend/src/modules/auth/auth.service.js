const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// this is grabbed from the .env file in /backend
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

// Making the temp users prior to having a database.
const seedHash = bcrypt.hashSync("password", 10);
const users = ["test", "dev", "user"].map((username) => ({
    username,
    passwordHash: seedHash,
}));

exports.verifyCredentials = async (username, password) => {
    const user = users.find((u) => u.username === username);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? { username: user.username } : null;
};

exports.signToken = (user) => {
    return jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

// reads the auth token and returns a valid username or null
exports.usernameFromHeader = (header) => {
    const [scheme, token] = (header ?? "").split(" ");
    if (scheme !== "Bearer" || !token) return null;
    try {
        return exports.verifyToken(token).username;
    } catch {
        return null;
    }
};
