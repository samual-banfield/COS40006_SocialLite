const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://localhost:5173";

// TODO: Fill out proper E-2-E tests
test("Social Lite home page loads", async ({ request }) => {
    const response = await request.get(APP_URL);

    expect(response.status()).toBe(200);
});


test("Login dialog opens when clicking Log in", async ({ page }) => {
    await page.goto(APP_URL);

    await page.getByRole("button", { name: "Log in" }).click();

    await expect(
        page.getByRole("heading", { name: "Log in" })
    ).toBeVisible();

    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
});


test("Login shows an error when fields are empty", async ({ page }) => {
    await page.goto(APP_URL);

    await page.getByRole("button", { name: "Log in" }).click();

    await page.getByRole("dialog")
        .getByRole("button", { name: "Log in" }).click();

    await expect(
        page.getByRole("alert")
    ).toHaveText("Enter your username and password to log in.");
});


test("User can close the login dialog", async ({ page }) => {
    await page.goto(APP_URL);

    await page.getByRole("button", { name: "Log in" }).click();

    const dialog = page.getByRole("dialog");

    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();

    await expect(dialog).not.toBeVisible();
});


test("Social Lite feed loads without errors", async ({ page }) => {
    await page.goto(APP_URL);

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
        `${APP_URL}/api/feed`
    );

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data.posts)).toBe(true);
});


test("User can register and log in", async ({ request, page }) => {
    const username = `e2euser_${Date.now()}`;
    const password = "TestPassword123!";

    // Register a new test account
    const signupResponse = await request.post(
        `${APP_URL}/api/auth/signup`,
        {
            data: { username, password },
        }
    );

    expect(signupResponse.status()).toBe(201);

    // Open Social Lite
    await page.goto(APP_URL);

    // Open the login dialog
    await page.getByRole("button", { name: "Log in" }).click();

    // Enter the registered account details
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Password").fill(password);

    // Submit the login form
    await page.getByRole("button", { name: "Log in" }).last().click();

    // Verify successful login
    await expect(
        page.getByRole("button", { name: "Log out" })
    ).toBeVisible();
});


test("User can register, log in and create a post", async ({ request, page }) => {
    const username = `e2euser_${Date.now()}`;
    const password = "TestPassword123!";
    const postTitle = `E2E Test Post ${Date.now()}`;
    const postContent = "This post was created during a Playwright end-to-end test.";

    // Step 1: Register a new test account
    const signupResponse = await request.post(
        `${APP_URL}/api/auth/signup`,
        {
            data: { username, password },
        }
    );

    expect(signupResponse.status()).toBe(201);

    // Step 2: Open Social Lite
    await page.goto(APP_URL);

    // Step 3: Log in through the browser
    await page.getByRole("button", { name: "Log in" }).click();

    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Password").fill(password);

    await page.getByRole("button", { name: "Log in" }).last().click();

    // Step 4: Verify successful login
    await expect(
        page.getByRole("button", { name: "Log out" })
    ).toBeVisible();

    // Step 5: Open the New post dialog
    await page.getByRole("button", { name: "New post" }).click();

    const composeDialog = page.getByRole("dialog", { name: "New post" });

    await expect(composeDialog).toBeVisible();

    // Step 6: Fill in the post details
    await composeDialog.getByLabel("Title").fill(postTitle);
    await composeDialog.getByLabel("Your post").fill(postContent);

    // Step 7: Submit the post
    await composeDialog.getByRole("button", { name: "Post", exact: true }).click();

    // Step 8: Verify the dialog closes
    await expect(composeDialog).not.toBeVisible();

   // Step 9: Verify the new post appears in the feed
await expect(
    page.getByText(postTitle, { exact: true })
).toBeVisible();

await expect(
    page.locator(".post-excerpt").filter({ hasText: postContent }).first()
).toBeVisible();
});


test("User can create, like and unlike a post", async ({ page, request }) => {
    const username = `e2e_like_${Date.now()}`;
    const password = "TestPassword123!";
    const title = `Like test ${Date.now()}`;
    const content = "Testing the complete like and unlike workflow.";

    // Step 1: Register a new user through the backend.
    const signup = await request.post(
        `${APP_URL}/api/auth/signup`,
        {
            data: { username, password },
        }
    );
    expect(signup.status()).toBe(201);

    // Step 2: Open Social Lite and log in.
    await page.goto(APP_URL);

    await page.getByRole("button", { name: "Log in" }).click();

    await page.locator("#login-username").fill(username);
    await page.locator("#login-password").fill(password);

    await page.locator(".login-submit").click();

    await expect(
        page.getByRole("button", { name: "New post" })
    ).toBeVisible();

    // Step 3: Create a new post.
    await page.getByRole("button", { name: "New post" }).click();

    await page.locator("#compose-post-title").fill(title);
    await page.locator("#compose-post-content").fill(content);

    await page.locator(".compose-submit").click();

    // Step 4: Open the newly created post.
    await expect(page.getByText(title, { exact: true })).toBeVisible();
    await page.getByText(title, { exact: true }).click();

    await expect(
        page.getByRole("button", { name: "Back to feed" })
    ).toBeVisible();

    // Step 5: Like the post.
    const likeButton = page.locator(".post-view-actions .post-like");

    await expect(likeButton).toHaveAttribute("aria-pressed", "false");

    await likeButton.click();

    await expect(likeButton).toHaveAttribute("aria-pressed", "true");
    await expect(likeButton).toContainText("Liked");

    // Step 6: Unlike the post.
    await likeButton.click();

    await expect(likeButton).toHaveAttribute("aria-pressed", "false");
    await expect(likeButton).toContainText("Like");
});
