import { Page, Locator } from '@playwright/test';

// contains textbox, mouse, click

export abstract class BasePage_SOLID {
    readonly page: Page;  //reference cannot reassign after initiation

    constructor(page: Page) {
        this.page = page;
    }

    // page- browser, locatore -element of webpage

    async click(locator: Locator): Promise<void>
    {
        await locator.waitFor({state: 'visible'});
        await locator.click();        
    }

    async navigate(url: string): Promise<void>{
        await this.page.goto(url, {waitUntil:'load'});
    }

    async fill(locator: Locator, value: string):   Promise<void>{
        await locator.waitFor({state: 'visible'});
        await locator.fill(value); 
    }

    abstract isLoaded(): Promise<void>;
}

