const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");

// these run against the seeded database, see prisma/seed.js
afterAll(() => prisma.$disconnect());

// TODO: Generate more post tests

describe("GET /api/post/:id", () => {
    it("returns the post for a valid id", async () => {
        const res = await request(app).get("/api/post/1");
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(res.body.content).toEqual(
            "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        );
    });
    it("returns 400 for a non-numeric id", async () => {
        const res = await request(app).get("/api/post/abc");
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});
