import { z } from 'zod';

/** Any URL we are willing to render: absolute web, mailto, tel or a local path. */
const URL_PATTERN = /^(https?:\/\/|mailto:|tel:|\/)/i;

const urlSchema = z
  .string()
  .trim()
  .min(1, 'is required')
  .refine((value) => URL_PATTERN.test(value), {
    message: 'must start with https://, http://, mailto:, tel: or /',
  });

export const THEME_PRESETS = [
  'midnight',
  'aurora',
  'sunset',
  'ocean',
  'forest',
  'mono',
  'paper',
  'terminal',
  'cream',
] as const;

export const FONT_KEYS = [
  'inter',
  'manrope',
  'geist',
  'plus-jakarta',
  'space-grotesk',
  'jetbrains-mono',
  'playfair',
  'dm-sans',
  'instrument-serif',
] as const;

/** The blocks of a page, in the order they render. The dashboard adds, removes and reorders these. */
export const SECTION_KEYS = [
  'profile',
  'stats',
  'links',
  'stack',
  'experience',
  'socials',
  'actions',
  'footer',
] as const;

export const linkSchema = z.object({
  label: z.string().trim().min(1, 'is required'),
  url: urlSchema,
  description: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  group: z.string().trim().optional(),
  /** Small monospace tech tags under the description, e.g. ["React", "Node.js"]. */
  stack: z.array(z.string().trim().min(1)).optional().default([]),
  featured: z.boolean().optional().default(false),
  openInNewTab: z.boolean().optional(),
});

export const socialSchema = z.object({
  platform: z.string().trim().min(1, 'is required'),
  url: urlSchema,
  label: z.string().trim().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'is required'),
  headline: z.string().trim().optional(),
  /** Big display line under the name, rendered in the serif display face. */
  tagline: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  avatar: z.string().trim().optional(),
  location: z.string().trim().optional(),
  email: z.string().trim().optional(),
  verified: z.boolean().optional().default(false),
  status: z
    .object({
      text: z.string().trim().min(1, 'is required'),
      emoji: z.string().trim().optional(),
    })
    .optional(),
});

export const themeSchema = z.object({
  preset: z.enum(THEME_PRESETS).optional().default('midnight'),
  mode: z.enum(['dark', 'light']).optional(),
  accent: z.string().trim().optional(),
  accent2: z.string().trim().optional(),
  background: z.string().trim().optional(),
  text: z.string().trim().optional(),
  card: z.enum(['glass', 'solid', 'outline']).optional().default('glass'),
  radius: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).optional().default('xl'),
  font: z.enum(FONT_KEYS).optional().default('inter'),
  /** Second face, used for big numbers and the profile tagline. */
  displayFont: z.enum(FONT_KEYS).optional().default('inter'),
  backgroundStyle: z.enum(['aurora', 'mesh', 'grid', 'dots', 'plain']).optional().default('aurora'),
  avatarRing: z.boolean().optional().default(true),
  animations: z.boolean().optional().default(true),
});

/** A headline number, e.g. { value: "100+", label: "projects shipped" }. */
export const statSchema = z.object({
  value: z.string().trim().min(1, 'is required'),
  label: z.string().trim().min(1, 'is required'),
});

/** One role in the experience timeline. */
export const experienceSchema = z.object({
  role: z.string().trim().min(1, 'is required'),
  company: z.string().trim().optional(),
  period: z.string().trim().optional(),
  summary: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1)).optional().default([]),
  url: urlSchema.optional(),
});

export const settingsSchema = z.object({
  openLinksInNewTab: z.boolean().optional().default(true),
  showShareButton: z.boolean().optional().default(true),
  showQrCode: z.boolean().optional().default(true),
  showSaveContact: z.boolean().optional().default(true),
});

export const seoSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  keywords: z.array(z.string().trim()).optional(),
  ogImage: z.string().trim().optional(),
});

export const siteSchema = z.object({
  url: z.string().trim().optional(),
  language: z.string().trim().optional().default('en'),
});

export const footerSchema = z.object({
  text: z.string().trim().optional(),
  branding: z.boolean().optional().default(true),
});

export const siteConfigSchema = z.object({
  // Preserved so an editor can still resolve ./site.schema.json after a save.
  $schema: z.string().trim().optional(),
  site: siteSchema.optional().default({}),
  profile: profileSchema,
  theme: themeSchema.optional().default({}),
  links: z.array(linkSchema).optional().default([]),
  socials: z.array(socialSchema).optional().default([]),
  stats: z.array(statSchema).optional().default([]),
  stack: z.array(z.string().trim().min(1)).optional().default([]),
  experience: z.array(experienceSchema).optional().default([]),
  settings: settingsSchema.optional().default({}),
  seo: seoSchema.optional().default({}),
  footer: footerSchema.optional().default({}),

  /** Order of the page blocks. A block that is not listed here is not rendered. */
  sections: z.array(z.enum(SECTION_KEYS)).optional().default([...SECTION_KEYS]),
  // Allow $schema and any extra keys without failing validation.
});

export type SectionKey = (typeof SECTION_KEYS)[number];
export type LinkItem = z.infer<typeof linkSchema>;
export type SocialItem = z.infer<typeof socialSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ThemeInput = z.infer<typeof themeSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Footer = z.infer<typeof footerSchema>;
export type StatItem = z.infer<typeof statSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
