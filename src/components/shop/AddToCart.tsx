'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import QuantitySelector from './QuantitySelector';

export default function AddToCart({ slug, inStock = true }: { slug: string; inStock?: boolean }) {
  const t = useTranslations('shop');
  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(id);
  }, [done]);

  if (!inStock) return <p className="text-sm font-semibold text-berry">{t('outOfStock')}</p>;

  return (
    <div className="flex flex-col gap-3">
      <QuantitySelector value={qty} onChange={setQty} />
      <button
        type="button"
        onClick={() => { add(slug, qty); setDone(true); }}
        className={`btn w-full ${done ? 'bg-gold text-forest-dark' : 'btn-primary'}`}
      >
        {done ? `✓ ${t('added')}` : t('addToCart')}
      </button>
    </div>
  );
}