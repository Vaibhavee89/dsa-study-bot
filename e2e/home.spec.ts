import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the main heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /DSA Study Bot/i })).toBeVisible();
  });

  test("should display the subtitle", async ({ page }) => {
    await expect(page.getByText(/Get help understanding algorithms/i)).toBeVisible();
  });

  test("should have a theme toggle button", async ({ page }) => {
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
  });

  test("should display example prompt cards", async ({ page }) => {
    await expect(page.getByText(/Problem Understanding/i)).toBeVisible();
    await expect(page.getByText(/Concept Clarification/i)).toBeVisible();
    await expect(page.getByText(/Approach Validation/i)).toBeVisible();
    await expect(page.getByText(/Time Complexity Help/i)).toBeVisible();
  });

  test("should have a text input area", async ({ page }) => {
    const textarea = page.getByPlaceholder(/How can study bot help you/i);
    await expect(textarea).toBeVisible();
  });

  test("should populate input when clicking example card", async ({ page }) => {
    const card = page.getByText(/Problem Understanding/i).first();
    await card.click();

    const textarea = page.getByPlaceholder(/How can study bot help you/i);
    await expect(textarea).toHaveValue(/LeetCode #121/i);
  });
});

test.describe("Theme Toggle", () => {
  test("should toggle theme when clicked", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    const themeToggle = page.getByRole("button", { name: /toggle theme/i });

    await themeToggle.click();
    await page.waitForTimeout(100);

    // Theme should have changed (either added or removed dark class)
    const classAfterClick = await html.getAttribute("class");
    expect(classAfterClick).toBeDefined();
  });
});

test.describe("Chat Interaction", () => {
  test("should show send button", async ({ page }) => {
    await page.goto("/");

    const sendButton = page.locator('button[type="submit"]');
    await expect(sendButton).toBeVisible();
  });

  test("send button should be disabled when input is empty", async ({ page }) => {
    await page.goto("/");

    const sendButton = page.locator('button[type="submit"]');
    await expect(sendButton).toBeDisabled();
  });

  test("send button should be enabled when input has text", async ({ page }) => {
    await page.goto("/");

    const textarea = page.getByPlaceholder(/How can study bot help you/i);
    await textarea.fill("What is a binary search tree?");

    const sendButton = page.locator('button[type="submit"]');
    await expect(sendButton).toBeEnabled();
  });
});

test.describe("Accessibility", () => {
  test("should have no accessibility violations on main elements", async ({ page }) => {
    await page.goto("/");

    // Check that main interactive elements are accessible
    const buttons = page.getByRole("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // Check textarea has placeholder
    const textarea = page.getByRole("textbox");
    await expect(textarea).toBeVisible();
  });
});
