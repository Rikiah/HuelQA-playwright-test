import { test, expect, chromium } from "@playwright/test";

test.describe("Visit homepage, accept cookies and check hompeage has loaded and products", () => {
  let browser, context, page;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://uk.huel.com");
    await page.waitForURL("https://uk.huel.com/");

    // Handle the cookie consent banner if it appears
    const acceptCookiesButton = page.getByRole("button", {
      name: "Accept all cookies",
    });
    if (await acceptCookiesButton.isVisible()) {
      await acceptCookiesButton.click();
    }

    // Handle the promo deal banner if it appears

    const closePromoDeal = page.getByRole("button", { name: "Close" });
    if (await closePromoDeal.isVisible()) {
      await closePromoDeal.click();
    }
  });

  test.afterAll(async () => {
    await context.close();
    await browser.close();
  });

  test("Add Mint Chocolate and verify quantity is 1", async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://uk.huel.com/products/huel");
    await page.waitForURL(/products\/huel/);

    // Click the increase button for Mint Chocolate
    const increaseButton = page.getByRole("button", {
      name: /Increase the quantity of Mint Chocolate by 1/,
    });
    await expect(increaseButton).toBeVisible();
    await increaseButton.click();

    // Locate the input field for Mint Chocolate quantity
    const quantityInput = page.locator(
      'input[aria-label^="Update the quantity of Mint Chocolate"]'
    );
    await expect(quantityInput).toBeVisible();

    // Assert that the value is '1'
    const value = await quantityInput.inputValue();
    expect(value).toBe("1");
  });

  test("Add Complete nutritional bar and verify quantity is 1", async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://uk.huel.com/products/huel-bar");
    await page.waitForURL(/products\/huel-bar/);

    // Click the increase button for Chocolate Chip Cookie Dough
    const increaseButton = page.getByRole("button", {
      name: /Increase the quantity of Chocolate Chip Cookie Dough by 1/,
    });
    await expect(increaseButton).toBeVisible();
    await increaseButton.click();

    // Locate the input field for Chocolate Chip Cookie Dough
    const quantityInput = page.locator(
      'input[aria-label^="Update the quantity of Chocolate Chip Cookie Dough"]'
    );
    await expect(quantityInput).toBeVisible();

    // Assert that the value is '1'
    const value = await quantityInput.inputValue();
    expect(value).toBe("1");
  });
});
