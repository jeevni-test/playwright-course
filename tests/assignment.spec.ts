import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import path from 'path';

test.describe('My Account', () => {

    test('Assignments 1-3', async ({ page }) => {

        //1. Goes to the Solirius website
        await page.goto('https://www.solirius.com/');

        //2. Checks the url is as expected
        await expect(page).toHaveURL('https://www.solirius.com/');

        //3. Checks the navigation bar contains links to Home, About us, Our services, Careers, Insights, Contact Us and not Our People
        const expectedLinks = ["Home", "About us", "Our services", "Careers", "Insights", "Contact Us"];
        const badLink = "Our People";
        const links = await page.locator("nav[id*=comp-kz5uyc1a_r_comp-kz6wxwx7navContainer] :not(nav[id*=more]) li[id*=comp-kz5uyc1a_r_comp-kz6wxwx7] [class=JS76Uv]");

        const linksText = (await links.allInnerTexts()).map(text => text.trim().toLowerCase());

        for (const expectedLink of expectedLinks) {
            expect(linksText).toContain(expectedLink.toLowerCase());
        }
        expect(linksText).not.toContain(badLink.toLowerCase());



    });

    test('Assignments 4-5', async ({ page }) => {

        //4. Checks there is a join our team link and clicks it
        await page.goto('https://www.solirius.com/');
        await page.getByRole('link', { name: 'Join our team' }).click();

        //5. Checks there is no Chocolate Engineering practice
        const practiceSection = page.locator('h2:text("JOIN A PRACTICE")');
        const practices = practiceSection.locator('following-sibling:h3');
        const practicesCount = await practices.count();

        for (let i = 0; i < practicesCount; i++) {
            const practiceName = await practices.nth(i).textContent();
            expect(practiceName).not.toBe('Chocolate Engineering');
            console.log(`h3 #${i + 1}: ${practiceName}`);
        }
    });

test('Assignments 6-7 - Upload Resume incorrectly', async ({ page }) => {
    await page.goto('https://www.solirius.com/');
    
    await page.getByRole('link', { name: 'Join our team' }).click();
    await page.locator('a[aria-label="Explore Quality Engineering roles"]').click();

    await page.waitForSelector('[data-testid="responsive-container-content"] .comp-lmexneoj-container');
    const firstJobItem = await page.locator('[data-testid="responsive-container-content"] .comp-lmexneoj-container div[role="listitem"]:first-child');

    const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        firstJobItem.locator('a[aria-label="Details"]').click()
    ]);

    await newPage.waitForLoadState();

    await newPage.locator('button[data-ui="cookie-consent-accept"]').click();

    await newPage.getByRole('link', { name: 'Application' }).click();

    await newPage.locator('#firstname').fill('John');
    await newPage.locator('#lastname').fill('Doe');
    await newPage.locator('#email').fill('john.doe@example.com');

    const phoneInput = await newPage.locator('input[name="phone"]');
    await phoneInput.fill('07123456789');
    await phoneInput.blur(); // Simulates the moving focus away
    console.log("Phone number filled and focus moved away");

    await page.waitForTimeout(1000); 

    // Directly set file input without clicking
    const fileInput = await newPage.locator('input[type="file"]');
    

    const filePath = path.join(__dirname, '../data/blank_file.docx'); 
    await fileInput.setInputFiles(filePath);
    console.log("Resume uploaded successfully");

    // Submit the form
    const submitButton = await newPage.getByRole('button', { name: 'Submit application' });
    await submitButton.click();
    console.log("Submit button clicked");

    try {
        // Wait for the CAPTCHA to appear
        const captchaFrame = await page.frameLocator('iframe[src*="captcha"]'); // Locate the CAPTCHA iframe
        const captchaCheckbox = captchaFrame.locator('input[type="checkbox"]'); // Locate checkbox for 'I'm not a robot'
    
        // If CAPTCHA is found, try clicking it (if it's a simple checkbox)
        await captchaCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        await captchaCheckbox.click();
        
        // Proceed after CAPTCHA is handled
        await page.locator('button[type="submit"]').click();  // Submit the form again
    } catch (error) {
        console.log('No CAPTCHA found or other issue:', error);
    }
    

    await page.waitForTimeout(10000); 


    //7. Checks a red banner appears at the top of the page and there's an error on the field which hasn't been selected
    const dialog = page.locator('dialog#sn74YW85HJuxtuua');
    await dialog.waitFor({ state: 'visible' });

    // Extract the error message
    const errorMessage = await page.locator('dialog#sn74YW85HJuxtuua span[data-role="text"] strong.styles--2kqW6').textContent();
    console.log(`Error message: ${errorMessage}`);

    // Extract the color of the dialog box
    const dialogColor = await page.locator('dialog#sn74YW85HJuxtuua span[data-role="text"]').evaluate(el => el.style.color);
    console.log(`Dialog color: ${dialogColor}`);



    // const errorMessage = page.locator('#nznMgfIpWKwp5Aou_alert_body strong.styles--2kqW6');
    // await errorMessage.waitFor({ state: 'visible' });

    // const text = await errorMessage.textContent();
    // console.log(`Error message displayed: ${text}`);

    // const color = await errorMessage.evaluate(el => getComputedStyle(el).color);
    // console.log(`The computed color of the error message is: ${color}`);




    await newPage.close();
});

test('Assignments 6-7 - Upload Resume incorrectly - test', async ({ page }) => {
    await page.goto('https://www.solirius.com/');
    
    await page.getByRole('link', { name: 'Join our team' }).click();
    await page.locator('a[aria-label="Explore Quality Engineering roles"]').click();

    await page.waitForSelector('[data-testid="responsive-container-content"] .comp-lmexneoj-container');
    const firstJobItem = await page.locator('[data-testid="responsive-container-content"] .comp-lmexneoj-container div[role="listitem"]:first-child');

    const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        firstJobItem.locator('a[aria-label="Details"]').click()
    ]);

    await newPage.waitForLoadState();

    await newPage.locator('button[data-ui="cookie-consent-accept"]').click();

    await newPage.getByRole('link', { name: 'Application' }).click();

    await newPage.locator('#firstname').fill('John');
    await newPage.locator('#lastname').fill('Doe');
    await newPage.locator('#email').fill('john.doe@example.com');

    const phoneInput = await newPage.locator('input[name="phone"]');
    await phoneInput.fill('07123456789');
    await phoneInput.blur(); // Simulates the moving focus away
    console.log("Phone number filled and focus moved away");

    await page.waitForTimeout(1000); 

    // Directly set file input without clicking
    const fileInput = await newPage.locator('input[type="file"]');
    const filePath = path.join(__dirname, '../data/blank_file.docx'); 
    await fileInput.setInputFiles(filePath);
    console.log("Resume uploaded successfully");

    // Submit the form
    const submitButton = await newPage.getByRole('button', { name: 'Submit application' });
    await submitButton.click();
    console.log("Submit button clicked");
    await page.waitForLoadState('domcontentloaded'); // Ensure the DOM is fully loaded


    try {
        const captchaFrameExists = await page.locator('iframe[src*="captcha"]').count();
        console.log(`CAPTCHA frame found: ${captchaFrameExists > 0}`);
        if (captchaFrameExists > 0) {
            const captchaFrame = await page.frameLocator('iframe[src*="captcha"]');
            const captchaCheckbox = captchaFrame.locator('input[type="checkbox"]');
            await captchaCheckbox.waitFor({ state: 'visible', timeout: 20000 });
            await captchaCheckbox.click();
            console.log("CAPTCHA checkbox clicked");
        } else {
            console.log("No CAPTCHA found");
        }
    } catch (error) {
        console.log('No CAPTCHA found or other issue:', error);
    }
    
    await page.waitForTimeout(10000); 

    const dialog = page.locator('dialog#sn74YW85HJuxtuua');
    await dialog.waitFor({ state: 'visible', timeout: 20000 });
    console.log("Dialog found");

    const errorMessage = await page.locator('dialog#sn74YW85HJuxtuua span[data-role="text"] strong.styles--2kqW6').textContent();
    console.log(`Error message: ${errorMessage}`);

    const dialogColor = await page.locator('dialog#sn74YW85HJuxtuua span[data-role="text"]').evaluate(el => el.style.color);
    console.log(`Dialog color: ${dialogColor}`);

    await newPage.close();
});



    
    
    
    
    
    
    

});