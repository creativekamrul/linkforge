import { safeLoadSite } from '@/lib/config';
import { escapeVCard, slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { site } = safeLoadSite();
  if (!site) return new Response('Config file is unavailable', { status: 503 });

  const { profile } = site.config;
  const parts = profile.name.trim().split(/\s+/);
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];

  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push('FN:' + escapeVCard(profile.name));
  lines.push('N:' + escapeVCard(last) + ';' + escapeVCard(first) + ';;;');
  if (profile.headline) lines.push('TITLE:' + escapeVCard(profile.headline));
  if (profile.email) lines.push('EMAIL;TYPE=INTERNET:' + escapeVCard(profile.email));
  if (profile.location) lines.push('ADR;TYPE=WORK:;;' + escapeVCard(profile.location) + ';;;;');
  lines.push('URL:' + escapeVCard(site.siteUrl));
  if (profile.bio) lines.push('NOTE:' + escapeVCard(profile.bio));
  lines.push('REV:' + new Date(site.updatedAt).toISOString());
  lines.push('END:VCARD');

  const filename = slugify(profile.name) + '.vcf';

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="' + filename + '"',
      'Cache-Control': 'no-store',
    },
  });
}
