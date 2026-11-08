import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = { slug: string; qty: number }; // qty in kg

type CartState = {
  items: CartItem[];
  add: (slug: string, qty: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const clamp = (n: number) => Math.min(50, Math.max(0.5, Math.round(n * 2) / 2));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (slug, qty) =>
        set((s) => {
          const found = s.items.find((i) => i.slug === slug);
          if (found) return { items: s.items.map((i) => (i.slug === slug ? { ...i, qty: clamp(i.qty + qty) } : i)) };
          return { items: [...s.items, { slug, qty: clamp(qty) }] };
        }),
      setQty: (slug, qty) => set((s) => ({ items: s.items.map((i) => (i.slug === slug ? { ...i, qty: clamp(qty) } : i)) })),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] })
    }),
    { name: 'pm-elite-cart' }
  )
);