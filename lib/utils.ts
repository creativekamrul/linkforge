/** Join conditional class names without pulling in a dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'contact'
  );
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/** Resolve relative links (e.g. /resume.pdf) against the public site URL. */
export function absoluteUrl(url: string, base: string): string {
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  return base + (url.startsWith('/') ? url : '/' + url);
}

/** vCard values escape commas, semicolons, backslashes and newlines. */
export function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function truncate(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max - 1).trimEnd() + '…';
}
