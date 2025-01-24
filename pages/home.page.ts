import { Page, Locator } from '@playwright/test';

class HomePage{
    page: Page;
    getStartedBtn: Locator;
    headingText: Locator;
    homeLink: Locator;
    searchIcon: Locator;
    navMenu: Locator;

    constructor(page: Page){
        this.page = page;
        this.getStartedBtn = page.locator('#get-started');
        this.headingText = page.locator('text=Think different. Make different.');
        this.homeLink = page.locator('#zak-primary-menu a', { hasText: 'Home' });
        this.searchIcon = page.locator('//div[contains(@class, "zak-header-actions")]//a[contains(@class, "zak-header-search__toggle")]').first();
        this.navMenu = page.locator('#zak-primary-menu li[id*="menu"]');
    }

    async navigate(){
        await this.page.goto('/');

    }

    getNavMenuText(){
        return this.navMenu.allTextContents();
    }

}

export default HomePage;