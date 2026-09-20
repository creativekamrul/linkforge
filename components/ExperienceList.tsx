import type { ExperienceItem } from '@/lib/types';

/** Compact résumé timeline: monospace dates, role, company and optional tags. */
export function ExperienceList({ experience }: { experience: ExperienceItem[] }) {
  if (experience.length === 0) return null;

  return (
    <section className="lf-enter w-full" style={{ animationDelay: '660ms' }}>
      <h2 className="lf-kicker">experience</h2>
      <ol className="lf-timeline">
        {experience.map((item) => (
          <li key={item.role + (item.company || '')} className="lf-timeline-item">
            <span className="lf-timeline-dot" aria-hidden="true" />
            {item.period ? (
              <p className="lf-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--muted)' }}>
                {item.period}
              </p>
            ) : null}
            <p className="mt-1 text-[14.5px] font-semibold tracking-[-0.01em]">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="lf-focus no-underline">
                  {item.role}
                </a>
              ) : (
                item.role
              )}
              {item.company ? (
                <span className="font-normal" style={{ color: 'var(--muted)' }}>
                  {' - '}
                  {item.company}
                </span>
              ) : null}
            </p>
            {item.summary ? (
              <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                {item.summary}
              </p>
            ) : null}
            {item.tags && item.tags.length > 0 ? (
              <span className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="lf-tag">
                    {tag}
                  </span>
                ))}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
