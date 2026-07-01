import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
const outDir = process.argv[2];
mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
});
const page = await browser.newPage();

// Mobile 375px — check invitation centering
await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 1 });
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 2500));
await page.screenshot({ path: `${outDir}/mobile-invitation.png` });

const metrics = await page.evaluate(() => {
  const content = document.querySelector('.hero__content');
  const cr = content.getBoundingClientRect();
  return { w: cr.width, x: cr.x, viewport: window.innerWidth };
});
console.log('mobile hero__content:', JSON.stringify(metrics));

// Day section — check date
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.evaluate(() => {
  const el = document.getElementById('day');
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: `${outDir}/day.png` });

await browser.close();
console.log('done');
