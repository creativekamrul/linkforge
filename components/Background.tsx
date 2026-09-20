import type { ResolvedTheme } from '@/lib/theme';
import { hexToRgba } from '@/lib/theme';

const MASK = 'radial-gradient(ellipse 80% 60% at 50% 22%, black 12%, transparent 74%)';

export function Background({ theme }: { theme: ResolvedTheme }) {
  const style = theme.backgroundStyle;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {style === 'aurora' ? (
        <>
          <div
            className="lf-blob"
            style={{ background: theme.accent, width: '58vmax', height: '58vmax', top: '-24vmax', left: '-18vmax' }}
          />
          <div
            className="lf-blob"
            style={{
              background: theme.accent2,
              width: '50vmax',
              height: '50vmax',
              bottom: '-22vmax',
              right: '-16vmax',
              animationDelay: '-9s',
              animationDuration: '28s',
            }}
          />
          <div
            className="lf-blob"
            style={{
              background: theme.accent,
              width: '34vmax',
              height: '34vmax',
              top: '40%',
              left: '48%',
              opacity: 0.24,
              animationDelay: '-15s',
              animationDuration: '32s',
            }}
          />
        </>
      ) : null}

      {style === 'mesh' ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(58% 45% at 18% 12%, ' +
              theme.accentSoft +
              ', transparent 68%), radial-gradient(50% 42% at 85% 8%, ' +
              hexToRgba(theme.accent2, 0.22) +
              ', transparent 70%), radial-gradient(60% 50% at 50% 100%, ' +
              theme.accentSoft +
              ', transparent 72%)',
          }}
        />
      ) : null}

      {style === 'grid' ? (
        <div
          className="lf-grid-bg absolute inset-0"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />
      ) : null}

      {style === 'dots' ? (
        <div
          className="lf-dots-bg absolute inset-0"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />
      ) : null}

      {style === 'aurora' || style === 'mesh' ? (
        <div
          className="lf-grid-bg absolute inset-0 opacity-40"
          style={{ maskImage: MASK, WebkitMaskImage: MASK }}
        />
      ) : null}

      <div className="lf-vignette absolute inset-0 opacity-70" />
    </div>
  );
}
