export type ThemeMode = 'dark' | 'light';

export type ThemeOverrides = {
  preset?: string;
  mode?: ThemeMode;
  accent?: string;
  accent2?: string;
  background?: string;
  text?: string;
  card?: 'glass' | 'solid' | 'outline';
  radius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  font?: string;
  displayFont?: string;
  backgroundStyle?: 'aurora' | 'mesh' | 'grid' | 'dots' | 'plain';
  avatarRing?: boolean;
  animations?: boolean;
};

type Preset = { mode: ThemeMode; background: string; text: string; accent: string; accent2: string };

/**
 * Built-in colour presets. Choose one with theme.preset in site.json, then
 * override any single colour with theme.accent / accent2 / background / text.
 */
export const PRESETS: Record<string, Preset> = {
  midnight: { mode: 'dark', background: '#0B0D17', text: '#F4F5FF', accent: '#7C5CFF', accent2: '#22D3EE' },
  aurora: { mode: 'dark', background: '#060B14', text: '#EAF2FF', accent: '#34D399', accent2: '#38BDF8' },
  sunset: { mode: 'dark', background: '#140A11', text: '#FFF1F2', accent: '#FB7185', accent2: '#FBBF24' },
  ocean: { mode: 'dark', background: '#04121C', text: '#E6F6FF', accent: '#38BDF8', accent2: '#2DD4BF' },
  forest: { mode: 'dark', background: '#07130E', text: '#E9FBEF', accent: '#4ADE80', accent2: '#A3E635' },
  mono: { mode: 'dark', background: '#0A0A0A', text: '#F5F5F5', accent: '#E5E5E5', accent2: '#A3A3A3' },
  paper: { mode: 'light', background: '#FAF7F2', text: '#1C1917', accent: '#B45309', accent2: '#0F766E' },
  // High-contrast developer pair: ink-green with lime, plus a light counterpart.
  terminal: { mode: 'dark', background: '#101713', text: '#F4F1E8', accent: '#D6FF57', accent2: '#8575FF' },
  cream: { mode: 'light', background: '#F4F1E8', text: '#17241E', accent: '#17241E', accent2: '#FF775F' },
};

const SANS_FALLBACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO_FALLBACK = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
const SERIF_FALLBACK = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

/** Option key -> Google Fonts family. Loaded at runtime so Docker builds stay offline-safe. */
export const FONTS: Record<
  string,
  { family: string; weights: string; axis?: string; mono?: boolean; serif?: boolean }
> = {
  inter: { family: 'Inter', weights: '300..800' },
  manrope: { family: 'Manrope', weights: '300..800' },
  geist: { family: 'Geist', weights: '300..800' },
  'plus-jakarta': { family: 'Plus Jakarta Sans', weights: '300..800' },
  'space-grotesk': { family: 'Space Grotesk', weights: '400..700' },
  'jetbrains-mono': { family: 'JetBrains Mono', weights: '400..700', mono: true },
  playfair: { family: 'Playfair Display', weights: '500..700', serif: true },
  'dm-sans': { family: 'DM Sans', weights: '300..800' },
  'instrument-serif': { family: 'Instrument Serif', weights: '400', axis: 'ital@0;1', serif: true },
};

const RADIUS: Record<string, string> = {
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '30px',
  full: '999px',
};

export type ResolvedTheme = {
  mode: ThemeMode;
  background: string;
  text: string;
  accent: string;
  accent2: string;
  card: 'glass' | 'solid' | 'outline';
  radius: string;
  fontKey: string;
  fontFamily: string;
  fontStack: string;
  displayKey: string;
  displayFamily: string;
  displayStack: string;
  monoStack: string;
  fontQuery: string;
  backgroundStyle: 'aurora' | 'mesh' | 'grid' | 'dots' | 'plain';
  avatarRing: boolean;
  animations: boolean;
  surface: string;
  surfaceStrong: string;
  border: string;
  muted: string;
  accentSoft: string;
  accentGlow: string;
  gridLine: string;
};

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return 'rgba(124, 92, 255, ' + alpha + ')';
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

export function isDarkBackground(hex: string): boolean {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return true;
  const channels = [0, 2, 4].map((i) => {
    const v = parseInt(full.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  return luminance < 0.35;
}

type Face = { key: string; family: string; stack: string; query: string };

function faceFor(key: string): Face {
  const font = FONTS[key] || FONTS.inter;
  const stack = '"' + font.family + '", ' + (font.mono ? MONO_FALLBACK : font.serif ? SERIF_FALLBACK : SANS_FALLBACK);
  const axis = font.axis || 'wght@' + font.weights;
  return {
    key,
    family: font.family,
    stack,
    query: 'family=' + font.family.replace(/ /g, '+') + ':' + axis + '&display=swap',
  };
}

export function resolveTheme(overrides: ThemeOverrides = {}): ResolvedTheme {
  const preset = PRESETS[overrides.preset || ''] || PRESETS.midnight;

  const background = overrides.background || preset.background;
  const text = overrides.text || preset.text;
  const accent = overrides.accent || preset.accent;
  const accent2 = overrides.accent2 || preset.accent2;
  const mode: ThemeMode = overrides.mode || preset.mode;

  const fontKey = overrides.font && FONTS[overrides.font] ? overrides.font : 'inter';
  const displayKey =
    overrides.displayFont && FONTS[overrides.displayFont] ? overrides.displayFont : fontKey;

  const body = faceFor(fontKey);
  const display = faceFor(displayKey);

  // Both families are requested in one Google Fonts URL (duplicates collapsed).
  const families = body.family === display.family ? [body] : [body, display];
  const fontQuery = 'https://fonts.googleapis.com/css2?' + families.map((f) => f.query).join('&');

  // Monospace accents reuse a real mono webfont when the body already is one,
  // otherwise they fall back to the visitor's system mono: zero extra download.
  const monoFont = FONTS[fontKey];
  const monoStack = monoFont && monoFont.mono ? body.stack : MONO_FALLBACK;

  // Trust the background luminance over the declared mode: a light background
  // paired with mode:"dark" would otherwise render unreadable text.
  const dark = isDarkBackground(background);

  return {
    mode,
    background,
    text,
    accent,
    accent2,
    card: overrides.card || 'glass',
    radius: RADIUS[overrides.radius || 'xl'] || RADIUS.xl,
    fontKey,
    fontFamily: body.family,
    fontStack: body.stack,
    displayKey,
    displayFamily: display.family,
    displayStack: display.stack,
    monoStack,
    fontQuery,
    backgroundStyle: overrides.backgroundStyle || 'aurora',
    avatarRing: overrides.avatarRing !== false,
    animations: overrides.animations !== false,
    surface: dark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.72)',
    surfaceStrong: dark ? 'rgba(18,20,32,0.86)' : 'rgba(255,255,255,0.94)',
    border: dark ? 'rgba(255,255,255,0.10)' : 'rgba(17,24,39,0.10)',
    muted: dark ? 'rgba(255,255,255,0.60)' : 'rgba(17,24,39,0.60)',
    accentSoft: hexToRgba(accent, dark ? 0.16 : 0.12),
    accentGlow: hexToRgba(accent, dark ? 0.38 : 0.24),
    gridLine: dark ? 'rgba(255,255,255,0.06)' : 'rgba(17,24,39,0.06)',
  };
}

export function themeToCss(theme: ResolvedTheme): string {
  const vars: Array<[string, string]> = [
    ['--bg', theme.background],
    ['--text', theme.text],
    ['--muted', theme.muted],
    ['--accent', theme.accent],
    ['--accent-2', theme.accent2],
    ['--accent-soft', theme.accentSoft],
    ['--accent-glow', theme.accentGlow],
    ['--surface', theme.surface],
    ['--surface-strong', theme.surfaceStrong],
    ['--border', theme.border],
    ['--grid-line', theme.gridLine],
    ['--radius', theme.radius],
    ['--font-body', theme.fontStack],
    ['--font-display', theme.displayStack],
    ['--font-mono', theme.monoStack],
  ];
  const root = ':root{' + vars.map(([key, value]) => key + ':' + value).join(';') + '}';
  const scheme = isDarkBackground(theme.background)
    ? ':root{color-scheme:dark}'
    : ':root{color-scheme:light}';
  return root + scheme;
}

/** Full <style> payload: webfont import first, then the theme variables. */
export function themeStyleSheet(theme: ResolvedTheme): string {
  return '@import url("' + theme.fontQuery + '");' + themeToCss(theme);
}
