const request = require("supertest");
const app = require("../src/app");

// TODO: Generate more post tests

describe("GET /api/post/:id", () => {
    it("returns the post for a valid id", async () => {
        const res = await request(app).get("/api/post/7");
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(7);
        expect(res.body.content).toEqual("post content");
    });
    it("returns 400 for a non-numeric id", async () => {
        const res = await request(app).get("/api/post/abc");
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
});
