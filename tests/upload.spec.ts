import { test, expect } from '@playwright/test';

import CartPage from '../pages/cart.page';

import path from 'path';

test.describe('Upload File', () => {
    let cartPage;

    const fileName = ['elephant_2.png', 'random_img.jpg'];

    for (const name of fileName) {
        test(`Should upload a ${name} file`, async ({ page }) => {
            cartPage = new CartPage(page);
    
    
            //Open the url
    
            await page.goto('https://practice.sdetunicorns.com/cart/');
    
            //Store test file path
    
            const filePath = path.join(__dirname, `../data/${name}`);
            //upload the test file 
    
            cartPage.uploadComponent().uploadFile(filePath);
    
            //assertion 
    
            await expect(cartPage.uploadComponent().successMessage).toContainText('uploaded successfully');
           
        })
    }
    test.skip('Should upload test file', async ({ page }) => {
        cartPage = new CartPage(page);


        //Open the url

        await page.goto('https://practice.sdetunicorns.com/cart/');

        //Store test file path

        const filePath = path.join(__dirname, '../data/elephant_2.png');

        //upload the test file 

        cartPage.uploadComponent().uploadFile(filePath);

        /*
        wait for condition example

        await page.locator('#wfu_messageblock_header_1_1').waitFor({ state: 'visible' , timeout: 10000});
        */

        //assertion 

        await expect(cartPage.uploadComponent().successMessage).toContainText('uploaded successfully');
        /*

        If the 'choose file' button is not visible and you don't want to do DOM manipulation in playwright (NB: upfile_1 from site above, replace accordingly):
        - go to 'console' via the browser dev tools
        - type in the following command: document.querySelector('#upfile_1').className = ''

        */
    })


    test('Should upload test file on a hidden input field', async ({ page }) => {
        //Open the url

        await page.goto('https://practice.sdetunicorns.com/cart/');

        //Store test file path

        const filePath = path.join(__dirname, '../data/elephant_2.png');

        // DOM manipulation

        await page.evaluate(() => {
            const selector = document.querySelector('input#upfile_1');
            if(selector){
                selector.className = '';
            }
        });



        //upload the test file 

        await page.setInputFiles('input#upfile_1', filePath);

        //click the submit button

        await page.locator('#upload_1').click();

        //assertion 

        await expect(page.locator('#wfu_messageblock_header_1_1')).toContainText('uploaded successfully');

    })
});