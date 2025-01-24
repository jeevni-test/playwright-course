import { test, expect } from '@playwright/test';
import ContactPage from '../pages/contact.page';
import { faker } from '@faker-js/faker'

test.describe('Contact Us Page', () => {
    let contactPage: ContactPage;
    test('Fill contact form and verify success message upon submission', async ({ page }) => {
        contactPage = new ContactPage(page);
        
        // Open the URL
        await contactPage.navigate();

        // Fill out the contact form
        await contactPage.submitContactForm(faker.person.fullName(), faker.internet.email(), faker.phone.number(), faker.lorem.paragraphs(3));

        //verify success message
        
        await expect(contactPage.successText).toHaveText('Thanks for contacting us! We will be in touch with you shortly');
});

});