// import { createWorker } from 'tesseract.js';
import { GetCaptcha } from './tesseract';
import { Item } from './models/carousel-item';
import { Torrents } from './models/torrents';

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());



export async function GetTorrents(): Promise<Torrents> {

  const browser = await puppeteer.launch({ headless: true });

  try {

    const page = await browser.newPage();

    await page.goto('https://rarbgtorrents.org/torrents.php', { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1366, height: 357 });
    await page.waitForSelector('table > tbody > tr:nth-child(2) > td:nth-child(2) > img');
    await page.waitForTimeout(1000);

    const element = await page.$('body > form > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > img');

    await element.screenshot({ path: 'images/code.png' });

    const data = await GetCaptcha();

    await page.type('table #solve_string', data);

    await page.waitForSelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div:nth-child(1) > table');

    const torrents: Torrents = await page.evaluate(() => {

      const evalTorrents: Item[] = [];

      document.querySelectorAll(
        'body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div:nth-child(1) > table > tbody > tr > td > a')
        .forEach(x => {

          const i: Item = {
            torrentLink: 'https://rarbgtorrents.org' + x?.getAttribute('href'),
            title: x?.getAttribute('title') as string,
            imgLink: x?.firstElementChild?.getAttribute('src')?.replace('over_opt', 'poster_opt')
          };

          evalTorrents.push(i)
        });


      return {
        torrentItems: evalTorrents
      } as Torrents;
    });

    for (const iterator of torrents.torrentItems) {

      await page.goto(iterator.torrentLink, { waitUntil: 'networkidle2' });

      const magnet = await page.evaluate(() => {
        return document.querySelector('body > table:nth-child(6) > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(1) > td.lista > a:nth-child(3)')?.getAttribute('href');
      });

      iterator.magnetLink = magnet;
    }

    torrents.dateOfScraping = new Date();

    return new Promise((resolve) => {
      resolve(torrents);
    });

  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  } finally {
    await browser.close();
  }
}