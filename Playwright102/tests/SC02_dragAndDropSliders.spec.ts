import { test, expect, chromium } from '@playwright/test';

const playgroundUrl = "https://www.lambdatest.com/selenium-playground/";

// LambdaTest capabilities
const capabilities = {
    browserName: "Chrome",
    browserVersion: "128.0",
    "LT:Options": {
        platform: "Windows 10",
        build: "SC02_Drag_And_Drop_Slider_Parameterized_Playwright_TS",
        name: "Scenario 02",
        user: "anishasingh1569",
        accessKey: "LT_9jtTni3I3o43OrGorsEapf1OQC8aYjYTrCQMBrO4tK4zTv8",
        network: true,
        video: true,
        console: true,
        visual: true,
    },
};

test.describe('Drag and drop sliders: ', async () => {
    // Browser OS combinations
    const browsers = [
        { bName: "pw-chromium", bVersion: "132.0", os: "Windows 10" },
        { bName: "pw-firefox", bVersion: "134.0", os: "Linux" }
    ];

    browsers.forEach(({ bName, bVersion, os }) => {
        test(`Scenario 2: Drag and drop sliders - ${bName} + ${bVersion} + ${os}`, async () => {
            // Update the capabilities
            capabilities.browserName = bName;
            capabilities.browserVersion = bVersion;
            capabilities['LT:Options'].platform = os;
            capabilities['LT:Options'].name = test.info().title;
            
            // Connect to lambdatest and launch the browser
            const browser = await chromium.connect(`wss://cdp.lambdatest.com/playwright?capabilities=
            ${encodeURIComponent(JSON.stringify(capabilities))}`);
            const context = await browser.newContext();
            const page = await context.newPage();

            // Navigate to Selenium Playground
            await page.goto(playgroundUrl);

            // Click the "Drag & Drop Sliders" link
            await page.getByText('Drag & Drop Sliders').click();

            await page.waitForTimeout(5000);
            // Locate the slider element “Default value 15”
            const slider3 = page.locator('#slider3 input');

            await page.waitForTimeout(2000);
            // Drag the slider to the right by simulating the drag-and-drop action to make it 95
            const boundingBox = await slider3.boundingBox();
            if (boundingBox) {
                const sliderX = boundingBox.x + boundingBox.width / 2; // Center of the slider
                const sliderY = boundingBox.y + boundingBox.height / 2;

                // Drag from the center of the slider 215 pixels to the right
                await page.mouse.move(sliderX, sliderY);
                await page.mouse.down();
                await page.mouse.move(sliderX + 215, sliderY, { steps: 10 });
                await page.mouse.up();
            }

            await page.waitForTimeout(10000);
            // Assert range value shows 95
            const actualRangeLocator = page.locator("#rangeSuccess");
            const expectedRange = "95";
            await expect(actualRangeLocator, `Actual range is not "${expectedRange}"`).toHaveText(expectedRange);

            await page.close();
            await context.close();
            await browser.close();
        });
    });
});