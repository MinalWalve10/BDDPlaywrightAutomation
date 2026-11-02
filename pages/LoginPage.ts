import {Page, Locator, expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage{
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;


constructor (page: Page)
{
    super(page);
    this.emailInput = page.locator('input[name="email"]'); //css selector - html tag and attribute
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[type="submit"]');
}

async goto(): Promise<void>{
    await this.navigate('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
}

async isLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
}

async login(email:string, password: string): Promise<void>{
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
}

async verifyLoginSuccess(): Promise<void>{
    const currentUrl = this.page.url();
    if (currentUrl.includes('error'))
    {
        throw new Error("Login failed");
    }
    await expect(this.page).not.toHaveURL(/accountLogin/);
}

}
//