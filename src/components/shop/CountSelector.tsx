'use client';

import { useTranslations } from 'next-intl';

const MIN = 1;
const MAX = 20;

export default function CountSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const t = useTranslations('shop');
  return (
    <div role="group" aria-label={t('quantity')} className="inline-flex w-fit items-center self-start rounded-full border border-gold/60 bg-white">
      <button type="button" aria-label={t('decrease')} disabled={value <= MIN} onClick={() => onChange(Math.max(MIN, value - 1))}
        className="h-9 w-9 rounded-full text-xl text-forest transition hover:bg-gold/20 disabled:opacity-30">−</button>
      <span className="min-w-16 text-center text-sm font-semibold text-forest" aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label={t('increase')} disabled={value >= MAX} onClick={() => onChange(Math.min(MAX, value + 1))}
        className="h-9 w-9 rounded-full text-xl text-forest transition hover:bg-gold/20 disabled:opacity-30">+</button>
    </div>
  );
}