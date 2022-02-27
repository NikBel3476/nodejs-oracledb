const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const link = `${process.env.API_URL}/17a899cd16404e77/processory/`;

async function getInfoFromPage() {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: ["--disable-gpu", "--ignore-certificate-errors", "--no-sandbox"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 1 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.0 Safari/537.36"
    );
    page.on("load", () => console.log(`DOM loaded ${page.url()}`));

    await page.goto(`${link}`, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    });
    await page.screenshot({ path: "screen.png" });

    const prices = await page.$$eval("div.product-buy__price", (divs) =>
      divs.map((div) => div.textContent)
    );

    console.log(prices);
  } catch (e) {
    console.error(e);
  } finally {
    browser.close();
  }
}

module.exports = getInfoFromPage;
