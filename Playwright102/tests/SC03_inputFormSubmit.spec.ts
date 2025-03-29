import { test, expect, chromium } from '@playwright/test';

const playgroundUrl = "https://www.lambdatest.com/selenium-playground/";

// LambdaTest capabilities
const capabilities = {
    browserName: "Chrome",
    browserVersion: "128.0",
    "LT:Options": {
        platform: "Windows 10",
        build: "SC03_Submit_Input_Form_Parameterized_Playwright_TS",
        name: "Scenario 03",
        user: "anishasingh1569",
        accessKey: "LT_9jtTni3I3o43OrGorsEapf1OQC8aYjYTrCQMBrO4tK4zTv8",
        network: true,
        video: true,
        console: true,
        visual: true,
    },
};

test.describe('Submit form input:', async () => {
    // Browser OS combinations
    const browsers = [
        { bName: "pw-chromium", bVersion: "132.0", os: "Windows 10" },
        { bName: "pw-firefox", bVersion: "134.0", os: "Linux" }
    ];

    browsers.forEach(({ bName, bVersion, os }) => {
        test(`Scenario 3: Submit form input - ${bName} + ${bVersion} + ${os}`, async () => {
            // Update the capabilities
            capabilities.browserName = bName;
            capabilities.browserVersion = bVersion;
            capabilities['LT:Options'].platform = os;
            capabilities['LT:Options'].name = test.info().title;

            // ✅ Correct WebSocket Endpoint for LambdaTest
            const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;

            // Connect to LambdaTest and launch the browser
            const browser = await chromium.connect(wsEndpoint);
            const context = await browser.newContext();
            const page = await context.newPage();

            // Navigate to Selenium Playground
            await page.goto(playgroundUrl);

            // Click the "Input Form Submit" link 
            await page.getByText('Input Form Submit').click();

            // Click the "Submit" button without filling any field
            await page.click("//button[@type='submit' and text()='Submit']");

            // Locate the name field
            const nameField = page.locator("#name");

            // Retrieve the validation message
            const validationMessage = await nameField.evaluate((el: HTMLInputElement) => el.validationMessage);
            const expectedErrorMessage = "Please fill out this field.";

            // Assert validation message for the name field
            expect(validationMessage, `Wrong error message "${validationMessage}"`).toEqual(expectedErrorMessage);

            // Fill out the form
            await nameField.fill("TestName");
            await page.locator("#inputEmail4").fill("Test789@gmail.com");
            await page.locator("input[name='password']").fill("Test@6789");
            await page.locator("#company").fill("TestCompany");
            await page.locator("#websitename").fill("Testdomain.com");

            // Select "United States" from the country dropdown
            await page.selectOption("select[name='country']", { label: "United States" });

            await page.locator("#inputCity").fill("TestCity");
            await page.locator("#inputAddress1").fill("TestAddress1");
            await page.locator("#inputAddress2").fill("TestAddress2");
            await page.locator("#inputState").fill("TestState");
            await page.locator("#inputZip").fill("360000");

            // Submit the form
            await page.locator("//button[@type='submit' and text()='Submit']").click();
            await page.waitForTimeout(1000);

            // Validate the success message
            const successMessage = await page.locator(".success-msg").textContent();
            const expectedMessage = "Thanks for contacting us, we will get back to you shortly.";
            expect(successMessage?.trim(), `Wrong success message "${successMessage}"`).toBe(expectedMessage);

            await page.close();
            await context.close();
            await browser.close();
        });
    });
});
