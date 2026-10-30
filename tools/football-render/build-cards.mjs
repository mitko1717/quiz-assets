import fs from 'node:fs';
import countries from 'i18n-iso-countries';

const ENGINE = '../../../quiz-platform-engine/data/football';
const NEUTRAL = ['#4b3a66', '#2a1f3d'];

const FLAG_OVERRIDES = {
  England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Northern Ireland': '🇬🇧', 'Korea, South': '🇰🇷', Türkiye: '🇹🇷', "Cote d'Ivoire": '🇨🇮', 'DR Congo': '🇨🇩'
};

function flagFor(country) {
  if (!country) return '';
  if (FLAG_OVERRIDES[country]) return FLAG_OVERRIDES[country];

  const code = countries.getAlpha2Code(country, 'en');
  if (!code) return '';

  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function buildCards() {
  const seed = JSON.parse(fs.readFileSync(`${ENGINE}/football.seed.json`, 'utf8'));
  const colors = JSON.parse(fs.readFileSync(`${ENGINE}/club-colors.json`, 'utf8'));
  const careers = seed.filter((e) => e.variant === 'player_career_path');

  return careers.map((entry) => ({
    id: entry.slug,
    position: entry.position,
    flag: flagFor(entry.citizenship),
    career: entry.careerPath.map((s) => ({ ...s, colors: colors[s.clubId] ?? NEUTRAL }))
  }));
}

const cards = buildCards();
const missingFlags = cards.filter((c) => !c.flag).length;

fs.writeFileSync('cards.json', JSON.stringify(cards));
console.log(`cards: ${cards.length}, without flag: ${missingFlags}`);
