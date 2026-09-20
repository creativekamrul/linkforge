'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { SiteConfig } from '@/lib/types';
import { FONT_KEYS, SECTION_KEYS, THEME_PRESETS } from '@/lib/types';
import {
  Btn,
  Field,
  IconBtn,
  Select,
  TextArea,
  TextInput,
  Toggle,
  listInsert,
  listMove,
  listRemove,
  listReplace,
  useDragList,
} from './ui';

const SECTION_LABELS: Record<string, string> = {
  profile: 'Profile header',
  stats: 'Headline numbers',
  links: 'Link cards',
  stack: 'Tech pills',
  experience: 'Experience timeline',
  socials: 'Social icons',
  actions: 'Share / QR / vCard bar',
  footer: 'Footer',
};

const ICON_KEYS = [
  'link', 'globe', 'github', 'briefcase', 'code', 'mail', 'file', 'video', 'music',
  'cart', 'star', 'map-pin', 'camera', 'users', 'heart', 'shield', 'book', 'sparkles',
];

const CARD_STYLES = ['glass', 'solid', 'outline'];
const RADII = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
const BACKGROUNDS = ['aurora', 'mesh', 'grid', 'dots', 'plain'];

type LinkItem = SiteConfig['links'][number];
type StatItem = SiteConfig['stats'][number];
type ExperienceItem = SiteConfig['experience'][number];
type SocialItem = SiteConfig['socials'][number];
type Status = { ok: boolean; message: string; issues?: string[] } | null;

function Panel({
  title,
  hint,
  open,
  children,
}: {
  title: string;
  hint?: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(Boolean(open));
  return (
    <section className="lf-card w-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="lf-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>
          {'# ' + title}
        </span>
        {hint ? (
          <span className="hidden flex-1 text-[11.5px] sm:block" style={{ color: 'var(--muted)' }}>
            {hint}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        <Btn onClick={() => setShown(!shown)}>{shown ? 'collapse' : 'edit'}</Btn>
      </div>
      {shown ? (
        <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

function ItemCards<T extends Record<string, unknown>>({
  items,
  onChange,
  blank,
  addLabel,
  label,
  render,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  addLabel: string;
  label: (item: T, index: number) => string;
  render: (item: T, set: (patch: Partial<T>) => void, index: number) => React.ReactNode;
}) {
  const drag = useDragList((from, to) => onChange(listMove(items, from, to)));

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-[12.5px]" style={{ color: 'var(--muted)' }}>
          Nothing here yet - add the first one below.
        </p>
      ) : null}

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-[14px] px-3 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <span
              {...drag.handleProps(index)}
              title="Drag to reorder"
              className="cursor-grab select-none px-0.5 text-[13px] tracking-tighter"
              style={{ color: 'var(--muted)' }}
            >
              ::
            </span>
            <span
              className="lf-mono flex-1 truncate text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--muted)' }}
            >
              {label(item, index)}
            </span>
            <IconBtn title="Move up" onClick={() => onChange(listMove(items, index, index - 1))}>
              up
            </IconBtn>
            <IconBtn title="Move down" onClick={() => onChange(listMove(items, index, index + 1))}>
              dn
            </IconBtn>
            <IconBtn title="Duplicate" onClick={() => onChange(listInsert(items, index + 1, structuredClone(item)))}>
              copy
            </IconBtn>
            <IconBtn title="Remove" onClick={() => onChange(listRemove(items, index))}>
              del
            </IconBtn>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {render(item, (patch) => onChange(listReplace(items, index, { ...item, ...patch })), index)}
          </div>
        </div>
      ))}

      <Btn tone="accent" onClick={() => onChange([...items, blank()])}>
        {'+ ' + addLabel}
      </Btn>
    </div>
  );
}

function SectionsEditor({
  sections,
  onChange,
}: {
  sections: string[];
  onChange: (next: string[]) => void;
}) {
  const drag = useDragList((from, to) => onChange(listMove(sections, from, to)));
  const available = SECTION_KEYS.filter((key) => !sections.includes(key));

  return (
    <div>
      <ol className="space-y-2">
        {sections.map((key, index) => (
          <li
            key={key}
            className="flex items-center gap-2 rounded-[10px] px-2.5 py-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <span
              {...drag.handleProps(index)}
              title="Drag to reorder"
              className="cursor-grab select-none tracking-tighter"
              style={{ color: 'var(--muted)' }}
            >
              ::
            </span>
            <span className="flex-1 text-[13px]">{SECTION_LABELS[key] || key}</span>
            <span className="lf-mono hidden text-[10px] sm:block" style={{ color: 'var(--muted)' }}>
              {key}
            </span>
            <IconBtn title="Move up" onClick={() => onChange(listMove(sections, index, index - 1))}>
              up
            </IconBtn>
            <IconBtn title="Move down" onClick={() => onChange(listMove(sections, index, index + 1))}>
              dn
            </IconBtn>
            <IconBtn title="Remove from the page" onClick={() => onChange(listRemove(sections, index))}>
              del
            </IconBtn>
          </li>
        ))}
      </ol>

      {available.length > 0 ? (
        <div className="mt-4">
          <p className="lf-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
            add a component
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {available.map((key: string) => (
              <Btn key={key} tone="accent" onClick={() => onChange([...sections, key])}>
                {'+ ' + (SECTION_LABELS[key] || key)}
              </Btn>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StackEditor({ stack, onChange }: { stack: string[]; onChange: (next: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const drag = useDragList((from, to) => onChange(listMove(stack, from, to)));

  function add() {
    const value = draft.trim();
    if (!value || stack.includes(value)) {
      setDraft('');
      return;
    }
    onChange([...stack, value]);
    setDraft('');
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {stack.length === 0 ? (
          <p className="text-[12.5px]" style={{ color: 'var(--muted)' }}>
            No pills yet - type a technology below.
          </p>
        ) : null}
        {stack.map((tech, index) => (
          <span
            key={tech}
            {...drag.handleProps(index)}
            title="Drag to reorder"
            className="lf-chip inline-flex cursor-grab items-center gap-1.5 px-2.5 py-1.5 text-[12px]"
          >
            {tech}
            <button
              type="button"
              aria-label={'Remove ' + tech}
              onClick={() => onChange(listRemove(stack, index))}
              style={{ color: 'var(--muted)' }}
            >
              x
            </button>
          </span>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <TextInput
          value={draft}
          placeholder="Add a technology, e.g. SvelteKit"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
        />
        <Btn tone="accent" onClick={add}>
          add pill
        </Btn>
      </div>
    </div>
  );
}

function asList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function Dashboard({
  initialConfig,
  configPath,
  loadIssues,
}: {
  initialConfig: SiteConfig | null;
  configPath: string;
  loadIssues: string[];
}) {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(initialConfig);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(initialConfig),
    [config, initialConfig],
  );

  if (!config) {
    return (
      <main className="mx-auto w-full max-w-[700px] px-5 py-16">
        <h1 className="text-[20px] font-semibold">The config file needs fixing first</h1>
        <ul className="mt-4 space-y-1 text-[13px]" style={{ color: 'var(--muted)' }}>
          {loadIssues.map((issue) => (
            <li key={issue}>- {issue}</li>
          ))}
        </ul>
      </main>
    );
  }

  function patch(next: Partial<SiteConfig>) {
    setConfig((current) => (current ? { ...current, ...next } : current));
  }

  async function save() {
    if (!config) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        issues?: string[];
        file?: string;
      };
      if (response.ok && data.ok) {
        setStatus({ ok: true, message: 'Saved to ' + (data.file || configPath) });
        router.refresh();
      } else {
        setStatus({ ok: false, message: data.error || 'Save failed', issues: data.issues });
      }
    } catch (error) {
      setStatus({ ok: false, message: error instanceof Error ? error.message : 'Save failed' });
    }
    setBusy(false);
  }

  async function signOut() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.replace('/admin/login');
    router.refresh();
  }

  const theme = config.theme;

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6">
      <header
        className="lf-card sticky top-3 z-10 flex flex-wrap items-center gap-2 px-4 py-3"
        style={{ background: 'var(--surface-strong)' }}
      >
        <div className="flex-1">
          <h1 className="text-[15px] font-semibold tracking-[-0.01em]">LinkForge dashboard</h1>
          <p className="lf-mono text-[10.5px]" style={{ color: 'var(--muted)' }}>
            {configPath}
          </p>
        </div>
        <span
          className="lf-mono text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: dirty ? 'var(--accent)' : 'var(--muted)' }}
        >
          {dirty ? 'unsaved changes' : 'in sync'}
        </span>
        <Btn onClick={signOut}>sign out</Btn>
        <Link href="/" target="_blank" className="lf-chip px-3 py-1.5 text-[12.5px]" style={{ borderColor: 'var(--border)' }}>
          view page
        </Link>
        <Btn tone="accent" onClick={save} disabled={busy || !dirty}>
          {busy ? 'saving...' : 'save'}
        </Btn>
      </header>

      {status ? (
        <div
          className="mt-4 rounded-[12px] px-4 py-3 text-[12.5px]"
          style={{
            background: status.ok ? 'var(--accent-soft)' : 'rgba(248,113,113,0.12)',
            border: '1px solid var(--border)',
          }}
        >
          <p>{status.message}</p>
          {status.issues?.length ? (
            <ul className="mt-2 space-y-1" style={{ color: 'var(--muted)' }}>
              {status.issues.map((issue) => (
                <li key={issue}>- {issue}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-4">
        <Panel title="page layout" hint="drag blocks to reorder, add or remove components" open>
          <SectionsEditor sections={config.sections} onChange={(next) => patch({ sections: next as SiteConfig['sections'] })} />
        </Panel>

        <Panel title="profile" hint="name, tagline, avatar and status chip">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="name">
              <TextInput value={config.profile.name} onChange={(e) => patch({ profile: { ...config.profile, name: e.target.value } })} />
            </Field>
            <Field label="headline">
              <TextInput
                value={config.profile.headline || ''}
                placeholder="Full-Stack Developer"
                onChange={(e) => patch({ profile: { ...config.profile, headline: e.target.value } })}
              />
            </Field>
            <Field label="tagline" wide>
              <TextInput
                value={config.profile.tagline || ''}
                placeholder="One line that says what you do"
                onChange={(e) => patch({ profile: { ...config.profile, tagline: e.target.value } })}
              />
            </Field>
            <Field label="bio" wide>
              <TextArea value={config.profile.bio || ''} onChange={(e) => patch({ profile: { ...config.profile, bio: e.target.value } })} />
            </Field>
            <Field label="avatar url" hint="a path like /avatar.svg, or a full url">
              <TextInput value={config.profile.avatar || ''} onChange={(e) => patch({ profile: { ...config.profile, avatar: e.target.value } })} />
            </Field>
            <Field label="location">
              <TextInput value={config.profile.location || ''} onChange={(e) => patch({ profile: { ...config.profile, location: e.target.value } })} />
            </Field>
            <Field label="email">
              <TextInput value={config.profile.email || ''} onChange={(e) => patch({ profile: { ...config.profile, email: e.target.value } })} />
            </Field>
            <Field label="status text" hint="empty removes the chip">
              <TextInput
                value={config.profile.status?.text || ''}
                onChange={(e) =>
                  patch({
                    profile: {
                      ...config.profile,
                      status: e.target.value.trim() ? { ...config.profile.status, text: e.target.value } : undefined,
                    },
                  })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Toggle
                label="show the verified tick next to the name"
                checked={config.profile.verified}
                onChange={(next) => patch({ profile: { ...config.profile, verified: next } })}
              />
            </div>
          </div>
        </Panel>

        <Panel title="theme" hint="preset, colours and typefaces">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="preset">
              <Select value={theme.preset} options={THEME_PRESETS} onChange={(value) => patch({ theme: { ...theme, preset: value as typeof theme.preset } })} />
            </Field>
            <Field label="background style">
              <Select value={theme.backgroundStyle} options={BACKGROUNDS} onChange={(value) => patch({ theme: { ...theme, backgroundStyle: value as typeof theme.backgroundStyle } })} />
            </Field>
            <Field label="card style">
              <Select value={theme.card} options={CARD_STYLES} onChange={(value) => patch({ theme: { ...theme, card: value as typeof theme.card } })} />
            </Field>
            <Field label="corner radius">
              <Select value={theme.radius} options={RADII} onChange={(value) => patch({ theme: { ...theme, radius: value as typeof theme.radius } })} />
            </Field>
            <Field label="body font">
              <Select value={theme.font} options={FONT_KEYS} onChange={(value) => patch({ theme: { ...theme, font: value as typeof theme.font } })} />
            </Field>
            <Field label="display font" hint="used for big numbers and the tagline">
              <Select value={theme.displayFont} options={FONT_KEYS} onChange={(value) => patch({ theme: { ...theme, displayFont: value as typeof theme.displayFont } })} />
            </Field>
            <Field label="accent" hint="empty = take it from the preset">
              <TextInput
                value={theme.accent || ''}
                placeholder="#7C5CFF"
                onChange={(e) => patch({ theme: { ...theme, accent: e.target.value.trim() || undefined } })}
              />
            </Field>
            <Field label="second accent">
              <TextInput
                value={theme.accent2 || ''}
                placeholder="#22D3EE"
                onChange={(e) => patch({ theme: { ...theme, accent2: e.target.value.trim() || undefined } })}
              />
            </Field>
            <Field label="background colour">
              <TextInput
                value={theme.background || ''}
                placeholder="empty = from preset"
                onChange={(e) => patch({ theme: { ...theme, background: e.target.value.trim() || undefined } })}
              />
            </Field>
            <Field label="text colour">
              <TextInput
                value={theme.text || ''}
                placeholder="empty = from preset"
                onChange={(e) => patch({ theme: { ...theme, text: e.target.value.trim() || undefined } })}
              />
            </Field>
            <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
              <Toggle label="avatar ring" checked={theme.avatarRing} onChange={(next) => patch({ theme: { ...theme, avatarRing: next } })} />
              <Toggle label="animations" checked={theme.animations} onChange={(next) => patch({ theme: { ...theme, animations: next } })} />
            </div>
          </div>
        </Panel>

        <Panel title="headline numbers" hint="the proof strip under your profile">
          <ItemCards<StatItem>
            items={config.stats}
            onChange={(next) => patch({ stats: next })}
            blank={() => ({ value: '10+', label: 'things done' })}
            addLabel="add a number"
            label={(item) => item.value + ' ' + item.label}
            render={(item, set) => (
              <>
                <Field label="value">
                  <TextInput value={item.value} onChange={(e) => set({ value: e.target.value })} />
                </Field>
                <Field label="label">
                  <TextInput value={item.label} onChange={(e) => set({ label: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Panel>

        <Panel title="link cards" hint="group them, tag them, drag them">
          <ItemCards<LinkItem>
            items={config.links}
            onChange={(next) => patch({ links: next })}
            blank={() => ({ label: 'New link', url: 'https://', group: config.links[0]?.group || 'Links', stack: [], featured: false })}
            addLabel="add a link card"
            label={(item) => (item.group ? item.group + ' / ' + item.label : item.label)}
            render={(item, set) => (
              <>
                <Field label="label">
                  <TextInput value={item.label} onChange={(e) => set({ label: e.target.value })} />
                </Field>
                <Field label="url">
                  <TextInput value={item.url} onChange={(e) => set({ url: e.target.value })} />
                </Field>
                <Field label="group" hint="links with the same group share a heading">
                  <TextInput value={item.group || ''} onChange={(e) => set({ group: e.target.value })} />
                </Field>
                <Field label="icon" hint="brand slug or icon name">
                  <Select value={item.icon || 'link'} options={ICON_KEYS} onChange={(value) => set({ icon: value })} />
                </Field>
                <Field label="description" wide>
                  <TextArea value={item.description || ''} onChange={(e) => set({ description: e.target.value })} />
                </Field>
                <Field label="badge" hint="e.g. new, repo, live">
                  <TextInput value={item.badge || ''} onChange={(e) => set({ badge: e.target.value })} />
                </Field>
                <Field label="tech tags" hint="comma separated">
                  <TextInput value={(item.stack || []).join(', ')} onChange={(e) => set({ stack: asList(e.target.value) })} />
                </Field>
                <div className="sm:col-span-2">
                  <Toggle label="featured - bigger card with the accent border" checked={item.featured} onChange={(next) => set({ featured: next })} />
                </div>
              </>
            )}
          />
        </Panel>

        <Panel title="tech pills" hint="your toolkit, with brand glyphs">
          <StackEditor stack={config.stack} onChange={(next) => patch({ stack: next })} />
        </Panel>

        <Panel title="experience" hint="the resume timeline">
          <ItemCards<ExperienceItem>
            items={config.experience}
            onChange={(next) => patch({ experience: next })}
            blank={() => ({ role: 'New role', company: '', period: '', summary: '', tags: [] })}
            addLabel="add a role"
            label={(item) => item.role + (item.company ? ' at ' + item.company : '')}
            render={(item, set) => (
              <>
                <Field label="role">
                  <TextInput value={item.role} onChange={(e) => set({ role: e.target.value })} />
                </Field>
                <Field label="company">
                  <TextInput value={item.company || ''} onChange={(e) => set({ company: e.target.value })} />
                </Field>
                <Field label="period" hint="e.g. 2025 - Present">
                  <TextInput value={item.period || ''} onChange={(e) => set({ period: e.target.value })} />
                </Field>
                <Field label="link">
                  <TextInput value={item.url || ''} placeholder="https://" onChange={(e) => set({ url: e.target.value })} />
                </Field>
                <Field label="summary" wide>
                  <TextArea value={item.summary || ''} onChange={(e) => set({ summary: e.target.value })} />
                </Field>
                <Field label="tags" hint="comma separated" wide>
                  <TextInput value={(item.tags || []).join(', ')} onChange={(e) => set({ tags: asList(e.target.value) })} />
                </Field>
              </>
            )}
          />
        </Panel>

        <Panel title="social icons" hint="the row of round buttons">
          <ItemCards<SocialItem>
            items={config.socials}
            onChange={(next) => patch({ socials: next })}
            blank={() => ({ platform: 'github', url: 'https://' })}
            addLabel="add a social"
            label={(item) => item.platform}
            render={(item, set) => (
              <>
                <Field label="platform" hint="github, linkedin, x, youtube, email...">
                  <TextInput value={item.platform} onChange={(e) => set({ platform: e.target.value })} />
                </Field>
                <Field label="url">
                  <TextInput value={item.url} onChange={(e) => set({ url: e.target.value })} />
                </Field>
                <Field label="tooltip label" wide>
                  <TextInput value={item.label || ''} onChange={(e) => set({ label: e.target.value })} />
                </Field>
              </>
            )}
          />
        </Panel>

        <Panel title="settings, footer and SEO" hint="the plumbing">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="site url">
              <TextInput value={config.site.url || ''} onChange={(e) => patch({ site: { ...config.site, url: e.target.value } })} />
            </Field>
            <Field label="language">
              <TextInput value={config.site.language} onChange={(e) => patch({ site: { ...config.site, language: e.target.value } })} />
            </Field>
            <Field label="footer text">
              <TextInput value={config.footer.text || ''} onChange={(e) => patch({ footer: { ...config.footer, text: e.target.value } })} />
            </Field>
            <Field label="seo title">
              <TextInput value={config.seo.title || ''} onChange={(e) => patch({ seo: { ...config.seo, title: e.target.value } })} />
            </Field>
            <Field label="seo description" wide>
              <TextArea value={config.seo.description || ''} onChange={(e) => patch({ seo: { ...config.seo, description: e.target.value } })} />
            </Field>
            <Field label="seo keywords" hint="comma separated" wide>
              <TextInput value={(config.seo.keywords || []).join(', ')} onChange={(e) => patch({ seo: { ...config.seo, keywords: asList(e.target.value) } })} />
            </Field>
            <div className="sm:col-span-2 grid gap-2 sm:grid-cols-2">
              <Toggle label="open links in a new tab" checked={config.settings.openLinksInNewTab} onChange={(next) => patch({ settings: { ...config.settings, openLinksInNewTab: next } })} />
              <Toggle label="share button" checked={config.settings.showShareButton} onChange={(next) => patch({ settings: { ...config.settings, showShareButton: next } })} />
              <Toggle label="qr code button" checked={config.settings.showQrCode} onChange={(next) => patch({ settings: { ...config.settings, showQrCode: next } })} />
              <Toggle label="save contact button" checked={config.settings.showSaveContact} onChange={(next) => patch({ settings: { ...config.settings, showSaveContact: next } })} />
              <Toggle label="footer credit line" checked={config.footer.branding} onChange={(next) => patch({ footer: { ...config.footer, branding: next } })} />
            </div>
          </div>
        </Panel>
      </div>

      <p className="mt-6 text-center text-[12px]" style={{ color: 'var(--muted)' }}>
        Everything here is written straight into your JSON file - the public page picks it up on the next refresh.
      </p>
    </main>
  );
}
