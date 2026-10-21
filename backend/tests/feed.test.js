const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");
const { Feed } = require("../src/schemas");
const {
    users,
    bearer,
    validToken,
    expiredToken,
    malformedHeaders,
} = require("./helpers");

afterAll(() => prisma.$disconnect());

describe("GET /api/feed", () => {
    describe("ideal", () => {
        it("returns every post, newest first", async () => {
            const res = await request(app).get("/api/feed");
            expect(res.status).toBe(200);
            const ids = Feed.parse(res.body).posts.map((p) => p.id);
            expect(ids.length).toBeGreaterThan(0);
            expect(ids).toEqual([...ids].sort((a, b) => b - a));
        });

        it("marks the posts the logged in user has liked", async () => {
            // dolor_sit likes post 1 in the seed data
            const res = await request(app)
                .get("/api/feed")
                .set("Authorization", bearer(validToken(users.dolorSit)));
            expect(res.status).toBe(200);
            const post = Feed.parse(res.body).posts.find((p) => p.id === 1);
            expect(post.likedByMe).toBe(true);
        });
    });

    // the token is optional, a missing or bad one is treated as logged out
    describe("auth", () => {
        const expectLoggedOut = (res) => {
            expect(res.status).toBe(200);
            expect(Feed.parse(res.body).posts.every((p) => !p.likedByMe)).toBe(
                true,
            );
        };

        it("treats no token as logged out", async () => {
            expectLoggedOut(await request(app).get("/api/feed"));
        });

        it.each(malformedHeaders())(
            "treats %s as logged out",
            async (_, header) => {
                const res = await request(app)
                    .get("/api/feed")
                    .set("Authorization", header);
                expectLoggedOut(res);
            },
        );

        it("treats an expired token as logged out", async () => {
            const res = await request(app)
                .get("/api/feed")
                .set("Authorization", bearer(expiredToken(users.dolorSit)));
            expectLoggedOut(res);
        });
    });
});
