const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.06'/></svg>\")";

export const THEMES = {
  a: { bg1: '#3b1466', bg2: '#1a0b33', bg3: '#0b0518', accent: '#e879f9', muted: '#b9a3d6', ink: '#1a0b33' },
  b: { bg1: '#123a6b', bg2: '#0a1a33', bg3: '#050b18', accent: '#fb923c', muted: '#9fb3cf', ink: '#0a1a33' },
  c: { bg1: '#3a2626', bg2: '#1a1414', bg3: '#0a0808', accent: '#f43f5e', muted: '#c4a9ad', ink: '#1a1414' }
};

export function themeVars(name) {
  const t = THEMES[name] ?? THEMES.a;

  return `--bg1:${t.bg1};--bg2:${t.bg2};--bg3:${t.bg3};--accent:${t.accent};--muted:${t.muted};--ink:${t.ink}`;
}

export const CSS = `
* { box-sizing: border-box; margin: 0; }
body { font-family: Inter, -apple-system, 'Helvetica Neue', Arial, sans-serif; }
.card { width: 960px; height: 540px; color: #fff; padding: 32px; display: flex; flex-direction: column;
  gap: 20px; background: ${NOISE}, radial-gradient(120% 100% at 15% 0%, var(--bg1) 0%, var(--bg2) 55%, var(--bg3) 100%); }
.grid { flex: 1; display: grid; gap: 14px 16px; align-content: center; }
.step { display: flex; align-items: center; border-radius: 16px; overflow: hidden; background: #ffffff12; min-width: 0; }
.stripe { width: 14px; align-self: stretch; flex: none; }
.num { flex: none; width: 1.6em; height: 1.6em; margin: 0 .5em; border-radius: 50%; display: grid;
  place-items: center; font-size: .55em; font-weight: 900; color: var(--ink); background: var(--accent); }
.text { display: flex; flex-direction: column; min-width: 0; flex: 1; padding-right: 12px; }
.meta { display: flex; align-items: center; gap: 10px; font-size: .58em; font-weight: 800; color: var(--muted); }
.club { font-weight: 900; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.1; }
.last { background: #ffffff24; outline: 4px solid var(--accent);
  box-shadow: 0 0 28px color-mix(in srgb, var(--accent) 35%, transparent); }
.loan { opacity: .62; }
.tag { font-size: .85em; font-weight: 900; letter-spacing: 1px; color: #fff; background: #ffffff22;
  padding: 2px 10px; border-radius: 999px; }
.chips { display: flex; gap: 14px; }
.chip { font-size: 36px; font-weight: 900; padding: 6px 24px; border-radius: 999px;
  background: #ffffff14; border: 2px solid #ffffff22; }
`;
