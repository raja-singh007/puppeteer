const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://github.com');
  await page.screenshot({ path: '/home/rudra/Pictures/screenshots/github.png' });
  
  browser.close();
}

run();