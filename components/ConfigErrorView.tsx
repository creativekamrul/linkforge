import { CONFIG_PATH, type ConfigError } from '@/lib/config';

export function ConfigErrorView({ error }: { error: ConfigError | null }) {
  const issues = error && error.issues.length > 0 ? error.issues : ['Unknown configuration error.'];
  const file = error ? error.file : CONFIG_PATH;
  const heading = error ? error.message : 'The configuration could not be loaded';

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center gap-7 px-6 py-16">
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: 'var(--accent)' }}
        >
          LinkForge
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{heading}</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          The page stays offline until the config file is valid. Fix it and reload - there is no
          rebuild or restart step.
        </p>
      </div>

      <div
        className="lf-card p-4"
        style={{ background: 'var(--surface-strong)' }}
      >
        <p
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: 'var(--muted)' }}
        >
          Config file
        </p>
        <code className="mt-1 block break-all text-[12.5px]">{file}</code>
      </div>

      <div>
        <p
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: 'var(--muted)' }}
        >
          Problems ({issues.length})
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {issues.map((issue, index) => (
            <li
              key={issue + index}
              className="lf-card flex items-start gap-3 px-3.5 py-3 text-[13px]"
            >
              <span
                className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {index + 1}
              </span>
              <span className="break-words">{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
        The full reference for every field lives in README.md.
      </p>
    </main>
  );
}
