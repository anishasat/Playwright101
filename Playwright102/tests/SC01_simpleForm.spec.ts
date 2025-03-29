import { test, expect, chromium } from '@playwright/test';

const playgroundUrl = "https://www.lambdatest.com/selenium-playground/";

// LambdaTest capabilities
const capabilities = {
    browserName: "Chrome",
    browserVersion: "128.0",
    "LT:Options": {
        platform: "Windows 10",
        build: "SC01_Simple_Form_Demo_Parameterized_Playwright_TS",
        name: "Scenario 01",
        user: "anishasingh1569",  // Your LambdaTest username
        accessKey: "LT_9jtTni3I3o43OrGorsEapf1OQC8aYjYTrCQMBrO4tK4zTv8",  // Your LambdaTest access key
        network: true,
        video: true,
        console: true,
        visual: true,
    },
};

test.describe('Validates simple form demo: ', async () => {
    // Browser OS combinations
    const browsers = [
        { bName: "pw-chromium", bVersion: "132.0", os: "Windows 10" },
        { bName: "pw-firefox", bVersion: "134.0", os: "Linux" }
    ];

    browsers.forEach(({ bName, bVersion, os }) => {
        test(`Scenario 1: Test simple form demo - ${bName} + ${bVersion} + ${os}`, async () => {
            // Update the capabilities
            capabilities.browserName = bName;
            capabilities.browserVersion = bVersion;
            capabilities['LT:Options'].platform = os;
            capabilities['LT:Options'].name = test.info().title;

            // ✅ Secure WebSocket Endpoint for LambdaTest
            const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
            
            // Connect to LambdaTest and launch the browser
            const browser = await chromium.connect(wsEndpoint);
            const context = await browser.newContext();
            const page = await context.newPage();

            // Navigate to Selenium Playground
            await page.goto(playgroundUrl);

            // Click simple form demo link
            await page.getByText('Simple Form Demo').click();

            // Get the URL
            const actualUrl = page.url();
            const expectedUrl = "simple-form-demo";

            // Assert the URL contains 'simple-form-demo'
            expect(actualUrl).toContain(expectedUrl);

            // Enter the message
            const message = "Welcome to LambdaTest.";
            await page.getByPlaceholder('Please enter your Message').fill(message);
            await page.waitForTimeout(1000);

            // Click on "Get Checked Value" button
            await page.click("#showInput");

            // Validate that the message is displayed
            const messageLocator = page.locator("#message");
            await expect(messageLocator, `Printed message is not same as "${message}"`).toHaveText(message);

            await page.close();
            await context.close();
            await browser.close();
        });
    });
});
