import{Page, Locator, expect} from '@playwright/test';
import { BasePage_SOLID } from './BasePage_SOLID';
import {config} from '../config/environment';

export class LoginPage_SOLID extends BasePage_SOLID
//inheritance - parent properties and methods
//click, navigate, fill, page
{
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page)
    {
        super(page);// calling the constructor of my parent class
        //constructor(page: Page)
    //     this.page = page;
    // }
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[type="submit"]');
    }

    async goto(): Promise<void>
    {
        //await this.navigate('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
        await this.navigate(`${config.baseUrl}${config.loginPath}`);
    }
    async login(email:string, password: string): Promise<void>
    {
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }

    async verifyLoginSuccess(): Promise<void>
    {
        const currentUrl = this.page.url();
        if (currentUrl.includes('error=loginError0')) {
            throw new Error(
                'Login was rejected by Kapruka. Check that TEST_EMAIL and TEST_PASSWORD ' +
                'in config/.env.qa are valid for this environment.'
            );
        }
        await expect(this.page).not.toHaveURL(/accountLogin/);
        // -> /..../
    }
    async isLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    
}
