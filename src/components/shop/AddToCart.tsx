'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCartStore } from '@/store/cartStore';
import { site } from '@/config/site';
import { priceSuffix } from '@/lib/options';
import type { PriceOption } from '@/types';
import QuantitySelector from './QuantitySelector';
import CountSelector from './CountSelector';

type Props = {
  slug: string;
  name: string;
  options: PriceOption[];
  hidePrice?: boolean;
  inStock?: boolean;
};

export default function AddToCart({ slug, name, options, hidePrice = false, inStock = true }: Props) {
  const t = useTranslations('shop');
  const add = useCartStore((s) => s.add);
  const [optionId, setOptionId] = useState(options[0]?.id ?? '');
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(id);
  }, [done]);

  if (!inStock) return <p className="text-sm font-semibold text-berry">{t('outOfStock')}</p>;

  if (hidePrice) {
    const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('askPriceMsg', { name }))}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-center font-bold text-white shadow transition hover:brightness-110"
      >
        {t('askPrice')}
      </a>
    );
  }

  const option = options.find((o) => o.id === optionId) ?? options[0];
  if (!option) return null;

  return (
    <div className="flex flex-col gap-3">
      {options.length > 1 && (
        <div role="radiogroup" aria-label={t('chooseOption')} className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={o.id === option.id}
              onClick={() => {
                setOptionId(o.id);
                setQty(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                o.id === option.id
                  ? 'border-forest bg-forest text-white'
                  : 'border-gold/60 bg-white text-forest hover:border-gold'
              }`}
            >
              ₹{o.price} {priceSuffix(o, t('perKg'))}
            </button>
          ))}
        </div>
      )}

      {option.mode === 'weight' ? (
        <QuantitySelector value={qty} onChange={setQty} />
      ) : (
        <CountSelector value={qty} onChange={setQty} />
      )}

      <button
        type="button"
        onClick={() => {
          add(slug, option.id, option.mode, qty);
          setDone(true);
        }}
        className={`btn w-full ${done ? 'bg-gold text-forest-dark' : 'btn-primary'}`}
      >
        {done ? `✓ ${t('added')}` : t('addToCart')}
      </button>
    </div>
  );
}