const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/db");

afterAll(async () => {
    await prisma.$disconnect();
});

describe("GET /api/health", () => {
    describe("ideal", () => {
        it("returns a status of 'ok'", async () => {
            const res = await request(app).get("/api/health");
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ status: "ok" });
        });
    });

    describe("database down", () => {
        it("returns 503 when the database can't be queried", async () => {
            const spy = jest
                .spyOn(prisma, "$queryRaw")
                .mockRejectedValueOnce(new Error("connection refused"));
            jest.spyOn(console, "error").mockImplementationOnce(() => {});

            const res = await request(app).get("/api/health");
            expect(res.status).toBe(503);
            expect(res.body).toMatchObject({ status: "database unreachable" });
            spy.mockRestore();
        });
    });
});
