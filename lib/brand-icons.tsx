import * as simpleIcons from 'simple-icons';

type BrandNode = { path?: string; hex?: string; title?: string };

const TABLE = simpleIcons as unknown as Record<string, BrandNode>;

/** Names simple-icons cannot derive from the platform name by itself. */
const ALIASES: Record<string, string> = {
  twitter: 'x',
  'x/twitter': 'x',
  tw: 'x',
  'x-twitter': 'x',
  devto: 'devdotto',
  'dev-to': 'devdotto',
  buy_me_a_coffee: 'buymeacoffee',
  hackernews: 'ycombinator',
  'hacker news': 'ycombinator',
  'app store': 'appstore',
  'google play': 'googleplay',
  'product hunt': 'producthunt',
  stack_overflow: 'stackoverflow',
  'stack overflow': 'stackoverflow',
  'word press': 'wordpress',
  gatsbyjs: 'gatsby',
  nextdotjs: 'nextdotjs',
  'advanced custom fields': 'advancedcustomfields',
};

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pascalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lookup(key: string): BrandNode | null {
  const node = TABLE[key];
  return node && typeof node.path === 'string' && node.path.length > 0 ? node : null;
}

/**
 * simple-icons names most JavaScript projects with a "dot" in the key
 * (Next.js -> siNextdotjs, Node.js -> siNodedotjs). Derive that form so
 * "Next.js" and "Node.js" resolve instead of silently falling back.
 */
function jsDottedName(value: string): string | null {
  if (value.length <= 2 || !value.endsWith('js')) return null;
  return value.slice(0, -2) + 'dotjs';
}

/** Lazy index of normalised icon titles, built only when a name misses. */
let titleIndex: Map<string, string> | null = null;

function keyByTitle(needle: string): string | null {
  if (!titleIndex) {
    titleIndex = new Map<string, string>();
    for (const key of Object.keys(TABLE)) {
      const node = TABLE[key];
      if (!node || typeof node.path !== 'string' || !node.path) continue;
      const title = node.title ? normalise(node.title) : '';
      if (title && !titleIndex.has(title)) titleIndex.set(title, key);
    }
  }
  return titleIndex.get(needle) || null;
}

export type Brand = { path: string; hex: string; title: string };

function packageBrand(node: BrandNode, fallbackTitle: string): Brand {
  return {
    path: node.path as string,
    hex: node.hex ? '#' + node.hex : '#111111',
    title: node.title || fallbackTitle,
  };
}

/**
 * Resolve a platform or technology name such as "github", "Next.js" or
 * "Tailwind CSS" to an official simple-icons glyph. Returns null when nothing
 * matches, so callers can fall back to a generic icon or a monogram.
 */
export function brandIcon(platform: string): Brand | null {
  const raw = platform.trim();
  if (!raw) return null;

  const norm = normalise(raw);
  if (!norm) return null;

  const candidates: string[] = [];
  const alias = ALIASES[raw.toLowerCase()] || ALIASES[norm];
  if (alias) candidates.push(alias);
  candidates.push(norm);
  const dotted = jsDottedName(norm);
  if (dotted) candidates.push(dotted);

  for (const candidate of candidates) {
    const node = lookup('si' + pascalise(normalise(candidate)));
    if (node) return packageBrand(node, raw);
  }

  const byTitle = keyByTitle(norm);
  if (byTitle) {
    const node = lookup(byTitle);
    if (node) return packageBrand(node, raw);
  }

  return null;
}

export function BrandGlyph({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
