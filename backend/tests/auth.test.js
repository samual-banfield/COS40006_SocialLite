const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");
const { AuthResponse, Error } = require("../src/schemas");

const created = [];
const uniqueUsername = () => {
    const username = `jest_${Date.now()}_${created.length}`;
    created.push(username);
    return username;
};

// After all tests we want to remove usernames created by these tests
afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: { in: created } } });
    await prisma.$disconnect();
});

const badBodies = [
    ["an empty body", {}],
    ["a missing username", { password: "password" }],
    ["a missing password", { username: "test" }],
    ["a whitespace username", { username: "   ", password: "password" }],
    ["a whitespace password", { username: "test", password: "   " }],
    ["a non-string username", { username: 123, password: "password" }],
    ["a non-string password", { username: "test", password: 123 }],
    ["a null username", { username: null, password: "password" }],
    [
        "a username over 32 characters",
        { username: "a".repeat(33), password: "password" },
    ],
];

describe("POST /api/auth/signup", () => {
    describe("ideal", () => {
        it("creates the user and returns a token", async () => {
            const username = uniqueUsername();
            const res = await request(app)
                .post("/api/auth/signup")
                .send({ username, password: "password" });
            expect(res.status).toBe(201);
            const body = AuthResponse.parse(res.body);
            expect(body.user.username).toBe(username);
        });

        it("trims the username", async () => {
            const username = uniqueUsername();
            const res = await request(app)
                .post("/api/auth/signup")
                .send({ username: `  ${username}  `, password: "password" });
            expect(res.status).toBe(201);
            expect(AuthResponse.parse(res.body).user.username).toBe(username);
        });

        it("returns a token that can be used to log in", async () => {
            const username = uniqueUsername();
            await request(app)
                .post("/api/auth/signup")
                .send({ username, password: "secret" });
            const res = await request(app)
                .post("/api/auth/login")
                .send({ username, password: "secret" });
            expect(res.status).toBe(200);
            AuthResponse.parse(res.body);
        });

        it("returns 409 when the username is already taken", async () => {
            const res = await request(app)
                .post("/api/auth/signup")
                .send({ username: "test", password: "password" });
            expect(res.status).toBe(409);
            Error.parse(res.body);
        });
    });

    describe("bad body", () => {
        it.each(badBodies)("returns 400 for %s", async (_, body) => {
            const res = await request(app).post("/api/auth/signup").send(body);
            expect(res.status).toBe(400);
            Error.parse(res.body);
        });

        it("returns 400 for malformed json", async () => {
            const res = await request(app)
                .post("/api/auth/signup")
                .set("Content-Type", "application/json")
                .send('{"username": "test",');
            expect(res.status).toBe(400);
            expect(Error.parse(res.body).error).toBe(
                "request body must be valid json",
            );
        });
    });
});

describe("POST /api/auth/login", () => {
    describe("ideal", () => {
        it("returns a token for a seeded user", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ username: "test", password: "password" });
            expect(res.status).toBe(200);
            const body = AuthResponse.parse(res.body);
            expect(body.user).toEqual({ id: 1, username: "test" });
        });

        it("returns 401 for the wrong password", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ username: "test", password: "wrong" });
            expect(res.status).toBe(401);
            Error.parse(res.body);
        });

        it("returns 401 for a user that doesn't exist", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ username: "nobody_here", password: "password" });
            expect(res.status).toBe(401);
            Error.parse(res.body);
        });

        it("doesn't trim the password", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ username: "test", password: " password " });
            expect(res.status).toBe(401);
        });
    });

    describe("bad body", () => {
        it.each(badBodies)("returns 400 for %s", async (_, body) => {
            const res = await request(app).post("/api/auth/login").send(body);
            expect(res.status).toBe(400);
            Error.parse(res.body);
        });

        it("returns 400 for malformed json", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send('{"username": "test",');
            expect(res.status).toBe(400);
            expect(Error.parse(res.body).error).toBe(
                "request body must be valid json",
            );
        });
    });
});
