import type { Fruit, PriceOption } from '@/types';

export const baseOptions = (f: Fruit): PriceOption[] =>
  f.options?.length ? f.options : [{ id: 'kg', mode: 'weight', label: '', price: f.pricePerKg }];

export const priceSuffix = (o: PriceOption, perKg: string) =>
  o.mode === 'weight' ? perKg : `/ ${o.label}`;

export const formatQty = (o: PriceOption, qty: number, kgWord: string) =>
  o.mode === 'weight' ? `${qty} ${kgWord}` : `${qty} × ${o.label}`;