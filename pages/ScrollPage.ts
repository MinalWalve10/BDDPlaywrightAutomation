import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage_SOLID } from './BasePage_SOLID';


export class ScrollPage extends BasePage_SOLID {

    readonly bestSellingGift: Locator;

    constructor(page: Page) {
        super(page);
        this.bestSellingGift = page.locator('//b[contains(text(),"Best Sellers")]');
    }

    async scrollToBestSellingGift(): Promise<void> {
        await this.scrollToElement(this.bestSellingGift);
    }

    async isLoaded(): Promise<void> {
        await expect(this.bestSellingGift).toBeVisible();
    }

    async goto(): Promise<void> {
        // await this.navigate('/');
        await this.navigate('/shops/events_home.jsp');
    }

}