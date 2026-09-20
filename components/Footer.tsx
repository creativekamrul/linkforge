export function Footer({ text, branding }: { text?: string; branding: boolean }) {
  return (
    <footer
      className="lf-enter mt-10 flex w-full flex-col items-center gap-2 text-center"
      style={{ animationDelay: '760ms' }}
    >
      {text ? (
        <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
          {text}
        </p>
      ) : null}

      {branding ? (
        <p className="lf-mono text-[10.5px]" style={{ color: 'var(--muted)', opacity: 0.75 }}>
          <span style={{ color: 'var(--accent)', opacity: 0.9 }}>{'// '}</span>
          built with LinkForge - every word above lives in data/site.json
        </p>
      ) : null}
    </footer>
  );
}
