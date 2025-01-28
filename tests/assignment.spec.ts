import { test, expect } from '@playwright/test';

test.describe('My Account', () => {

    test('', async ({ page }) => {
        await page.goto('https://www.solirius.com/');
        await expect(page).toHaveURL('https://www.solirius.com/');
        const expectedLinks = ["Home", "About us", "Our services", "Careers", "Insights", "Contact Us"];
        const badLink = "Our People";
        const links = await page.locator("nav[id*=comp-kz5uyc1a_r_comp-kz6wxwx7navContainer] :not(nav[id*=more]) li[id*=comp-kz5uyc1a_r_comp-kz6wxwx7] [class=JS76Uv]");
        for (const el of await links.elementHandles()) {
            console.log(await el.textContent());
        }


    });
    
});