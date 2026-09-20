import type { StatItem } from '@/lib/types';

/**
 * The "proven in the real world" strip: big numbers in the display serif,
 * labels in monospace. Renders nothing when the stats array is empty.
 */
export function StatsBar({ stats }: { stats: StatItem[] }) {
  if (stats.length === 0) return null;

  return (
    <div className="lf-enter mt-8 w-full" style={{ animationDelay: '120ms' }}>
      <div className="lf-card overflow-hidden">
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(' + stats.length + ', minmax(0, 1fr))' }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 px-3 py-4 text-center"
              style={{ borderLeft: index === 0 ? undefined : '1px solid var(--border)' }}
            >
              <span className="lf-stat-value">{stat.value}</span>
              <span
                className="lf-mono text-[10px] uppercase tracking-[0.14em]"
                style={{ color: 'var(--muted)' }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
