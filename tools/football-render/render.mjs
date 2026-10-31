import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { cardHeight, renderCard } from './card.mjs';

const [dataPath = 'samples.json', outDir = 'out'] = process.argv.slice(2);

// Runs in the browser: shrink each step until the club name fits without ellipsis.
function fitClubNames() {
  const MIN_FONT = 18;

  for (const step of document.querySelectorAll('.step')) {
    const club = step.querySelector('.club');
    let size = parseFloat(getComputedStyle(step).fontSize);

    const overflows = () => {
      const range = document.createRange();
      range.selectNodeContents(club);
      const textRight = range.getBoundingClientRect().right;
      const stepRight = step.getBoundingClientRect().right - 12;

      return textRight > stepRight;
    };

    while (overflows() && size > MIN_FONT) {
      size -= 1;
      step.style.fontSize = `${size}px`;
    }
  }
}
const players = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 1200 } });

for (const player of players) {
  await page.setContent(renderCard(player));
  await page.evaluate(fitClubNames);
  const file = path.join(outDir, `${player.id}.jpg`);
  await page.locator('.card').screenshot({ path: file, type: 'jpeg', quality: 82 });
  console.log(`ok ${file}`);
}

await browser.close();

const previews = players.map((p) => `<img src="${p.id}.jpg" width="340" style="margin:8px;display:block">`).join('');
fs.writeFileSync(path.join(outDir, 'preview.html'), `<body style="background:#222">${previews}</body>`);
console.log(`preview ${path.join(outDir, 'preview.html')}`);
