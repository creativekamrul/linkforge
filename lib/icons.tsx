import type { ReactNode } from 'react';

export type IconProps = {
  name?: string;
  className?: string;
  strokeWidth?: number;
};

/**
 * Hand-built 24x24 stroke icons. Keys are what you write in site.json
 * (links[].icon). Anything unknown falls back to the globe.
 */
const PATHS: Record<string, ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3.6 3 14.4 0 18c-3-3.6-3-14.4 0-18" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.1-2.1a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.1 2.1a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7" />
      <path d="M3 12.5h18" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </>
  ),
  file: (
    <>
      <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8Z" />
      <path d="M14 3v5h5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.2 7.5-5.2" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="19.5" r="1.5" />
      <circle cx="17.5" cy="19.5" r="1.5" />
      <path d="M2.5 3.5h2.4l2.4 11.2a1.8 1.8 0 0 0 1.8 1.4h8.2a1.8 1.8 0 0 0 1.8-1.5L21 7H5.6" />
    </>
  ),
  podcast: (
    <>
      <circle cx="12" cy="10.5" r="2.8" />
      <path d="M7.5 17.6a6.5 6.5 0 1 1 9 0" />
      <path d="M12 14v7" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8.5h13V14a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M17 10h1.8a2.6 2.6 0 0 1 0 5.2H17" />
      <path d="M4.5 21.5h12" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2.2-1 2.2-2s-.8-2-2.2-2h-.6a2 2 0 0 1 0-4H15a6 6 0 0 0 6-6c0-2.4-3.5-4-9-4Z" />
      <circle cx="7.6" cy="12.4" r="1" />
      <circle cx="11" cy="7.8" r="1" />
      <circle cx="16" cy="9.4" r="1" />
    </>
  ),
  code: (
    <>
      <path d="M9 7 4.5 12 9 17" />
      <path d="M15 7l4.5 5L15 17" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6" width="14" height="12" rx="2.5" />
      <path d="M16.5 10.5 21 8v8l-4.5-2.5Z" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h2.8l1.4-2h7.6l1.4 2H20a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6.2l10-2v11.6" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="15.8" r="2.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5Z" />
      <path d="M19 15.5H6.5A2.5 2.5 0 0 0 4 18" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.2-4.5-7.2-9.4A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 7.2 3.1C19.2 15.5 12 20 12 20Z" />
  ),
  star: (
    <path d="m12 3.6 2.6 5.5 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 10l6-.9Z" />
  ),
  'map-pin': (
    <>
      <path d="M12 21s6.5-6.1 6.5-11A6.5 6.5 0 0 0 5.5 10c0 4.9 6.5 11 6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path d="M7 3.5h2.6l1.5 3.8-2 1.4a11.6 11.6 0 0 0 5.2 5.2l1.4-2 3.8 1.5V17a2.5 2.5 0 0 1-2.7 2.5A15.8 15.8 0 0 1 4.5 6.2A2.5 2.5 0 0 1 7 3.5Z" />
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4 20.5h16" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m10 8.4 6 3.6-6 3.6Z" />
    </>
  ),
  rss: (
    <>
      <path d="M4.5 11.5a8 8 0 0 1 8 8" />
      <path d="M4.5 4.5a15 15 0 0 1 15 15" />
      <circle cx="5.5" cy="18.5" r="1.4" />
    </>
  ),
  sparkles: (
    <>
      <path d="m11 4 1.5 4.1L16.6 9.6l-4.1 1.5L11 15.2 9.5 11.1 5.4 9.6l4.1-1.5Z" />
      <path d="m18 14.5.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z" />
    </>
  ),
  zap: <path d="M13.5 2.5 4.5 13.5h6l-1 8 9-11h-6Z" />,
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3 3-4.6 6-4.6s5.4 1.6 6 4.6" />
      <path d="M16.5 6.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.5 15.3c2 .5 3.4 1.9 3.8 4.2" />
    </>
  ),
  message: (
    <path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.7-.4L4.5 20.5l1.2-3.6a6.9 6.9 0 0 1-2.2-4.7C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2Z" />
  ),
  send: <path d="M21 3 3 10.5l7.5 3L13.5 21Z" />,
  trophy: (
    <>
      <path d="M7.5 4h9v5.5a4.5 4.5 0 0 1-9 0Z" />
      <path d="M7.5 5.5H5v1.8a3 3 0 0 0 2.6 3" />
      <path d="M16.5 5.5H19v1.8a3 3 0 0 1-2.6 3" />
      <path d="M10 13.5V16h4v-2.5" />
      <path d="M8 20.5h8" />
    </>
  ),
  graduation: (
    <>
      <path d="M12 4 2.5 8.6 12 13.2l9.5-4.6Z" />
      <path d="M6.5 11v5c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-5" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8.5" width="17" height="12" rx="2" />
      <path d="M3.5 13h17" />
      <path d="M12 8.5v12" />
      <path d="M12 8.5C10.5 5 9 3.5 7.5 4.4S7 7.6 9 8.5Z" />
      <path d="M12 8.5C13.5 5 15 3.5 16.5 4.4S17 7.6 15 8.5Z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17.5 5-5 4 4 3-2.5 4 3.5" />
    </>
  ),
  shield: <path d="M12 3 5 5.8v5.4c0 4.3 3 7.9 7 9.8 4-1.9 7-5.5 7-9.8V5.8Z" />,
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4.5A2.5 2.5 0 0 1 15.5 21h-9A2.5 2.5 0 0 1 4 18.5v-9A2.5 2.5 0 0 1 6.5 7H11" />
    </>
  ),
  share: (
    <>
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2.5" />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-7A2.5 2.5 0 0 0 3 6.5v7A2.5 2.5 0 0 0 5.5 16" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.5" />
      <path d="M14 14h2.5v2.5H14z" />
      <path d="M18.5 18.5H20.5V20.5H18.5z" />
      <path d="M14 20.5h2" />
      <path d="M20.5 14v2" />
    </>
  ),
  contact: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <circle cx="8.5" cy="10.6" r="2" />
      <path d="M5.2 16.4c.8-1.6 1.9-2.4 3.3-2.4s2.5.8 3.3 2.4" />
      <path d="M14.5 10.2h4.5" />
      <path d="M14.5 13.8h4.5" />
    </>
  ),
  check: <path d="m5 12.8 4.4 4.4L19 6.6" />,
  'check-badge': (
    <>
      <path d="M12 2.8 14.3 4.6l2.8-.2 1.1 2.6 2.4 1.5-.6 2.7.6 2.7-2.4 1.5-1.1 2.6-2.8-.2L12 21.2l-2.3-1.8-2.8.2-1.1-2.6L3.4 15.5l.6-2.7-.6-2.7 2.4-1.5L6.9 4.4l2.8.2Z" />
      <path d="m8.6 12.3 2.3 2.3 4.5-4.8" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
};

const ALIASES: Record<string, string> = {
  website: 'globe',
  web: 'globe',
  url: 'link',
  resume: 'file',
  cv: 'file',
  pdf: 'file',
  shop: 'cart',
  store: 'cart',
  email: 'mail',
  newsletter: 'mail',
  call: 'phone',
  event: 'calendar',
  booking: 'calendar',
  work: 'briefcase',
  job: 'briefcase',
  app: 'download',
  blog: 'book',
  photo: 'camera',
  support: 'heart',
  donate: 'coffee',
  tip: 'coffee',
  course: 'graduation',
  'map-pin': 'map-pin',
  location: 'map-pin',
  project: 'code',
  'arrow-up-right': 'arrow-up-right',
};

export function resolveIconName(name?: string): string {
  if (!name) return 'globe';
  const key = name.trim().toLowerCase();
  if (PATHS[key]) return key;
  if (ALIASES[key] && PATHS[ALIASES[key]]) return ALIASES[key];
  return 'globe';
}

export function Icon({ name, className, strokeWidth = 1.7 }: IconProps) {
  const key = resolveIconName(name);
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[key]}
    </svg>
  );
}

export function availableIconNames(): string[] {
  return Object.keys(PATHS).sort();
}
