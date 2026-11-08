'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Fruit } from '@/types';
import FruitCard from './FruitCard';

const cats = ['all', 'berries', 'tropical'] as const;

export default function ShopBrowser({ fruits }: { fruits: Fruit[] }) {
  const t = useTranslations('shop');
  const locale = useLocale() as 'en' | 'mr' | 'hi';
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<(typeof cats)[number]>('all');

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fruits.filter((f) => {
      const okCat = cat === 'all' || f.category === cat;
      const okText = !q || Object.values(f.name).some((n) => n.toLowerCase().includes(q));
      return okCat && okText;
    });
  }, [fruits, query, cat]);

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label={t('categoriesLabel')} className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                cat === c ? 'border-forest bg-forest text-white' : 'border-gold/60 bg-white text-forest hover:bg-gold/15'
              }`}>
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-full border border-gold/60 bg-white px-5 py-2.5 text-sm text-forest-dark placeholder:text-forest-dark/40 md:w-72"
        />
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 rounded-3xl border border-dashed border-gold/60 p-10 text-center text-forest-dark/70">{t('noResults')}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" lang={locale}>
          {shown.map((f) => <FruitCard key={f.slug} fruit={f} />)}
        </div>
      )}
    </>
  );
}