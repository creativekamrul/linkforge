import { NextResponse } from 'next/server';
import { CONFIG_PATH, safeLoadSite } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { site, error } = safeLoadSite();

  const body = {
    status: site ? 'ok' : 'config_error',
    configFile: CONFIG_PATH,
    updatedAt: site ? site.updatedAt : null,
    profile: site ? site.config.profile.name : null,
    counts: site
      ? {
          links: site.config.links.length,
          socials: site.config.socials.length,
          stats: site.config.stats.length,
          stack: site.config.stack.length,
          experience: site.config.experience.length,
        }
      : null,
    issues: error ? error.issues : [],
  };

  return NextResponse.json(body, {
    status: site ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
