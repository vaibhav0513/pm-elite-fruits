import { getDb } from '@/lib/mongodb';
import { fruits } from '@/data/fruits';
import { baseOptions } from '@/lib/options';
import type { Fruit, FruitStatus, Localized, PriceOption } from '@/types';

type Doc = {
  _id: string;
  status?: FruitStatus;
  hidePrice?: boolean;
  name?: Partial<Localized>;
  description?: Partial<Localized>;
  options?: PriceOption[];
  pricePerKg?: number; // from the first version of the admin
  updatedAt?: Date;
};

async function getOverrides(): Promise<Map<string, Doc>> {
  try {
    const db = await getDb();
    const docs = await db.collection<Doc>('fruit_prices').find({}).toArray();
    return new Map(docs.map((d) => [d._id, d]));
  } catch (e) {
    console.error('prices: database not available, using defaults', e);
    return new Map(); // the shop still works with the data in fruits.ts
  }
}

const pick = (base: string, v?: string) => (v && v.trim() ? v.trim() : base);
const pickAll = (base: Localized, o?: Partial<Localized>): Localized => ({
  en: pick(base.en, o?.en),
  mr: pick(base.mr, o?.mr),
  hi: pick(base.hi, o?.hi)
});

function merge(f: Fruit, o?: Doc): Fruit {
  let options = baseOptions(f);
  if (o?.options?.length) {
    options = o.options.map((x) => ({ id: x.id, mode: x.mode, label: x.label, price: x.price }));
  } else if (o?.pricePerKg) {
    options = [{ id: 'kg', mode: 'weight', label: '', price: o.pricePerKg }];
  }
  const status: FruitStatus = o?.status ?? f.status ?? (f.inStock ? 'available' : 'out');
  const weight = options.find((x) => x.mode === 'weight');
  return {
    ...f,
    name: pickAll(f.name, o?.name),
    description: pickAll(f.description, o?.description),
    options,
    hidePrice: o?.hidePrice ?? f.hidePrice ?? false,
    pricePerKg: (weight ?? options[0]).price,
    status,
    inStock: status === 'available',
    updatedAt: o?.updatedAt ? new Date(o.updatedAt).toISOString() : undefined
  };
}

export async function getLiveFruits(): Promise<Fruit[]> {
  const o = await getOverrides();
  return fruits.map((f) => merge(f, o.get(f.slug)));
}

export async function getLiveFruit(slug: string): Promise<Fruit | undefined> {
  const f = fruits.find((x) => x.slug === slug);
  if (!f) return undefined;
  const o = await getOverrides();
  return merge(f, o.get(slug));
}