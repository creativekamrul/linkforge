import { Icon } from '@/lib/icons';
import { BrandGlyph, brandIcon } from '@/lib/brand-icons';
import type { LinkItem } from '@/lib/types';
import { cx } from '@/lib/utils';

type Group = { title: string | null; links: Array<{ link: LinkItem; index: number }> };

/** Links keep their order; a new heading starts whenever links[].group changes. */
function groupLinks(links: LinkItem[]): Group[] {
  const groups: Group[] = [];
  links.forEach((link, index) => {
    const title = link.group && link.group.trim() ? link.group.trim() : null;
    const last = groups[groups.length - 1];
    if (last && last.title === title) last.links.push({ link, index });
    else groups.push({ title, links: [{ link, index }] });
  });
  return groups;
}

function LinkRow({
  link,
  index,
  defaultNewTab,
}: {
  link: LinkItem;
  index: number;
  defaultNewTab: boolean;
}) {
  const brand = link.icon ? brandIcon(link.icon) : null;
  const external = /^https?:/i.test(link.url);
  const newTab = link.openInNewTab === undefined ? defaultNewTab : link.openInNewTab;
  const target = newTab && external ? '_blank' : undefined;

  return (
    <li className="lf-enter" style={{ animationDelay: 140 + index * 45 + 'ms' }}>
      <a
        href={link.url}
        target={target}
        rel={target ? 'noopener noreferrer' : undefined}
        className={cx(
          'lf-link lf-card lf-focus group flex w-full items-center gap-3.5 px-4 py-3.5 no-underline',
          link.featured && 'lf-featured',
        )}
        style={{ color: link.featured ? '#ffffff' : 'var(--text)' }}
      >
        <span className="lf-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]">
          {brand ? (
            <BrandGlyph path={brand.path} className="h-[19px] w-[19px]" />
          ) : (
            <Icon name={link.icon} className="h-[19px] w-[19px]" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[15px] font-medium tracking-[-0.01em]">{link.label}</span>
            {link.badge ? (
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]"
                style={
                  link.featured
                    ? { background: 'rgba(255,255,255,0.24)', color: '#ffffff' }
                    : { background: 'var(--accent-soft)', color: 'var(--accent)' }
                }
              >
                {link.badge}
              </span>
            ) : null}
          </span>

          {link.description ? (
            <span
              className="lf-sub mt-0.5 block text-[12.5px] leading-snug"
              style={{ color: link.featured ? 'rgba(255,255,255,0.82)' : 'var(--muted)' }}
            >
              {link.description}
            </span>
          ) : null}

          {link.stack.length > 0 ? (
            <span className="mt-2 flex flex-wrap gap-1.5">
              {link.stack.map((tech) => (
                <span key={tech} className="lf-tag">
                  {tech}
                </span>
              ))}
            </span>
          ) : null}
        </span>

        <Icon
          name="arrow-up-right"
          className="h-4 w-4 shrink-0 self-start opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-90"
        />
      </a>
    </li>
  );
}

export function LinkList({
  links,
  defaultNewTab,
}: {
  links: LinkItem[];
  defaultNewTab: boolean;
}) {
  if (links.length === 0) {
    return (
      <p className="lf-enter text-center text-[13px]" style={{ color: 'var(--muted)' }}>
        No links yet - add some to the top-level &quot;links&quot; array in data/site.json.
      </p>
    );
  }

  const groups = groupLinks(links);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, groupIndex) => (
        <section key={(group.title || 'links') + groupIndex}>
          {group.title ? <h2 className="lf-kicker">{group.title}</h2> : null}
          <ul className="flex flex-col gap-2.5">
            {group.links.map((entry) => (
              <LinkRow
                key={entry.link.label + entry.link.url + entry.index}
                link={entry.link}
                index={entry.index}
                defaultNewTab={defaultNewTab}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
