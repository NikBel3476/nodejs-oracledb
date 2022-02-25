const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const link = `${process.env.API_URL}/17a899cd16404e77/processory/`;

async function getInfoFromPage() {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        page.on('load', () => console.log(`Page loaded ${page.url()}`));

        await page.goto(`${link}`, { waitUntil: 'networkidle0'});

        const prices = await page.$$eval('div.product-buy__price', (divs) => divs.map(div => div.textContent));

        console.log(prices);
    } catch (e) {
        console.error(e);
    } finally {
        browser.close();
    }
}

module.exports = getInfoFromPage;
