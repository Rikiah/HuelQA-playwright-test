Huel Tech Test
Task
To use Playwright to test the user experience and functionality of the Huel site, by visiting the site, adding two different items to the basket, and verifying their presence.

Approach
Exploration: I started by visiting the Huel website to familiarize myself with its layout and functionality. I noted how elements behaved when actions were triggered and got a feel for the site's design.

Planning: Based on my manual navigation through the site, I created a user flow that mapped out each step required to simulate a customer journey from browsing to checkout.

Execution: I used Playwright with JavaScript in Visual Studio Code, writing tests based on my user flow. I tackled elements one step at a time and broke down interactions to match how a real user might behave.

Challenges
Brittleness of tests: As the tests became more complex, I encountered stability issues with repeated interactions and unpredictable DOM changes.

Locating elements: Many elements didn’t have reliable selectors like IDs or consistent attributes, which made locating them a manual, trial-and-error process.

Repetitive locator setup: One of the biggest frustrations was having to repeatedly run codegen and inspect the DOM to figure out which selectors actually worked. Often, I had to refactor locators or rewrite large sections of test code. In hindsight, using attributes like alt text on images might have been a cleaner, more reliable option in some cases.

Site structure complexity: Huel’s website is built to be seamless for users, which is great from a UX perspective — but it hides a lot of its structural elements. For someone unfamiliar with its codebase, the layout and element organization were hard to decipher. The lack of a search bar also limited how quickly I could navigate during testing.

Error handling: I implemented basic error handling for one product but couldn’t get it working correctly for the second due to inconsistent behavior across modals and product options.

Parallel test execution issues: Playwright runs tests in parallel by default in isolated browser contexts. Initially, this caused issues for me as I didn’t realize each test spun up its own browser instance. I adapted my test structure to make better use of Playwright’s hooks and isolate side effects properly.

Verifying quantity changes: I initially tried to read the DOM for signs of quantity changes in the basket, but a better approach would have been checking for subtle CSS changes, such as class additions or updated styles, to confirm changes visually reflected the correct state.

Lessons Learned
Playwright fundamentals: I gained a strong understanding of Playwright’s capabilities and realized how powerful it is when dealing with real-world front-end testing. The official documentation was up to date and incredibly useful — especially for handling modals and pop-ups, which turned out to be easier than I expected thanks to built-in support for common patterns.

DOM structure awareness: I improved at inspecting and understanding complex DOM structures. Even when elements were deeply nested or dynamically generated, I learned to use tools like nth, text selectors, and chained locators effectively.

Hooks and test structure: I learned how to correctly use beforeAll, beforeEach, and afterAll hooks to manage state between tests. This prevented interference and made my tests more reliable when executed concurrently.

Patience with modals and overlays: I got better at handling cookie banners, pop-ups, and dynamic overlays that could interrupt flows — and recognized the importance of handling these elements first before moving on to key user interactions.

Efficient scrolling and waiting: I practiced combining scrolling actions with wait conditions to ensure lazy-loaded content appeared before continuing the test. This was especially important for product pages and modal dialogs that were not visible on initial page load.

Opportunities for Improvement
Refactor repetitive logic into helper functions, especially for cookie banners, promotional modals, and error handling.

Reconsider locator strategies using more semantic or visual cues like alt attributes or ARIA labels to improve clarity and test resilience.

Add better error handling throughout, including fallback logic or clearer test failure outputs when elements aren’t found.

Explore CSS-based indicators for things like quantity changes or visual state toggles, which are often easier to test than DOM-based counters.

Final Thoughts
This task was a great exercise in understanding the balance between automation and real-world UX. Huel’s website is clearly built to reduce friction for the user, but that same simplicity adds complexity for automation testing. Having to adapt my thinking, learn from test failures, and explore Playwright’s documentation in depth helped me improve a lot.

User Flow V2.0

Purpose - To verify that a user can navigate the Huel UK website, handle cookies and promos modals, and successfully add two specific products of choice (Black Edition Chocolate and Daily Greens Original) to the basket and proceed to checkout. Verify quantity of products in the basket and log to console the contents.

1. Visit homepage and accept cookies
2. Dismiss promotional banner
3. Navigate to product listing via "Shop Huel" Button
4. Add "Black Edition Chocolate" to basket (with error handling)
5. Add "Daily Greens Original" to basket
6. Proceed to checkout
7. Confirm both products and quantities appear at checkout

✅1. Visit Homepage & Accept Cookies
• Go to https://uk.huel.com/
• Wait for the cookie dialog
• Click the "Accept" button

✅ 2. Dismiss Promo Modal
• Scroll the page to trigger promo modal
• Look for the "Get £10 off your first" dialog (filtered via .nth(2))
• Click the "Close" button

✅ 3. Navigate via “Shop Huel” Link
• Click on the Shop Huel link
• Wait for navigation to /collections/other-huel-products
• Assert the URL is correct

✅ 4. Add Black Edition (Chocolate) to Basket
• Locate the Black Edition card (excluding Ready-to-drink)
• Click Add to Basket button if it's enabled
• Wait for the flavour modal
• Ensure "Chocolate" is listed
• Click button to increase quantity of Chocolate by 1
• Click final Add to basket | £ button
• Confirm that the "Your Basket" modal appears
• Click Continue Shopping to dismiss the basket

This part of the User Flow was changed at the end to be improved upon, error handling was done after we got the basic tests to pass.

⚠️ Includes multiple fallback skips and logs if:
• Product card not found
• Add to basket button is disabled
• Flavour not available
• Final add fails due to stock issues

✅ 5. Add Daily Greens (Original) to Basket
• Locate the Daily Greens product card
• Scroll into view if needed
• Click Add to Basket
• Confirm modal has "Original" flavour
• Increase quantity by 1
• Click Add to basket | £ to confirm
• Ensure basket modal appears
• Click Checkout Securely

✅ 6. Checkout Page Validations
• Wait for page to load
• Look for Black Edition Chocolate in a table cell
• Look for Daily Greens Original in a table cell
• Get the parent row of each to inspect quantities
• Extract and print:
o Product name
o Quantity of each
o Total quantity in basket

📋 Assertions & Validations
• ✅ Modal popups are handled gracefully
• ✅ Navigation is correct
• ✅ Both products are found and added
• ✅ Quantities are incremented
• ✅ Checkout page reflects the correct basket state

🚧 Error Handling
• Skips specific tests if:
o Products are out of stock
o Flavour isn’t found or selectable
o Buttons are disabled
• Logs out detailed messages when failures or skips happen

✅ Final Outcome
A user can:
• Accept cookies and close modals
• Navigate via "Shop Huel"
• Add Black Edition Chocolate and Daily Greens Original to the basket
• Proceed to checkout and see accurate product names and quantities
