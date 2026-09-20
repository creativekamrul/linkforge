import { Fragment, type ReactNode } from 'react';
import type { ResolvedSite } from '@/lib/config';
import { ActionBar } from './ActionBar';
import { Background } from './Background';
import { EditAffordance } from './EditAffordance';
import { ExperienceList } from './ExperienceList';
import { Footer } from './Footer';
import { LinkList } from './LinkList';
import { ProfileHeader } from './ProfileHeader';
import { StackRow } from './StackRow';
import { StatsBar } from './StatsBar';
import { SocialRow } from './SocialRow';

type Block = { node: ReactNode; wrap?: string } | null;

export function LinkPage({ site, showEdit = false }: { site: ResolvedSite; showEdit?: boolean }) {
  const { config, theme, siteUrl } = site;
  const { settings, footer, profile, links, socials, stats, stack, experience, sections } = config;

  // Each block is a self-contained component. The dashboard decides which ones
  // exist and in what order; a block whose data is empty renders nothing.
  const blocks: Record<string, Block> = {
    profile: { node: <ProfileHeader profile={profile} theme={theme} /> },

    stats: stats.length > 0 ? { node: <StatsBar stats={stats} /> } : null,

    links:
      links.length > 0
        ? {
            node: <LinkList links={links} defaultNewTab={settings.openLinksInNewTab} />,
            wrap: 'mt-8 w-full',
          }
        : null,

    stack: stack.length > 0 ? { node: <StackRow stack={stack} />, wrap: 'mt-8 w-full' } : null,

    experience:
      experience.length > 0
        ? { node: <ExperienceList experience={experience} />, wrap: 'mt-8 w-full' }
        : null,

    socials:
      socials.length > 0 ? { node: <SocialRow socials={socials} />, wrap: 'mt-9 w-full' } : null,

    actions: {
      node: (
        <ActionBar
          siteUrl={siteUrl}
          name={profile.name}
          showShare={settings.showShareButton}
          showQr={settings.showQrCode}
          showContact={settings.showSaveContact}
        />
      ),
      wrap: 'mt-8 w-full',
    },

    footer: { node: <Footer text={footer.text} branding={footer.branding} /> },
  };

  return (
    <>
      <Background theme={theme} />
      {showEdit ? <EditAffordance /> : null}
      <main className="relative mx-auto flex w-full max-w-[560px] flex-col items-center px-5 pb-16 pt-16 sm:pt-20">
        {sections.map((key) => {
          const block = blocks[key];
          if (!block) return null;
          return block.wrap ? (
            <div key={key} className={block.wrap}>
              {block.node}
            </div>
          ) : (
            <Fragment key={key}>{block.node}</Fragment>
          );
        })}
      </main>
    </>
  );
}
