const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://localhost:3000";

// TODO: Fill out proper E-2-E tests
test("Social Lite home page loads", async ({ request }) => {
    const response = await request.get(APP_URL);

    expect(response.status()).toBe(200);
});
