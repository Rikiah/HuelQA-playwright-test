# 🧪 Huel Tech Test

**Task:** Use Playwright to test the user experience and functionality of the Huel site by visiting the site, adding two different items to the basket, and verifying their presence.

---

## 🔍 Approach

### 🔎 Exploration

Visited the Huel site to understand layout and interactions. Took notes on how elements responded to user actions.

### 🧭 Planning

Mapped out a user flow from browsing to checkout, simulating a customer journey.

### 💻 Execution

Used Playwright (JavaScript) in VS Code. Broke down interactions into realistic user behaviors and wrote test cases step-by-step.

---

## ⚠️ Challenges

- **Test Fragility:** Stability issues as complexity increased. Repetitive interactions and unexpected DOM changes caused failures.
- **Selector Frustration:** Many elements lacked stable IDs or attributes. Relied heavily on codegen and trial/error to find working selectors.
- **Locator Rework:** Refactored locators frequently due to dynamic structure. Realized that attributes like `alt` text could’ve been more efficient.
- **Complex Site Structure:** The UX simplicity hides complexity in the DOM. Absence of a search bar made navigation trickier during testing.
- **Error Handling:** Basic error logic was added for one product; failed to replicate consistently for another due to modal inconsistencies.
- **Parallel Tests Confusion:** Initially didn’t realize each test ran in its own browser instance. Adjusted structure with proper Playwright hooks.
- **Verifying Quantities:** Initially checked the DOM, but later realized checking for CSS changes would’ve been more reliable.

---

## 📘 Lessons Learned

- **Playwright Proficiency:** Learned to work with Playwright's built-in modal/popup handling, selectors, and navigation controls.
- **DOM Navigation:** Became more confident using `nth`, text selectors, and chained locators to deal with dynamic content.
- **Hooks & Structure:** Learned to isolate tests using `beforeAll`, `beforeEach`, and `afterAll` effectively to avoid side effects.
- **Modal Management:** Gained patience with cookie banners, pop-ups, and overlays. Learned to prioritize them early in flows.
- **Efficient Scrolling & Waiting:** Used wait conditions with scroll actions to handle lazy-loaded content and modal visibility properly.

---

## 🛠 Opportunities for Improvement

- Refactor repeated logic into helper functions (e.g. cookie modals, promos, error handling).
- Use more semantic locators (e.g. `alt`, ARIA labels) for clarity and stability.
- Improve error handling with fallback logic and cleaner failure messages.
- Use visual/CSS-based cues for state changes instead of DOM value reads.

---

## 🧭 User Flow v2.0

**Goal:** Simulate a real user visiting Huel UK, adding _Black Edition Chocolate_ and _Daily Greens Original_ to basket, and verifying contents at checkout.

---

### ✅ 1. Homepage & Cookies

- Visit `https://uk.huel.com/`
- Wait for and click the **Accept Cookies** button

---

### ✅ 2. Dismiss Promo Modal

- Scroll to trigger promo modal
- Close the “£10 off” dialog (located via `.nth(2)`)

---

### ✅ 3. Navigate to Shop

- Click **Shop Huel**
- Wait for `/collections/other-huel-products` to load
- Assert correct URL

---

### ✅ 4. Add Black Edition Chocolate

- Locate the product (excluding ready-to-drink versions)
- Click **Add to Basket** if enabled
- Wait for flavour modal
- Select **Chocolate**
- Increase quantity by 1
- Confirm with **Add to Basket | £**
- Basket modal appears → Click **Continue Shopping**

#### ⚠ Error Handling

Logs & skips if:

- Product not found
- Button disabled
- Flavour missing
- Out of stock

---

### ✅ 5. Add Daily Greens Original

- Locate the card
- Scroll into view
- Click **Add to Basket**
- Confirm **Original** flavour in modal
- Increase quantity
- Confirm with **Add to Basket | £**
- Proceed with **Checkout Securely**

---

### ✅ 6. Checkout Validation

- Wait for checkout page
- Confirm both products are listed
- Inspect parent rows for quantity
- **Log:**
  - Product names
  - Quantities
  - Total items in basket

---

## 📋 Final Assertions

- ✅ Modals handled correctly
- ✅ Accurate navigation
- ✅ Two specific products found and added
- ✅ Quantities correctly reflected
- ✅ Checkout shows correct basket contents

---

## 🚧 Error Handling Recap

- Skips or logs detailed messages if:
  - Products are out of stock
  - Flavour is missing
  - Add buttons are disabled

---

## 🏁 Final Outcome

✅ A user can:

- Accept cookies
- Close promotional modals
- Navigate using **Shop Huel**
- Add Black Edition Chocolate & Daily Greens Original
- Proceed to checkout
- Confirm product names and quantities are accurate
