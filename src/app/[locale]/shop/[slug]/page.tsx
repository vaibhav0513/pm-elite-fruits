import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { fruits, getFruit } from '@/data/fruits';
import AddToCart from '@/components/shop/AddToCart';
import FruitGallery from '@/components/shop/FruitGallery';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => fruits.map((f) => ({ locale, slug: f.slug })));
}

export default async function FruitPage({ params }: { params: Promise<{ locale: 'en' | 'mr' | 'hi'; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fruit = getFruit(slug);
  if (!fruit) notFound();
  const t = await getTranslations('shop');
  const hero = await getTranslations('hero');

  return (
    <section className="container-x py-10 md:py-16">
      <Link href="/shop" className="text-sm font-medium text-leaf hover:text-forest">← {t('backToShop')}</Link>
      <div className="mt-6 grid items-start gap-8 md:grid-cols-[380px_1fr] md:gap-12">
        <div className="mx-auto w-full max-w-sm md:sticky md:top-24 md:max-w-none">
          <FruitGallery images={fruit.images ?? []} alt={fruit.name[locale]} emoji={fruit.emoji} tint={fruit.tint} />
        </div>
        <div className="md:pt-4">
          <span className="inline-block rounded-full border border-gold/60 bg-white px-3 py-1 text-sm text-forest">
            {t(`categories.${fruit.category}`)}
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">{fruit.name[locale]}</h1>
          <p className="mt-4 text-4xl font-semibold text-leaf">
            ₹{fruit.pricePerKg} <span className="text-base font-normal text-forest-dark/70">{t('perKg')}</span>
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-forest-dark/80">{fruit.description[locale]}</p>
          <div className="mt-8 max-w-xs"><AddToCart slug={fruit.slug} inStock={fruit.inStock} /></div>
          <p className="mt-4 text-sm text-forest-dark/60">{hero('note')}</p>
        </div>
      </div>
    </section>
  );
}