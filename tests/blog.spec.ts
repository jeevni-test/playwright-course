import{ test, expect } from '@playwright/test';
import BlogPage from '../pages/blog.page';

test.describe('Blog Page', () => {
let blogPage: BlogPage;

    test('Get number of recent blog posts and check min character title', async ({ page }) => {
        blogPage = new BlogPage(page);
        
        // Open the URL
        await blogPage.navigate();
        
       for (const el of await blogPage.recentPostsList.elementHandles()){
        expect(((await el.textContent())!.trim()).length).toBeGreaterThan(10);
       }

       // assert there are 5 posts in the recent posts section 
       expect(await blogPage.recentPostsList.count()).toBe(5);
    });
});