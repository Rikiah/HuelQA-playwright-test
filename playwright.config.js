// playwright.config.js
module.exports = {
  testDir: "./tests",
  timeout: 30000, // Allows up to 30 seconds per test (will change, if tests taking too long)
  use: {
    headless: false, // Set to false during debugging live sessions
    args: ["--start-maximized"],
    ignoreHTTPSErrors: true,
  },
  reporter: [["list"], ["html", { open: "never" }]],
};
