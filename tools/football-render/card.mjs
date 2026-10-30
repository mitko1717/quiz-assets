import { CSS, themeVars } from './card-css.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const POSITION_CODE = { Attack: 'FW', Midfield: 'MF', Defender: 'DF', Goalkeeper: 'GK' };
const BASE_FONT_BY_COLUMNS = { 2: 54, 3: 44 };

function columnsFor(count) {
  if (count <= 8) return 2;

  return 3;
}

function clubFontSize(name, columns) {
  const base = BASE_FONT_BY_COLUMNS[columns];
  const maxChars = { 2: 12, 3: 9 }[columns];
  const overflow = Math.max(0, name.length - maxChars);

  return Math.max(24, Math.round(base - overflow * 2.2));
}

function renderStep(stint, index, isLast, columns) {
  const classes = ['step', isLast ? 'last' : '', stint.loan ? 'loan' : ''].join(' ');
  const [c1 = '#888', c2 = c1] = stint.colors ?? [];
  const stripe = `background: linear-gradient(${c1} 0 50%, ${c2} 50% 100%)`;
  const tag = stint.loan ? '<span class="tag">LOAN</span>' : '';
  const fontSize = clubFontSize(stint.club, columns);

  return `<div class="${classes}" style="font-size:${fontSize}px">
    <div class="stripe" style="${stripe}"></div>
    <div class="num">${index + 1}</div>
    <div class="text"><span class="meta">${stint.year}${tag}</span>
      <span class="club">${esc(stint.club)}</span></div>
  </div>`;
}

export function cardHeight() {
  return 540;
}

export function renderCard(player) {
  const total = player.career.length;
  const columns = columnsFor(total);
  const rows = Math.ceil(total / columns);
  const steps = player.career.map((s, i) => renderStep(s, i, i === total - 1, columns)).join('');
  const gridStyle = `grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr)`;
  const position = POSITION_CODE[player.position] ?? '';

  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="card" style="${themeVars(process.env.THEME)}">
    <div class="grid" style="${gridStyle}">${steps}</div>
    <div class="chips">
      <div class="chip">${position}</div>
      <div class="chip">${player.flag ?? ''}</div>
    </div>
  </div></body></html>`;
}
