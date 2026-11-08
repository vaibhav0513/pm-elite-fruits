'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cartStore';
import { fruits } from '@/data/fruits';
import { buildOrderLink } from '@/lib/notifications/whatsapp';
import QuantitySelector from '@/components/shop/QuantitySelector';
import FruitImage from '@/components/shop/FruitImage';

export default function CartView() {
  const locale = useLocale() as 'en' | 'mr' | 'hi';
  const t = useTranslations('cart');
  const s = useTranslations('shop');
  const o = useTranslations('orderMsg');

  const items = useCartStore((st) => st.items);
  const setQty = useCartStore((st) => st.setQty);
  const remove = useCartStore((st) => st.remove);
  const clear = useCartStore((st) => st.clear);

  // The cart is saved in the browser, so wait until the page has loaded there.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="mt-8 h-40 animate-pulse rounded-3xl bg-gold/10" />;

  const lines = items
    .map((i) => ({ item: i, fruit: fruits.find((f) => f.slug === i.slug) }))
    .filter((x): x is { item: typeof x.item; fruit: NonNullable<typeof x.fruit> } => !!x.fruit);

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

  const total = lines.reduce((sum, { item, fruit }) => sum + item.qty * fruit.pricePerKg, 0);

  const waLink = buildOrderLink(
    lines.map(({ item, fruit }) => ({ name: fruit.name[locale], kg: item.qty })),
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
        {lines.map(({ item, fruit }) => (
          <li
            key={fruit.slug}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-gold/40 bg-white p-4"
          >
            <Link
              href={`/shop/${fruit.slug}`}
              className={`relative block h-20 w-20 shrink-0 overflow-hidden rounded-2xl ${fruit.tint}`}
              aria-label={fruit.name[locale]}
            >
              <FruitImage src={fruit.images?.[0]} emoji={fruit.emoji} sizes="80px" />
            </Link>

            <div className="min-w-[120px] flex-1">
              <h3 className="text-lg font-bold">
                <Link href={`/shop/${fruit.slug}`}>{fruit.name[locale]}</Link>
              </h3>
              <p className="text-sm text-forest-dark/70">
                ₹{fruit.pricePerKg} {s('perKg')}
              </p>
            </div>

            <QuantitySelector value={item.qty} onChange={(q) => setQty(fruit.slug, q)} />

            <div className="ml-auto text-right">
              <p className="text-lg font-bold text-leaf">
                ₹{(item.qty * fruit.pricePerKg).toLocaleString('en-IN')}
              </p>
              <button
                type="button"
                onClick={() => remove(fruit.slug)}
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

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-bold text-white shadow transition hover:scale-[1.02] hover:brightness-110"
        >
          {t('orderWhatsapp')}
        </a>

        <button
          type="button"
          onClick={clear}
          className="mt-3 w-full text-center text-sm text-forest-dark/60 underline hover:no-underline"
        >
          {t('clear')}
        </button>
      </aside>
    </div>
  );
}