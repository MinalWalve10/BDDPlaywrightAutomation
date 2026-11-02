import {test, Page} from '@playwright/test';
import { ScrollPage} from '../../pages/ScrollPage';

test.describe('Scroll Kapruka', () =>{
    test('Scroll To Element', async({page})=> {

        const scrollPage = new ScrollPage(page);
       await scrollPage.goto();
    //    await scrollPage.isLoaded();
       await scrollPage.scrollToBestSellingGift();

    })


})