import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  slug: string;
  optionId: string;
  mode: 'weight' | 'count';
  qty: number; // kg for weight, number of packs for count
};

type CartState = {
  items: CartItem[];
  add: (slug: string, optionId: string, mode: 'weight' | 'count', qty: number) => void;
  setQty: (slug: string, optionId: string, qty: number) => void;
  remove: (slug: string, optionId: string) => void;
  clear: () => void;
};

const clamp = (mode: 'weight' | 'count', n: number) =>
  mode === 'weight'
    ? Math.min(50, Math.max(0.5, Math.round(n * 2) / 2))
    : Math.min(50, Math.max(1, Math.round(n)));

const same = (i: CartItem, slug: string, optionId: string) => i.slug === slug && i.optionId === optionId;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (slug, optionId, mode, qty) =>
        set((s) => {
          const found = s.items.find((i) => same(i, slug, optionId));
          if (found) {
            return {
              items: s.items.map((i) =>
                same(i, slug, optionId) ? { ...i, mode, qty: clamp(mode, i.qty + qty) } : i
              )
            };
          }
          return { items: [...s.items, { slug, optionId, mode, qty: clamp(mode, qty) }] };
        }),
      setQty: (slug, optionId, qty) =>
        set((s) => ({
          items: s.items.map((i) => (same(i, slug, optionId) ? { ...i, qty: clamp(i.mode, qty) } : i))
        })),
      remove: (slug, optionId) => set((s) => ({ items: s.items.filter((i) => !same(i, slug, optionId)) })),
      clear: () => set({ items: [] })
    }),
    { name: 'pm-elite-cart-v2' }
  )
);