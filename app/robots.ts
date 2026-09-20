import type { MetadataRoute } from 'next';
import { safeLoadSite } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const { site } = safeLoadSite();
  const base = site ? site.siteUrl : '';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: base ? base + '/sitemap.xml' : undefined,
  };
}
