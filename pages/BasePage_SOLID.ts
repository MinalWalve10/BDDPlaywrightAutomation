import {Page, Locator} from '@playwright/test';

//textbox, mouse click

export abstract class BasePage_SOLID
{
    readonly page: Page;

    constructor(page: Page)
    {
        this.page = page; //LHS this age (line # 7) , RHS page - constrctutor parameter
    }
async click(locator: Locator): Promise<void>
{
    await locator.waitFor({state: 'visible'});
    await locator.click();
}
async navigate(url: string): Promise<void>
{
    await this.page.goto(url, {waitUntil: 'load'});
}
async fill(locator: Locator, value: string): Promise <void>
{
    await locator.waitFor({state: 'visible'})
    await locator.fill(value); //hardcoding
}

async select(locator: Locator, value: string): Promise <void>
{
    await locator.waitFor({state: 'visible'})
    await locator.selectOption
}
//scrollToElement
async scrollToElement(element: Locator): Promise<void>
{
    await element.scrollIntoViewIfNeeded();
}


abstract isLoaded(): Promise<void>;

}
//scroll
//control - Open closed principle open for extension, closed for modification
//S - Single responsibility principle