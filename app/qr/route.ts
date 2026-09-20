import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { safeLoadSite } from '@/lib/config';

export const dynamic = 'force-dynamic';

const HEX = /^#[0-9a-fA-F]{3,8}$/;

function colour(value: string | null, fallback: string): string {
  return value && HEX.test(value) ? value : fallback;
}

export async function GET(request: Request) {
  const { site } = safeLoadSite();
  const url = new URL(request.url);
  const target = url.searchParams.get('target') || (site ? site.siteUrl : url.origin);

  const svg = await QRCode.toString(target, {
    type: 'svg',
    margin: 1,
    width: 512,
    errorCorrectionLevel: 'M',
    color: {
      dark: colour(url.searchParams.get('color'), '#0B0D17'),
      light: colour(url.searchParams.get('bg'), '#FFFFFF'),
    },
  });

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
