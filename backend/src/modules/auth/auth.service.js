const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../db");

// .env file in the repo root
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

// returns the new user, or null if the username is already taken
exports.createUser = async (username, password) => {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return null;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, passwordHash } });
    return { id: user.id, username: user.username };
};

exports.verifyCredentials = async (username, password) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    const match = await bcrypt.compare(password, user.passwordHash);
    return match ? { id: user.id, username: user.username } : null;
};

exports.signToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

// reads the "Bearer <token>" header and returns { id, username }, or null if it's missing or invalid
exports.userFromHeader = (header) => {
    const [scheme, token] = (header ?? "").split(" ");
    if (scheme !== "Bearer" || !token) return null;
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return { id: payload.id, username: payload.username };
    } catch {
        return null;
    }
};
