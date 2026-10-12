import { Page, expect, Locator } from '@playwright/test';
import { BasePage_SOLID } from '../pages/BasePage_SOLID'
import { config } from '../config/environment';

export class LoginPage_SOLID extends BasePage_SOLID {

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(Page: Page) {
        super(Page);
        this.emailInput = Page.getByPlaceholder('Enter email');
        this.passwordInput = Page.getByPlaceholder('Password');
        this.loginButton = Page.locator('input[name="Login"]');

    }

    async goto(): Promise<void> {
        await this.navigate(`${config.baseUrl}${config.loginPath}`);
    }

    async Login(email: string, password: string): Promise<void> {
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton)
    }

    async verifyLoginSucessful(): Promise<void> {
        const currenturl = this.page.url();
        await expect(this.page).not.toHaveURL(/accountLogin/);
    }

    async isLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }
}
