require("../src/env");
const jwt = require("jsonwebtoken");
const authService = require("../src/modules/auth/auth.service");

exports.users = {
    test: { id: 1, username: "test" },
    dolorSit: { id: 5, username: "dolor_sit" },
};

exports.bearer = (token) => `Bearer ${token}`;

exports.validToken = (user = exports.users.test) => authService.signToken(user);

exports.expiredToken = (user = exports.users.test) =>
    jwt.sign(
        { ...user, exp: Math.floor(Date.now() / 1000) - 60 },
        process.env.JWT_SECRET,
    );

// authorization headers that should never be accepted
exports.malformedHeaders = () => {
    const valid = exports.validToken();
    return [
        ["a token that isn't a jwt", exports.bearer("not-a-jwt")],
        [
            "a token with a tampered signature",
            exports.bearer(valid.slice(0, -4) + "AAAA"),
        ],
        [
            "a token signed with the wrong secret",
            exports.bearer(jwt.sign(exports.users.test, "not-the-real-secret")),
        ],
        ["a token without the Bearer scheme", valid],
        ["the wrong scheme", `Basic ${valid}`],
        ["Bearer with no token", "Bearer "],
    ];
};
