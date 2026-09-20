import type { Metadata, Viewport } from 'next';
import './globals.css';
import { safeLoadSite } from '@/lib/config';
import { resolveTheme, themeStyleSheet } from '@/lib/theme';

/** Used only when site.json is missing or broken, so the shell still renders. */
const FALLBACK_THEME = resolveTheme();

export async function generateMetadata(): Promise<Metadata> {
  const { site } = safeLoadSite();
  if (!site) return { title: 'Link page', robots: { index: false, follow: false } };

  const { config, siteUrl } = site;
  const { profile, seo } = config;
  const title = seo.title || profile.name + (profile.headline ? ' - ' + profile.headline : '');
  const description = seo.description || profile.bio || profile.headline || '';
  // Only a raster avatar makes a usable social preview; an SVG placeholder does not.
  const raster =
    profile.avatar && /\.(png|jpe?g|webp|avif)$/i.test(profile.avatar) ? profile.avatar : null;
  const images = seo.ogImage ? [seo.ogImage] : raster ? [raster] : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: seo.keywords,
    applicationName: profile.name,
    authors: [{ name: profile.name }],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: siteUrl,
      siteName: profile.name,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
    robots: { index: true, follow: true },
  };
}

export function generateViewport(): Viewport {
  const { site } = safeLoadSite();
  const theme = site ? site.theme : FALLBACK_THEME;
  return { themeColor: theme.background, colorScheme: theme.mode };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { site } = safeLoadSite();
  const theme = site ? site.theme : FALLBACK_THEME;
  const language = site ? site.config.site.language : 'en';

  return (
    <html
      lang={language}
      data-card={theme.card}
      data-anim={theme.animations ? 'on' : 'off'}
      suppressHydrationWarning
    >
      <body>
        {/* React hoists these into <head>. The webfont import must stay first. */}
        <style
          href="linkforge-theme"
          precedence="high"
          dangerouslySetInnerHTML={{ __html: themeStyleSheet(theme) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {children}
      </body>
    </html>
  );
}
