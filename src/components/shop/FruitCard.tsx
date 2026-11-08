import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Fruit } from '@/types';
import AddToCart from './AddToCart';
import FruitImage from './FruitImage';

export default function FruitCard({ fruit }: { fruit: Fruit }) {
  const locale = useLocale() as 'en' | 'mr' | 'hi';
  const t = useTranslations('shop');

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
          <p className="mt-1 text-sm text-forest-dark/70">
            <span className="text-lg font-semibold text-leaf">₹{fruit.pricePerKg}</span> {t('perKg')}
          </p>
        </div>
        <div className="mt-auto"><AddToCart slug={fruit.slug} inStock={fruit.inStock} /></div>
      </div>
    </article>
  );
}