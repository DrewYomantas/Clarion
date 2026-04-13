import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const templatePath = resolve(__dirname, 'og-image-template.html');
const outPath = resolve(__dirname, '../frontend/public/og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(`file:///${templatePath.replace(/\\/g, '/')}`);
await page.waitForTimeout(200); // let fonts settle

const screenshot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
writeFileSync(outPath, screenshot);
await browser.close();

console.log(`og-image.png written to ${outPath}`);
