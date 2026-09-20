import type { MetadataRoute } from 'next';
import { safeLoadSite } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const { site } = safeLoadSite();
  if (!site) return [];
  return [
    {
      url: site.siteUrl + '/',
      lastModified: new Date(site.updatedAt),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
