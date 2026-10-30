import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { cardHeight, renderCard } from './card.mjs';

const [dataPath = 'samples.json', outDir = 'out'] = process.argv.slice(2);
const players = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 1200 } });

for (const player of players) {
  await page.setContent(renderCard(player));
  const file = path.join(outDir, `${player.id}.png`);
  await page.locator('.card').screenshot({ path: file });
  console.log(`ok ${file}`);
}

await browser.close();

const previews = players.map((p) => `<img src="${p.id}.png" width="340" style="margin:8px;display:block">`).join('');
fs.writeFileSync(path.join(outDir, 'preview.html'), `<body style="background:#222">${previews}</body>`);
console.log(`preview ${path.join(outDir, 'preview.html')}`);
