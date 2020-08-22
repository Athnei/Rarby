const puppeteer = require('puppeteer');
// import { createWorker } from 'tesseract.js';
import { GetCaptcha } from './tesseract';

(async () => {
  const browser = await puppeteer.launch()
  try {
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()

    await page.goto('https://rarbgtorrents.org/torrents.php', { waitUntil: 'networkidle2' })
    await page.setViewport({ width: 1366, height: 357 })
    await page.waitForSelector('table > tbody > tr:nth-child(2) > td:nth-child(2) > img')
    await page.waitFor(1000);

    const element = await page.$('body > form > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > img')

    await element.screenshot({ path: 'images/code.png' })

    const data = await GetCaptcha();

    console.log(data);

    await page.type('table #solve_string', data);

    await page.waitForSelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div:nth-child(1) > table')

    let tit = await page.evaluate(() => {
      let title = document.querySelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div:nth-child(1) > table > tbody > tr > td:nth-child(1) > a')?.getAttribute('title');

      return title;
    })
    console.log(tit);
    await page.screenshot({ path: 'images/torrents.png' })

  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();