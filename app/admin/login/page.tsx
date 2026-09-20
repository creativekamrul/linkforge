import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center px-5 py-16">
      <h1 className="text-[22px] font-semibold tracking-[-0.02em]">LinkForge dashboard</h1>
      <p className="lf-mono mt-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--muted)' }}>
        # password required
      </p>

      <div className="lf-card mt-8 flex w-full flex-col items-center p-6">
        <LoginForm />
      </div>

      <Link href="/" className="mt-6 text-[12.5px]" style={{ color: 'var(--muted)' }}>
        ← back to the public page
      </Link>
    </main>
  );
}
