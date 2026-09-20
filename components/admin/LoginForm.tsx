'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    setBusy(false);
    if (response.ok && data.ok) {
      router.replace('/admin');
      router.refresh();
      return;
    }
    setError(data.error || 'Sign in failed.');
  }

  return (
    <form onSubmit={submit} className="w-full max-w-[380px]">
      <label className="block">
        <span
          className="lf-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: 'var(--muted)' }}
        >
          password
        </span>
        <input
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••••"
          className="mt-2 w-full rounded-[12px] px-3.5 py-3 text-[14px] outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        />
      </label>

      {error ? (
        <p className="mt-3 text-[12.5px]" style={{ color: 'var(--accent-2)' }}>
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="lf-chip mt-5 w-full px-4 py-3 text-[13.5px] font-medium disabled:opacity-60"
        style={{ borderColor: 'var(--accent)' }}
      >
        {busy ? 'Checking…' : 'Unlock dashboard'}
      </button>
    </form>
  );
}
