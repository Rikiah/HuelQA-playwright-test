const { test, expect, chromium } = require("@playwright/test");

let browser;
let context;
let page;

test.describe.serial("Huel e2e shopping flow", () => {
  test.beforeAll(async () => {
    // Launch a Chromium browser before all tests
    browser = await chromium.launch({ headless: true }); // Only set this to false for when debugging.
    context = await browser.newContext();
    page = await context.newPage(); // Create a new page context to maintain session across tests
  });

  test("Visit homepage and accept cookies pop up on visiting", async () => {
    // Navigate to Huel homepage
    await page.goto("https://uk.huel.com/");

    // Wait for cookie/privacy modal to appear and interact with it
    await expect(page.getByRole("dialog", { name: "Privacy" })).toBeVisible();
    await page.getByRole("button", { name: "Accept" }).click(); // Accept cookies to prevent modal from interfering later
  });

  test("Close promo banner that appears on landing page or after a product has been added", async () => {
    // Scroll down to trigger the appearance of the promo banner
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));

    // Locate the promo banner (it's one of multiple similar elements, so had to filter it down)
    const promo = page
      .getByRole("dialog")
      .locator("div")
      .filter({ hasText: "Get £10 off your first" })
      .nth(2); // nth(2) used due to duplicate dialogs in DOM

    // Confirm the promo is visible before interacting
    await expect(promo).toBeVisible();

    // Close the promo modal to avoid test interference
    await page.getByRole("button", { name: "Close" }).click();
  });

  test("Navigate to Shop All Button on Homepage", async () => {
    // Locate the main Shop Huel link on homepage
    const shopHuelLink = page.getByRole("link", { name: "Shop Huel" }).first();
    await expect(shopHuelLink).toBeVisible();

    // Wait for navigation to happen after click
    await Promise.all([
      page.waitForNavigation({
        url: /\/collections\/other-huel-products/,
        timeout: 10000,
      }),
      shopHuelLink.click(), // Triggers navigation
    ]);

    // Confirm that we’ve landed on the expected URL
    await expect(page).toHaveURL(/\/collections\/other-huel-products/);
  });

  // Refactored in order to contain error handling if an item is out of stock or not found.
  test("Add Black Edition to basket with flavour availability check", async () => {
    // Locate the specific product card for Black Edition (filter avoids Ready-to-drink variants)
    const blackEditionCard = page
      .locator(".ProductCollectionCard_ProductCollectionCard__lSaLO")
      .filter({ hasText: "Black Edition" })
      .filter({ hasNotText: "Ready-to-drink" });

    await expect(blackEditionCard).toBeVisible({ timeout: 10000 });

    // Find the "Add to basket" button inside this card
    const addToBasketBtn = blackEditionCard.getByRole("button", {
      name: "Add to basket",
    });

    // Check if the product can be added
    if (await addToBasketBtn.isEnabled()) {
      await addToBasketBtn.click();
    } else {
      // Skip the test if unavailable to avoid false failures
      console.warn("Add to Basket button not available possibly out of stock.");
      test.skip("Black Edition not available to add.");
      return;
    }

    // Wait for the flavour selection dialog to appear
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Chocolate"); // Checking for default flavour

    // Try increasing the quantity of the "Chocolate" flavour
    const increaseBtn = page.getByRole("button", {
      name: /Increase the quantity of Chocolate by 1/,
    });

    if (await increaseBtn.isVisible()) {
      await increaseBtn.click(); // Add an extra unit
    } else {
      console.warn("Chocolate flavour not available to add.");
      test.skip("Chocolate flavour is currently out of stock.");
      return;
    }

    // Final step: confirm adding to basket
    const finalAddBtn = page.getByRole("button", {
      name: /Add to basket \| £/,
    });

    if (await finalAddBtn.isEnabled()) {
      await finalAddBtn.click();
    } else {
      console.warn("Final Add to Basket button disabled can't add to cart.");
      test.skip("Unable to add Black Edition to basket due to stock issue.");
      return;
    }

    // Verify that the item was added by checking for basket confirmation
    await expect(
      page.locator("div").filter({ hasText: "Your Basket" }).nth(2)
    ).toBeVisible();

    // Close the basket dialog to continue shopping
    await page.getByRole("button", { name: "Continue Shopping" }).click();
  });

  test("Add Daily Greens to basket", async () => {
    // Locates the 2nd product to be added to the basket
    const dailyGreensCard = page
      .locator(".ProductCollectionCard_ProductCollectionCard__lSaLO")
      .filter({ hasText: "Daily Greens" })
      .first(); // Select the first product card with "Daily Greens" had to add due to not being able to locate

    // Scroll the Daily Greens card into view test wouldn't move
    await dailyGreensCard.scrollIntoViewIfNeeded({ timeout: 15000 });

    // Ensure the Daily Greens card is visible
    await expect(dailyGreensCard).toBeVisible({ timeout: 15000 });

    // Locate the "Add to basket" button within this specific card
    const addToBasketBtn = dailyGreensCard.locator(
      'button:has-text("Add to basket")'
    );

    await expect(addToBasketBtn).toBeVisible({ timeout: 15000 });

    // Click the button to add the item
    await addToBasketBtn.click();

    // Check that the default flavour selection dialog appears
    await expect(page.getByRole("dialog")).toContainText("Original");

    // Increase quantity of "Original" flavour
    await page
      .getByRole("button", { name: /Increase the quantity of Original by 1/ })
      .click();

    // Confirm final addition to basket
    await page.getByRole("button", { name: /Add to basket \| £/ }).click();

    // Verify item has been added to the basket
    await expect(
      page.locator("div").filter({ hasText: "Your Basket" }).nth(2)
    ).toBeVisible();

    // Wait for the "Checkout Securely" button to be visible
    const checkoutBtn = page.getByTestId("cart-checkout-button");
    await expect(checkoutBtn).toBeVisible({ timeout: 15000 });

    // Proceed to checkout page
    await checkoutBtn.click();

    // Wait for navigation to complete (used destructuring in case of future needs)
    const [newPage] = await Promise.all([
      page.waitForNavigation({ timeout: 15000 }),
    ]);
  });

  test("Confirm both products are listed in checkout", async () => {
    // Locate product names on the checkout page
    const product1 = page.getByRole("cell", {
      name: "Black Edition Chocolate",
    });
    const product2 = page.getByRole("cell", { name: "Daily Greens Original" });

    await expect(product1).toBeVisible();
    await expect(product2).toBeVisible();

    // Navigate up to the product rows so we can inspect quantities
    const product1Row = await product1.locator("..");
    const product2Row = await product2.locator("..");

    // Locate quantity elements — matches any number
    const quantity1 = await product1Row.locator("text=/\\d+/").first();
    const quantity2 = await product2Row.locator("text=/\\d+/").first();

    await expect(quantity1).toBeVisible();
    await expect(quantity2).toBeVisible();

    // Extract text values to log out results
    const product1Text = await product1.innerText();
    const product2Text = await product2.innerText();
    const quantity1Text = await quantity1.innerText();
    const quantity2Text = await quantity2.innerText();

    // Convert quantities to integers for calculation
    const quantity1Number = parseInt(quantity1Text, 10);
    const quantity2Number = parseInt(quantity2Text, 10);

    const totalQuantity = quantity1Number + quantity2Number;

    // Log full basket breakdown — helpful during debugging or reviewing CI logs
    console.log("Basket Contents:");
    console.log(`${product1Text}: ${quantity1Number}`);
    console.log(`${product2Text}: ${quantity2Number}`);
    console.log(`Total number of items in basket: ${totalQuantity}`);
  });

  test.afterAll(async () => {
    // Close browser context and the browser itself
    await context.close();
    await browser.close();
  });
});
