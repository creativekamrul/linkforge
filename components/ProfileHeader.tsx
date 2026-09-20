import { Icon } from '@/lib/icons';
import type { Profile } from '@/lib/types';
import type { ResolvedTheme } from '@/lib/theme';

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function ProfileHeader({ profile, theme }: { profile: Profile; theme: ResolvedTheme }) {
  const showChips = Boolean(profile.status || profile.location);

  return (
    <header className="lf-enter flex w-full flex-col items-center text-center">
      <div className="relative mb-5 h-28 w-28">
        {theme.avatarRing ? (
          <div className="lf-avatar-ring absolute -inset-[3px] rounded-full opacity-80" />
        ) : null}
        <div
          className="relative h-28 w-28 overflow-hidden rounded-full"
          style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)' }}
        >
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-tight">
              {initialsOf(profile.name)}
            </span>
          )}
        </div>
      </div>

      <h1 className="flex flex-wrap items-center justify-center gap-1.5 text-[27px] font-semibold leading-tight tracking-[-0.02em]">
        <span>{profile.name}</span>
        {profile.verified ? (
          <span title="Verified" style={{ color: 'var(--accent)' }}>
            <Icon name="check-badge" className="h-[19px] w-[19px]" strokeWidth={1.6} />
          </span>
        ) : null}
      </h1>

      {profile.headline ? (
        <p
          className="lf-mono mt-2 text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: 'var(--accent)' }}
        >
          {profile.headline}
        </p>
      ) : null}

      {profile.tagline ? <p className="lf-tagline mt-3.5 max-w-[24ch]">{profile.tagline}</p> : null}

      {showChips ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {profile.status ? (
            <span className="lf-chip inline-flex items-center gap-2 px-3 py-1.5 text-[12.5px] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ background: 'var(--accent)' }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </span>
              {profile.status.emoji ? <span>{profile.status.emoji}</span> : null}
              <span>{profile.status.text}</span>
            </span>
          ) : null}

          {profile.location ? (
            <span
              className="lf-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px]"
              style={{ color: 'var(--muted)' }}
            >
              <Icon name="map-pin" className="h-3.5 w-3.5" />
              {profile.location}
            </span>
          ) : null}
        </div>
      ) : null}

      {profile.bio ? (
        <p
          className="mt-4 max-w-[48ch] text-[13.5px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          {profile.bio}
        </p>
      ) : null}
    </header>
  );
}
