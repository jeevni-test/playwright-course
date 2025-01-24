import { test, expect } from '@playwright/test';

import HomePage from '../pages/home.page';  

//running tests in parallel: npx playwright test tests -- workers 4
//if --workers 1 will run the tests sequentially
// can also be set in playwright.config.ts

/*

DEBUGGING NOTES


1) to use debugging console (number is line of code test begins on):

DEBUG=pw:api TEST_ENV=devNational npx playwright test home.spec.ts:24

2) to use trace locate in playwright.config.ts and change manually or do via terminal

Available options to record a trace:

'on-first-retry' - Record a trace only when retrying a test for the first time.
'on-all-retries' - Record traces for all test retries.
'off' - Do not record a trace.
'on' - Record a trace for each test. (not recommended as it's performance heavy)
'retain-on-failure' - Record a trace for each test, but remove it from successful test runs.

3) to use inspector - 
    - in terminal (number is line of code test begins on):

     PWDEBUG=1 TEST_ENV=devNational npx playwright test home.spec.ts:24

    - in playwright test to bring up inspector at a given point:

    await page.pause();

4) to use 'Record' button in inspector

using the 'Record' button which allows you to manually conduct the test and returns a full playwright script of the action completed
NB: not good practice to rely on this, but is good starting point
Will likely have many lines of unnecessary code or IDs that will not map correctly 

*/

test.describe('Home', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {

        homePage = new HomePage(page);

        //open the url
        await homePage.navigate();
    })
    

    test('Open HomePage and verify title', async ({ page }) => {
       


        //verify title
        await expect(page).toHaveTitle('Practice E-Commerce Site – SDET Unicorns');

    });

    test.skip('Open About page and verify title', async ({ page }) => {
        //open the url
        await page.goto('https://practice.sdetunicorns.com/about/');


        //verify title
        await expect(page).toHaveTitle('About – Practice E-Commerce Site');

    });

    test('Click get started button using CSS Selector', async ({ page }) => {
        

        await expect(page).not.toHaveURL(/.*#get-started/);

        //click on get started button
        //await page.locator('#get-started').click();
        await homePage.getStartedBtn.click();


        //verify title has #get-started
        await expect(page).toHaveURL(/.*#get-started/);

    });

    test('Verify heading text is visible', async () => {
        

        //find the text locator - if I add "" this will make sure that it is case sensitive
        //const headingText = await page.getByText('Think different. Make different.');
        const headingText = await homePage.headingText;

        //verify heading text is visible 
        await expect(headingText).toBeVisible();

    });

    test('Verify home link is enabled', async ({ page }) => {


        // Wait for the zak-primary-menu to load and become visible
        await page.waitForSelector('#zak-primary-menu', { state: 'visible' });

        // Find the "Home" link within the zak-primary-menu
        //const homeText = page.locator('#zak-primary-menu a', { hasText: 'Home' });
        const homeText = await homePage.homeLink;

        // Verify the "Home" link is enabled
        await expect(homeText).toBeEnabled();
    });

    test('Verify search icon is visible using XPath selector', async ({ page }) => {
        

        // Wait for the header actions to load
        await page.waitForSelector('.zak-header-actions', { state: 'visible' });

        // Find the first search icon using XPath
        //const searchIcon = page.locator('//div[contains(@class, "zak-header-actions")]//a[contains(@class, "zak-header-search__toggle")]').first();
        const searchIcon = await homePage.searchIcon;

        // Verify the search icon is visible
        await expect(searchIcon).toBeVisible();
    });


    /* Corrected x paths and css selector for ease of use 

    //div[@class='zak-header-actions zak-header-actions--desktop']//a[@class='zak-header-search__toggle']

    //*[@id="@zak-primary-menu"]//*[@class="zak-icon zakra-icon--magnifying-glass"]

    */


    test('Verify text of all nav links', async () => {
    

        const expectedNavLinks = ["Home", "Abou", "Shop", "Blog", "Contact", "My account"];


        // Find the nav links in the li elements whose id contains "menu"
        //const navLinks = page.locator('#zak-primary-menu li[id*="menu"]');
        //const navLinks = await homePage.navMenu;

        // Get all text contents from the nav links
        //const navLinkTexts = await navLinks.allTextContents();

        // Verify nav links text
        expect(await homePage.getNavMenuText()).toEqual(expectedNavLinks);
    });

    //nth element test 

    test('Verify text of blog nav link', async () => {
        
        
        const expectedNavLinks = ["Home", "About", "Shop", "Blog", "Contact", "My account"];


        // Find the nav links in the li elements whose id contains "menu"
        //const navLinks = page.locator('#zak-primary-menu li[id*="menu"]').nth(3);
        const navLinks = await homePage.navMenu.nth(3);

        // Get all text contents from the nav links
        const navLinkTexts = await navLinks.textContent();

        // Verify nav links text
        expect(navLinkTexts).toEqual(expectedNavLinks[3]);
    });

    //print all links instead of comparing

    test('Verify text of nav links using print', async () => {
        

        // Find the nav links in the li elements whose id contains "menu"
        //const navLinks = page.locator('#zak-primary-menu li[id*="menu"]');
        const navLinks = await homePage.navMenu;

        // Print all text contents from the nav links
        for (const el of await navLinks.elementHandles()) {

            console.log(await el.textContent());

        }


    });


});

/*

Longer solutions to contact/blog tests

Shorter solutions can be found in contact.spec.ts/blog.spec.ts

//exercise1 - go to contact page, fill out form, fill out form, submit form, verify success message

    test('Fill contact form and verify success message upon submission', async ({ page }) => {

        // Open the URL
        await page.goto('https://practice.sdetunicorns.com/contact/');

        // Fill name text input
        await page.getByLabel("Name").fill("John");

        // Fill email text input
        await page.getByLabel("Email").fill("John@example.com");

        // Fill phone text input
        await page.getByLabel("Phone").fill("07123567890");

        // Fill message text input
        await page.getByLabel("Message").fill("Hi I require help with a product");

        // Define the endpoint to listen for
        const requestPromise = page.waitForResponse(response =>
            response.url() === 'https://practice.sdetunicorns.com/contact/' && response.status() === 200
        );

        // Click submit button
        await page.getByRole("button", { name: "Submit" }).click();

        // Wait for the submission response
        await requestPromise;

        // Wait for the success message to appear
        const successMessage = await page.locator("text=Thanks for contacting us! We will be in touch with you shortly").isVisible();


        // Optionally, log a message if the form was successfully submitted
        if (successMessage) {
            console.log("Form submitted successfully, success message visible!");
        }
    });

    /*

    Alternative solution to exercise1 - better practice as has unique identifiers which labels like 'name' might not resolve to 

    test('Fill contact form and verify success message upon submission', async ({ page }) => {
        // Open the URL
        await page.goto('https://practice.sdetunicorns.com/contact/');

        // Fill out the contact form
        await page.locator('.contact-name input').fill('John');
        await page.locator('.contact-email input').fill('John@example.com');
        await page.locator('.contact-phone input').fill('071234567890');
        await page.locator('.contact-message textarea').fill('Hi, I require help with a product.');

        //click submit
        await page.locator('button[type=submit]').click();

        //verify success message
        const successAlert = page.locator('div[role=alert]');
        await expect(successAlert).toHaveText('Thanks for contacting us! We will be in touch with you shortly.');
});




    //exercise2 - go to blog page, get number of recent posts and assert that each title is more than 10 characters

    test('Get number of recent blog posts and check min character title', async ({ page }) => {
        // Open the URL
        await page.goto('https://practice.sdetunicorns.com/blog/');

        // Locate the section containing the "Recent Posts" header
        const recentPostsSection = page.locator('h2.widget-title:has-text("Recent Posts")');

        // Locate the list items under the "Recent Posts" section
        const recentPosts = recentPostsSection.locator('xpath=following-sibling::ul/li'); //as <ul> is nested in the same container as <h2> must access differently

        // Get the number of recent blog posts
        const recentPostsCount = await recentPosts.count();

        // Log the number of recent blog posts
        console.log(`Number of recent blog posts: ${recentPostsCount}`);

        // Verify each recent blog post title is more than 10 characters
        for (let i = 0; i < recentPostsCount; i++) {
            const title = await recentPosts.nth(i).textContent();

            if (title) {
                expect(title.trim().length).toBeGreaterThan(10);
                console.log(`Item ${i + 1}: ${title.trim()}`);
            } else {
                console.warn(`Item ${i + 1} has no text content.`);
            }
        }
    });

    /*

    Alternative solution to exercise2

    test('Get number of recent blog posts and check min character title', async ({ page }) => {
        // Open the URL
        await page.goto('https://practice.sdetunicorns.com/blog/');

        // Get recent posts list elements
        const recentPostsList = page.locator('#recent-posts-3 ul li');

        //assert the total length = 5
        expect(await recentPostsList.count()).toEqual(5);

        //loop throught the list and check the length of each title
        for (const el of recentPostsList.elementHandles()) {
            expect(((await el.textContent()).trim()).length).toBeGreaterThan(10);

        
        }
    });


    */

    /* 

    Soft assertion example:

    //this will run the assertion without failing the overall test
    await expect.soft(page.locator('.contact-message textarea')).toHaveText('Hi, I require help with a product.');

    //if we still want to fail the test if the soft assertion fails
    expect(test.info().errors.length).toBeLessThan(1);

    */