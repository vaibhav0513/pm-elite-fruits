'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore, type CartItem } from '@/store/cartStore';
import { fruits } from '@/data/fruits';
import { baseOptions, formatQty, priceSuffix } from '@/lib/options';
import type { Fruit, FruitStatus, Localized, PriceOption } from '@/types';
import { buildOrderLink } from '@/lib/notifications/whatsapp';
import QuantitySelector from '@/components/shop/QuantitySelector';
import CountSelector from '@/components/shop/CountSelector';
import FruitImage from '@/components/shop/FruitImage';

type Live = Record<string, { status: FruitStatus; hidePrice: boolean; name: Localized; options: PriceOption[] }>;

type Line = {
  item: CartItem;
  fruit: Fruit;
  name: string;
  option?: PriceOption;
  qty: number;
  available: boolean;
};

export default function CartView() {
  const locale = useLocale() as 'en' | 'mr' | 'hi';
  const t = useTranslations('cart');
  const s = useTranslations('shop');
  const o = useTranslations('orderMsg');

  const items = useCartStore((st) => st.items);
  const setQty = useCartStore((st) => st.setQty);
  const remove = useCartStore((st) => st.remove);
  const clear = useCartStore((st) => st.clear);

  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState<Live | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch('/api/prices', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: Live) => setLive(d))
      .catch(() => setLive({})); // falls back to the data in fruits.ts
  }, []);

  if (!mounted || live === null) return <div className="mt-8 h-40 animate-pulse rounded-3xl bg-gold/10" />;

  const lines: Line[] = items.flatMap((item) => {
    const fruit = fruits.find((f) => f.slug === item.slug);
    if (!fruit) return [];
    const l = live[item.slug];
    const status: FruitStatus = l?.status ?? fruit.status ?? (fruit.inStock ? 'available' : 'out');
    const hide = l?.hidePrice ?? fruit.hidePrice ?? false;
    const option = (l?.options ?? baseOptions(fruit)).find((x) => x.id === item.optionId);
    const qty = option?.mode === 'count' ? Math.max(1, Math.round(item.qty)) : item.qty;
    return [{
      item,
      fruit,
      name: l?.name?.[locale] ?? fruit.name[locale],
      option,
      qty,
      available: status === 'available' && !hide && !!option
    }];
  });

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-gold/40 bg-white p-10 text-center">
        <p className="text-6xl" aria-hidden="true">🧺</p>
        <h2 className="mt-4 text-2xl font-bold text-forest">{t('empty')}</h2>
        <p className="mt-2 text-forest-dark/70">{t('emptyHint')}</p>
        <Link href="/shop" className="btn btn-primary mt-6 inline-flex">{t('shopFruits')}</Link>
      </div>
    );
  }

  const ready = lines.filter((x): x is Line & { option: PriceOption } => x.available && !!x.option);
  const total = ready.reduce((sum, x) => sum + x.qty * x.option.price, 0);

  const waLink = buildOrderLink(
    ready.map((x) => ({
      name: x.name,
      qty: formatQty(x.option, x.qty, o('unit'))
    })),
    {
      hello: o('hello'),
      intro: o('intro'),
      items: o('items'),
      unit: o('unit'),
      name: o('name'),
      address: o('address'),
      time: o('time'),
      thanks: o('thanks')
    }
  );

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
      <ul className="space-y-4">
        {lines.map(({ item, fruit, name, option, qty, available }) => (
          <li
            key={`${item.slug}-${item.optionId}`}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-gold/40 bg-white p-4"
          >
            <Link
              href={`/shop/${fruit.slug}`}
              className={`relative block h-20 w-20 shrink-0 overflow-hidden rounded-2xl ${fruit.tint}`}
              aria-label={name}
            >
              <FruitImage src={fruit.images?.[0]} emoji={fruit.emoji} sizes="80px" />
            </Link>

            <div className="min-w-[120px] flex-1">
              <h3 className="text-lg font-bold">
                <Link href={`/shop/${fruit.slug}`}>{name}</Link>
              </h3>
              {available && option ? (
                <p className="text-sm text-forest-dark/70">
                  ₹{option.price} {priceSuffix(option, s('perKg'))}
                </p>
              ) : (
                <p className="text-sm font-semibold text-berry">{t('unavailable')}</p>
              )}
            </div>

            {available && option &&
              (option.mode === 'weight' ? (
                <QuantitySelector value={qty} onChange={(q) => setQty(item.slug, item.optionId, q)} />
              ) : (
                <CountSelector value={qty} onChange={(q) => setQty(item.slug, item.optionId, q)} />
              ))}

            <div className="ml-auto text-right">
              {available && option && (
                <p className="text-lg font-bold text-leaf">₹{(qty * option.price).toLocaleString('en-IN')}</p>
              )}
              <button
                type="button"
                onClick={() => remove(item.slug, item.optionId)}
                className="mt-1 text-sm text-berry underline hover:no-underline"
              >
                {t('remove')}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-3xl border border-gold/40 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-forest">{t('summary')}</h2>
        <div className="mt-4 flex items-center justify-between border-t border-gold/30 pt-4">
          <span className="font-semibold">{t('total')}</span>
          <span className="text-2xl font-bold text-leaf">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <p className="mt-3 text-sm text-forest-dark/70">{t('note')}</p>

        {ready.length > 0 ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-bold text-white shadow transition hover:scale-[1.02] hover:brightness-110"
          >
            {t('orderWhatsapp')}
          </a>
        ) : (
          <p className="mt-5 rounded-full bg-gold/20 px-5 py-3 text-center text-sm font-semibold text-forest">
            {t('unavailable')}
          </p>
        )}

        <button type="button" onClick={clear} className="mt-3 w-full text-center text-sm text-forest-dark/60 underline hover:no-underline">
          {t('clear')}
        </button>
      </aside>
    </div>
  );
}