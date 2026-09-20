import { safeLoadSite } from '@/lib/config';
import { adminPassword } from '@/lib/auth';
import { LinkPage } from '@/components/LinkPage';
import { ConfigErrorView } from '@/components/ConfigErrorView';

// Read site.json on every request so edits show up immediately.
export const dynamic = 'force-dynamic';

export default function Page() {
  const { site, error } = safeLoadSite();
  if (!site) return <ConfigErrorView error={error} />;

  // The discreet edit affordance is pointless when the dashboard is switched off.
  const showEdit = adminPassword() !== null;

  return <LinkPage site={site} showEdit={showEdit} />;
}
