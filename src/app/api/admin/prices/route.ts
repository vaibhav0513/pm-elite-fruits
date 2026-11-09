import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/adminAuth';
import { getDb } from '@/lib/mongodb';
import { fruits } from '@/data/fruits';

const STATUSES = ['available', 'upcoming', 'out'];

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const fail = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Not logged in.' }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return fail('Bad request.');
  }
  const b = (raw ?? {}) as Record<string, unknown>;
  const slug = String(b.slug);
  const status = String(b.status);

  if (!fruits.some((f) => f.slug === slug)) return fail('Unknown fruit.');
  if (!STATUSES.includes(status)) return fail('Bad status.');

  const nameIn = (b.name ?? {}) as Record<string, unknown>;
  const descIn = (b.description ?? {}) as Record<string, unknown>;
  const name = { en: clean(nameIn.en, 60), mr: clean(nameIn.mr, 60), hi: clean(nameIn.hi, 60) };
  const description = { en: clean(descIn.en, 500), mr: clean(descIn.mr, 500), hi: clean(descIn.hi, 500) };

  const rawOptions = Array.isArray(b.options) ? b.options : [];
  if (rawOptions.length < 1 || rawOptions.length > 6) return fail('Add between 1 and 6 prices.');

  const seen = new Set<string>();
  let weightCount = 0;
  const options: { id: string; mode: 'weight' | 'count'; label: string; price: number }[] = [];

  for (const r of rawOptions) {
    const o = (r ?? {}) as Record<string, unknown>;
    const id = String(o.id ?? '');
    const mode = o.mode === 'weight' ? 'weight' : o.mode === 'count' ? 'count' : null;
    const price = Number(o.price);
    const label = clean(o.label, 30);

    if (!/^[a-z0-9]{1,12}$/.test(id) || seen.has(id)) return fail('Bad price entry. Reload the page and try again.');
    if (!mode) return fail('Bad price type.');
    if (!Number.isFinite(price) || price <= 0 || price > 100000) return fail('Enter a price between 1 and 100000.');
    if (mode === 'count' && !label) return fail('Give each pack a name, for example Box or Dozen.');
    if (mode === 'weight') weightCount += 1;

    seen.add(id);
    options.push({ id, mode, label: mode === 'count' ? label : '', price: Math.round(price * 100) / 100 });
  }
  if (weightCount > 1) return fail('Only one "Per kg" price is allowed.');

  try {
    const db = await getDb();
    await db.collection('fruit_prices').updateOne(
      { _id: slug } as never,
      {
        $set: { status, hidePrice: b.hidePrice === true, name, description, options, updatedAt: new Date() },
        $unset: { pricePerKg: '' }
      },
      { upsert: true }
    );
  } catch (e) {
    console.error('admin save failed', e);
    return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 });
  }

  revalidatePath('/', 'layout'); // shop pages pick up the change now
  return NextResponse.json({ ok: true });
}