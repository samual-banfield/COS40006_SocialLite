const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");
const { Post, Error } = require("../src/schemas");
const {
    users,
    bearer,
    validToken,
    expiredToken,
    malformedHeaders,
} = require("./helpers");

const createdIds = [];

// After all tests we want to remove usernames created by these tests
afterAll(async () => {
    await prisma.post.deleteMany({ where: { id: { in: createdIds } } });
    await prisma.like.deleteMany({
        where: { postId: 3, userId: users.test.id },
    });
    await prisma.$disconnect();
});

const auth = () => bearer(validToken());

const badIds = [
    ["a non-numeric id", "abc"],
    ["a zero id", "0"],
    ["a negative id", "-1"],
    ["a decimal id", "1.5"],
];

const expect401 = (res) => {
    expect(res.status).toBe(401);
    Error.parse(res.body);
};

const expect400 = (res) => {
    expect(res.status).toBe(400);
    Error.parse(res.body);
};

describe("GET /api/post/:id", () => {
    describe("ideal", () => {
        it("returns the post for a valid id", async () => {
            const res = await request(app).get("/api/post/1");
            expect(res.status).toBe(200);
            expect(Post.parse(res.body).id).toBe(1);
        });

        it("sets likedByMe for the logged in user", async () => {
            // dolor_sit likes post 1 in the seed data
            const res = await request(app)
                .get("/api/post/1")
                .set("Authorization", bearer(validToken(users.dolorSit)));
            expect(res.status).toBe(200);
            expect(Post.parse(res.body).likedByMe).toBe(true);
        });

        it("returns 404 for a post that doesn't exist", async () => {
            const res = await request(app).get("/api/post/999999");
            expect(res.status).toBe(404);
            Error.parse(res.body);
        });
    });

    // the token is optional, a missing or bad one is treated as logged out
    describe("auth", () => {
        const expectLoggedOut = (res) => {
            expect(res.status).toBe(200);
            expect(Post.parse(res.body).likedByMe).toBe(false);
        };

        it("treats no token as logged out", async () => {
            expectLoggedOut(await request(app).get("/api/post/1"));
        });

        it.each(malformedHeaders())(
            "treats %s as logged out",
            async (_, header) => {
                const res = await request(app)
                    .get("/api/post/1")
                    .set("Authorization", header);
                expectLoggedOut(res);
            },
        );

        it("treats an expired token as logged out", async () => {
            const res = await request(app)
                .get("/api/post/1")
                .set("Authorization", bearer(expiredToken(users.dolorSit)));
            expectLoggedOut(res);
        });
    });

    describe("bad params", () => {
        it.each(badIds)("returns 400 for %s", async (_, id) => {
            expect400(await request(app).get(`/api/post/${id}`));
        });
    });
});

describe("POST /api/post", () => {
    const body = { title: "Jest post", content: "Created by a test" };

    describe("ideal", () => {
        it("creates the post for the logged in user", async () => {
            const res = await request(app)
                .post("/api/post")
                .set("Authorization", auth())
                .send(body);
            expect(res.status).toBe(201);
            const post = Post.parse(res.body);
            createdIds.push(post.id);
            expect(post).toMatchObject({
                ...body,
                username: users.test.username,
                likes: 0,
                likedByMe: false,
            });
        });

        it("trims the title and content", async () => {
            const res = await request(app)
                .post("/api/post")
                .set("Authorization", auth())
                .send({
                    title: "  Jest post  ",
                    content: "\n Created by a test \n",
                });
            expect(res.status).toBe(201);
            const post = Post.parse(res.body);
            createdIds.push(post.id);
            expect(post).toMatchObject(body);
        });

        it("shows up when fetched afterwards", async () => {
            const created = await request(app)
                .post("/api/post")
                .set("Authorization", auth())
                .send(body);
            const { id } = Post.parse(created.body);
            createdIds.push(id);
            const res = await request(app).get(`/api/post/${id}`);
            expect(res.status).toBe(200);
            expect(Post.parse(res.body)).toMatchObject(body);
        });
    });

    describe("auth", () => {
        it("returns 401 without a token", async () => {
            expect401(await request(app).post("/api/post").send(body));
        });

        it.each(malformedHeaders())("returns 401 for %s", async (_, header) => {
            expect401(
                await request(app)
                    .post("/api/post")
                    .set("Authorization", header)
                    .send(body),
            );
        });

        it("returns 401 for an expired token", async () => {
            expect401(
                await request(app)
                    .post("/api/post")
                    .set("Authorization", bearer(expiredToken()))
                    .send(body),
            );
        });

        it("checks the token before the body", async () => {
            expect401(await request(app).post("/api/post").send({}));
        });
    });

    describe("bad body", () => {
        it.each([
            ["an empty body", {}],
            ["a missing title", { content: "content" }],
            ["a missing content", { title: "title" }],
            ["a whitespace title", { title: "   ", content: "content" }],
            ["a whitespace content", { title: "title", content: "\n\t " }],
            ["a non-string title", { title: 123, content: "content" }],
            ["a non-string content", { title: "title", content: ["content"] }],
            ["a null title", { title: null, content: "content" }],
            [
                "a title over 100 characters",
                { title: "a".repeat(101), content: "content" },
            ],
            [
                "content over 500 characters",
                { title: "title", content: "a".repeat(501) },
            ],
        ])("returns 400 for %s", async (_, badBody) => {
            expect400(
                await request(app)
                    .post("/api/post")
                    .set("Authorization", auth())
                    .send(badBody),
            );
        });

        it("returns 400 for malformed json", async () => {
            const res = await request(app)
                .post("/api/post")
                .set("Authorization", auth())
                .set("Content-Type", "application/json")
                .send('{"title": "title",');
            expect400(res);
            expect(res.body.error).toBe("request body must be valid json");
        });
    });
});

// liking and unliking share the same middleware, so they're tested together
describe.each([
    ["POST", "post"],
    ["DELETE", "delete"],
])("%s /api/post/:id/like", (_, method) => {
    const send = (id, header) => {
        const req = request(app)[method](`/api/post/${id}/like`);
        return header ? req.set("Authorization", header) : req;
    };

    describe("auth", () => {
        it("returns 401 without a token", async () => {
            expect401(await send(3));
        });

        it.each(malformedHeaders())("returns 401 for %s", async (_, header) => {
            expect401(await send(3, header));
        });

        it("returns 401 for an expired token", async () => {
            expect401(await send(3, bearer(expiredToken())));
        });

        it("checks the token before the id", async () => {
            expect401(await send("abc"));
        });
    });

    describe("bad params", () => {
        it.each(badIds)("returns 400 for %s", async (_, id) => {
            expect400(await send(id, auth()));
        });

        it("returns 404 for a post that doesn't exist", async () => {
            const res = await send(999999, auth());
            expect(res.status).toBe(404);
            Error.parse(res.body);
        });
    });
});

describe("liking and unliking a post", () => {
    describe("ideal", () => {
        // runs in order: like, like again, unlike, unlike again
        let baseLikes;

        beforeAll(async () => {
            baseLikes = Post.parse(
                (await request(app).get("/api/post/3")).body,
            ).likes;
        });

        it("POST likes the post", async () => {
            const res = await request(app)
                .post("/api/post/3/like")
                .set("Authorization", auth());
            expect(res.status).toBe(200);
            expect(Post.parse(res.body)).toMatchObject({
                likes: baseLikes + 1,
                likedByMe: true,
            });
        });

        it("POST again doesn't add a second like", async () => {
            const res = await request(app)
                .post("/api/post/3/like")
                .set("Authorization", auth());
            expect(res.status).toBe(200);
            expect(Post.parse(res.body)).toMatchObject({
                likes: baseLikes + 1,
                likedByMe: true,
            });
        });

        it("DELETE removes the like", async () => {
            const res = await request(app)
                .delete("/api/post/3/like")
                .set("Authorization", auth());
            expect(res.status).toBe(200);
            expect(Post.parse(res.body)).toMatchObject({
                likes: baseLikes,
                likedByMe: false,
            });
        });

        it("DELETE again does nothing", async () => {
            const res = await request(app)
                .delete("/api/post/3/like")
                .set("Authorization", auth());
            expect(res.status).toBe(200);
            expect(Post.parse(res.body)).toMatchObject({
                likes: baseLikes,
                likedByMe: false,
            });
        });
    });
});
