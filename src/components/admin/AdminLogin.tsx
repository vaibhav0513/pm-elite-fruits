'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not log in.');
    } catch {
      setError('No internet. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const input = 'mt-4 w-full rounded-xl border border-gold/50 px-4 py-3';

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-gold/40 bg-white p-6">
      <h1 className="font-serif text-2xl font-bold text-forest">Owner login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="username"
        className={input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && email && password && submit()}
        placeholder="Password"
        autoComplete="current-password"
        className={input}
      />
      {error && <p className="mt-2 text-sm text-berry">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy || !email || !password}
        className="btn btn-primary mt-4 w-full disabled:opacity-60"
      >
        {busy ? 'Please wait…' : 'Log in'}
      </button>
    </div>
  );
}