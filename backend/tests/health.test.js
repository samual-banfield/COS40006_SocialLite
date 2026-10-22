const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
    describe("ideal", () => {
        it("returns a status of 'ok'", async () => {
            const res = await request(app).get("/api/health");
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ status: "ok" });
        });
    });
});
