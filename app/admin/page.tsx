import { redirect } from 'next/navigation';
import { adminPassword, isAuthed } from '@/lib/auth';
import { CONFIG_PATH, safeLoadSite } from '@/lib/config';
import { Dashboard } from '@/components/admin/Dashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard - LinkForge', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!adminPassword()) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center px-5 text-center">
        <h1 className="text-[20px] font-semibold">Dashboard password is not set</h1>
        <p className="mt-3 text-[13.5px]" style={{ color: 'var(--muted)' }}>
          Add <code className="lf-mono">ADMIN_PASSWORD=…</code> to your <code className="lf-mono">.env</code> file
          and restart the container.
        </p>
      </main>
    );
  }

  if (!(await isAuthed())) redirect('/admin/login');

  const { site, error } = safeLoadSite();

  return (
    <Dashboard
      initialConfig={site ? site.config : null}
      configPath={CONFIG_PATH}
      loadIssues={error ? error.issues : []}
    />
  );
}
