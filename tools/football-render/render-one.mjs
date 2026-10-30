import fs from 'node:fs';
import sharp from 'sharp';

const SEED = '../quiz-platform-engine/data/football/football.seed.json';
const slug = process.argv[2] ?? 'player-career-8198';

const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'));
const entry = seed.find((e) => e.slug === slug);

if (!entry) throw new Error(`not found: ${slug}`);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ROW = 46;
const stints = entry.careerPath;
const height = Math.max(360, 110 + stints.length * ROW);

const rows = stints.map((s, i) => {
  const y = 100 + i * ROW;
  const opacity = s.loan ? 0.55 : 1;
  const loan = s.loan ? '  (оренда)' : '';
  const arrow = i < stints.length - 1
    ? `<text x="60" y="${y + 30}" font-size="18" fill="#7a8">↓</text>`
    : '';

  return `<g opacity="${opacity}">
    <text x="40" y="${y}" font-size="22" fill="#9ab">${s.year}</text>
    <text x="120" y="${y}" font-size="26" font-weight="700" fill="#fff">${esc(s.club)}${loan}</text>
  </g>${arrow}`;
}).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${height}">
  <rect width="100%" height="100%" rx="24" fill="#0f2a1d"/>
  <text x="40" y="52" font-size="24" font-weight="700" fill="#4ade80">ХТО ЦЕЙ ГРАВЕЦЬ?</text>
  <g font-family="Helvetica, Arial, sans-serif">${rows}</g>
  <text x="600" y="${height - 24}" font-size="18" fill="#7a8" text-anchor="end">${esc(entry.position ?? '')}</text>
</svg>`;

fs.mkdirSync('out', { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(`out/${slug}.png`);
console.log(`ok out/${slug}.png ${height}px`);
