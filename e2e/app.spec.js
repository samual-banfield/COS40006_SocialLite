const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://localhost:5173";

// TODO: Fill out proper E-2-E tests
test("Social Lite home page loads", async ({ request }) => {
    const response = await request.get(APP_URL);

    expect(response.status()).toBe(200);
});


test("Login dialog opens when clicking Log in", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "Log in" }).click();

    await expect(
        page.getByRole("heading", { name: "Log in" })
    ).toBeVisible();

    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
});


test("Login shows an error when fields are empty", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "Log in" }).click();

    await page.getByRole("dialog")
        .getByRole("button", { name: "Log in" }).click();

    await expect(
        page.getByRole("alert")
    ).toHaveText("Enter your username and password to log in.");
});


test("User can close the login dialog", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("button", { name: "Log in" }).click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();

    await expect(dialog).not.toBeVisible();
});


test("Social Lite feed loads without errors", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await expect(
        page.getByRole("button", { name: "Log in" })
    ).toBeVisible();

    await expect(
        page.locator(".main")
    ).toBeVisible();

    await expect(
        page.locator(".main").getByText("Failed to fetch")
    ).not.toBeVisible();
});


test("Social Lite feed API responds successfully", async ({ request }) => {
    const response = await request.get(
        "http://localhost:5173/api/feed"
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.posts)).toBe(true);
});
