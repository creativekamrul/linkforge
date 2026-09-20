import { Icon } from '@/lib/icons';
import { BrandGlyph, brandIcon } from '@/lib/brand-icons';
import type { SocialItem } from '@/lib/types';

const MAIL = /^(e-?mail|mail)$/i;

export function SocialRow({ socials }: { socials: SocialItem[] }) {
  if (socials.length === 0) return null;

  return (
    <ul className="lf-enter flex flex-wrap items-center justify-center gap-2.5">
      {socials.map((social) => {
        const mail = MAIL.test(social.platform);
        const brand = mail ? null : brandIcon(social.platform);
        const external = /^https?:/i.test(social.url);
        const title = social.label || (brand ? brand.title : social.platform);

        return (
          <li key={social.platform + social.url}>
            <a
              href={social.url}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={title}
              title={title}
              className="lf-link lf-card lf-focus flex h-11 w-11 items-center justify-center no-underline"
              style={{ color: 'var(--muted)' }}
            >
              {mail ? (
                <Icon name="mail" className="h-[19px] w-[19px]" />
              ) : brand ? (
                <BrandGlyph path={brand.path} className="h-[19px] w-[19px]" />
              ) : (
                <Icon name="globe" className="h-[19px] w-[19px]" />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
