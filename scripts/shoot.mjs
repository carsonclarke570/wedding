// Dev-only screenshot harness for verifying the cinematic homepage.
// Usage: node scripts/shoot.mjs <url> <outDir> [--reduced]
// Captures: full-page (motion path), and each act at rest with cinema on.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.argv[2] || 'http://localhost:4322/';
const outDir = process.argv[3] || './scratchshots';
const reduced = process.argv.includes('--reduced');
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => document.fonts?.ready);
await new Promise((r) => setTimeout(r, 900));

// Full page (with cinema off this is the true stacked flow; with cinema on it
// includes pin-spacers, which is still useful for a bird's-eye check).
await page.screenshot({ path: `${outDir}/full.png`, fullPage: true });

// Each act at rest: scroll it to centre (via Lenis if present, else native).
const acts = ['invitation', 'story', 'day', 'travel', 'registry', 'rsvp'];
for (const id of acts) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 40;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, id);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${outDir}/act-${id}.png` });
}

await browser.close();
console.log('shot', acts.length + 1, 'frames to', outDir);
