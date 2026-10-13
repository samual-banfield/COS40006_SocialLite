const request = require("supertest");
const app = require("../src/app");

describe("GET /api/health", () => {
    it("returns a status of 'ok'", async () => {
        const res = await request(app).get("/api/health");
        expect(res.status).toBe(200); //Check response status code
        expect(res.body).toEqual({ status: "ok" }); //Actual response check
    });
});
