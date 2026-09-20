import { BrandGlyph, brandIcon } from '@/lib/brand-icons';

/** Fallback tile for tech names simple-icons does not carry, e.g. "JetEngine" -> "JE". */
function monogram(name: string): string {
  const words = name.replace(/[^A-Za-z0-9+.# ]/g, ' ').trim().split(/\s+/);
  if (words.length > 1) return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  return name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
}

/**
 * The technology toolkit: one chip per tool, each resolved to its official
 * brand glyph when simple-icons has one, otherwise a monospace monogram.
 */
export function StackRow({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null;

  return (
    <section className="lf-enter w-full" style={{ animationDelay: '600ms' }}>
      <h2 className="lf-kicker">stack</h2>
      <ul className="flex flex-wrap gap-2">
        {stack.map((name) => {
          const brand = brandIcon(name);
          return (
            <li key={name}>
              <span className="lf-chip lf-stack-chip inline-flex items-center gap-1.5 px-2.5 py-1.5">
                {brand ? (
                  <BrandGlyph path={brand.path} className="h-[13px] w-[13px]" />
                ) : (
                  <span className="lf-mono text-[9.5px] font-semibold tracking-[0.04em]">
                    {monogram(name)}
                  </span>
                )}
                <span className="lf-mono text-[11.5px]">{name}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
