import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Fruit } from '@/types';
import { baseOptions, priceSuffix } from '@/lib/options';
import AddToCart from './AddToCart';
import FruitImage from './FruitImage';

export default function FruitCard({ fruit }: { fruit: Fruit }) {
  const locale = useLocale() as 'en' | 'mr' | 'hi';
  const t = useTranslations('shop');
  const upcoming = fruit.status === 'upcoming';
  const options = baseOptions(fruit);
  const single = options.length === 1 ? options[0] : null;
  const pill = 'mt-1 inline-block rounded-full bg-gold/20 px-3 py-1 text-sm font-semibold text-forest';

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-gold/40 bg-white transition duration-300 hover:border-gold hover:shadow-xl hover:shadow-gold/20">
      <Link href={`/shop/${fruit.slug}`} className={`relative block aspect-square overflow-hidden ${fruit.tint}`} aria-label={fruit.name[locale]}>
        <FruitImage src={fruit.images?.[0]} emoji={fruit.emoji} sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw" />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h3 className="text-xl font-bold">
            <Link href={`/shop/${fruit.slug}`}>{fruit.name[locale]}</Link>
          </h3>
          {upcoming ? (
            <p className={pill}>{t('comingSoon')}</p>
          ) : fruit.hidePrice ? (
            <p className={pill}>{t('priceOnRequest')}</p>
          ) : single ? (
            <p className="mt-1 text-sm text-forest-dark/70">
              <span className="text-lg font-semibold text-leaf">₹{single.price}</span> {priceSuffix(single, t('perKg'))}
            </p>
          ) : null}
        </div>
        <div className="mt-auto">
          {upcoming ? (
            <p className="text-sm text-forest-dark/60">{t('comingSoonNote')}</p>
          ) : (
            <AddToCart
              slug={fruit.slug}
              name={fruit.name[locale]}
              options={options}
              hidePrice={fruit.hidePrice}
              inStock={fruit.inStock}
            />
          )}
        </div>
      </div>
    </article>
  );
}