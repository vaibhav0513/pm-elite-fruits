'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'available' | 'upcoming' | 'out';
type Loc = { en: string; mr: string; hi: string };
type Mode = 'weight' | 'count';
type Opt = { id: string; mode: Mode; label: string; price: string };

export type AdminFruit = {
  slug: string;
  emoji: string;
  name: Loc;
  description: Loc;
  status: Status;
  hidePrice: boolean;
  options: { id: string; mode: Mode; label: string; price: number }[];
};

const LANGS = [
  ['en', 'English'],
  ['mr', 'मराठी'],
  ['hi', 'हिन्दी']
] as const;

const newId = () => 'o' + Math.random().toString(36).slice(2, 8);
const field = 'mt-1 w-full rounded-xl border border-gold/50 bg-white px-3 py-2 text-lg';

function Row({ f }: { f: AdminFruit }) {
  const router = useRouter();
  const [name, setName] = useState<Loc>(f.name);
  const [desc, setDesc] = useState<Loc>(f.description);
  const [status, setStatus] = useState<Status>(f.status);
  const [hidePrice, setHidePrice] = useState(f.hidePrice);
  const [opts, setOpts] = useState<Opt[]>(f.options.map((o) => ({ ...o, price: String(o.price) })));
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const setOpt = (i: number, patch: Partial<Opt>) =>
    setOpts((p) => p.map((o, j) => (j === i ? { ...o, ...patch } : o)));

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: f.slug,
          status,
          hidePrice,
          name,
          description: desc,
          options: opts.map((o) => ({ id: o.id, mode: o.mode, label: o.label, price: Number(o.price) }))
        })
      });
      if (res.status === 401) {
        router.refresh(); // session ended, shows the login again
        return;
      }
      const data = await res.json().catch(() => ({}));
      setMsg(res.ok ? 'Saved ✓' : data.error ?? 'Could not save.');
    } catch {
      setMsg('No internet. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-3xl border border-gold/40 bg-white p-4">
      <p className="text-lg font-bold text-forest">
        <span aria-hidden="true">{f.emoji}</span> {name.en || f.slug}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className="text-sm">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={field}>
            <option value="available">Available</option>
            <option value="upcoming">Coming soon</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={hidePrice}
            onChange={(e) => setHidePrice(e.target.checked)}
            className="h-6 w-6"
          />
          Hide price
        </label>
      </div>
      {hidePrice && (
        <p className="mt-2 text-xs text-forest-dark/70">
          Customers will see &quot;Ask today&apos;s price on WhatsApp&quot; and cannot add this fruit to the cart.
        </p>
      )}

      <p className="mt-4 text-sm font-semibold text-forest">Prices</p>
      <div className="mt-2 space-y-3">
        {opts.map((o, i) => (
          <div key={o.id} className="rounded-2xl border border-gold/30 p-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                Type
                <select
                  value={o.mode}
                  onChange={(e) => setOpt(i, { mode: e.target.value as Mode })}
                  className={field}
                >
                  <option value="weight">Per kg</option>
                  <option value="count">Pack / box / dozen</option>
                </select>
              </label>
              <label className="text-sm">
                Price (₹)
                <input
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="any"
                  value={o.price}
                  onChange={(e) => setOpt(i, { price: e.target.value })}
                  className={field}
                />
              </label>
            </div>
            {o.mode === 'count' && (
              <label className="mt-3 block text-sm">
                Name (for example Box, Dozen, 200 g pack)
                <input
                  value={o.label}
                  maxLength={30}
                  onChange={(e) => setOpt(i, { label: e.target.value })}
                  className={field}
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => setOpts((p) => p.filter((_, j) => j !== i))}
              disabled={opts.length === 1}
              className="mt-2 text-sm text-berry underline disabled:opacity-40"
            >
              Remove this price
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpts((p) => [...p, { id: newId(), mode: 'count', label: '', price: '' }])}
        disabled={opts.length >= 6}
        className="mt-3 text-sm font-semibold text-leaf underline disabled:opacity-40"
      >
        + Add another price
      </button>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-forest">Edit title and description</summary>
        <div className="mt-3 space-y-4">
          {LANGS.map(([code, label]) => (
            <div key={code}>
              <label className="block text-sm">
                Title ({label})
                <input
                  value={name[code]}
                  maxLength={60}
                  onChange={(e) => setName((p) => ({ ...p, [code]: e.target.value }))}
                  className={field}
                />
              </label>
              <label className="mt-2 block text-sm">
                Description ({label})
                <textarea
                  value={desc[code]}
                  rows={3}
                  maxLength={500}
                  onChange={(e) => setDesc((p) => ({ ...p, [code]: e.target.value }))}
                  className={field}
                />
              </label>
            </div>
          ))}
        </div>
      </details>

      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? 'Saving…' : 'Save'}
        </button>
        {msg && <span className="text-sm font-semibold text-leaf">{msg}</span>}
      </div>
    </li>
  );
}

export default function PriceEditor({ fruits }: { fruits: AdminFruit[] }) {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-forest">Prices and fruits</h1>
        <button type="button" onClick={logout} className="text-sm underline">
          Log out
        </button>
      </div>
      <p className="mt-2 text-sm text-forest-dark/70">
        Change a fruit, then press Save on that fruit. The shop updates right away.
      </p>
      <ul className="mt-6 space-y-4">
        {fruits.map((f) => (
          <Row key={f.slug} f={f} />
        ))}
      </ul>
    </div>
  );
}