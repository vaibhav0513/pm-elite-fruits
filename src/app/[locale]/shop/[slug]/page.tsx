import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { fruits } from '@/data/fruits';
import { getLiveFruit } from '@/lib/prices';
import { baseOptions, priceSuffix } from '@/lib/options';
import AddToCart from '@/components/shop/AddToCart';
import FruitGallery from '@/components/shop/FruitGallery';

export const revalidate = 300;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => fruits.map((f) => ({ locale, slug: f.slug })));
}

const dateLocales = { en: 'en-IN', mr: 'mr-IN', hi: 'hi-IN' } as const;

export default async function FruitPage({ params }: { params: Promise<{ locale: 'en' | 'mr' | 'hi'; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const fruit = await getLiveFruit(slug);
  if (!fruit) notFound();
  const t = await getTranslations('shop');
  const hero = await getTranslations('hero');

  const upcoming = fruit.status === 'upcoming';
  const options = baseOptions(fruit);
  const single = options.length === 1 ? options[0] : null;
  const updated = fruit.updatedAt
    ? new Intl.DateTimeFormat(dateLocales[locale], { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(fruit.updatedAt))
    : null;
  const pill = 'mt-4 inline-block rounded-full bg-gold/20 px-5 py-2 text-2xl font-semibold text-forest';

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

          {upcoming ? (
            <p className={pill}>{t('comingSoon')}</p>
          ) : fruit.hidePrice ? (
            <p className={pill}>{t('priceOnRequest')}</p>
          ) : (
            <>
              {single && (
                <p className="mt-4 text-4xl font-semibold text-leaf">
                  ₹{single.price}{' '}
                  <span className="text-base font-normal text-forest-dark/70">{priceSuffix(single, t('perKg'))}</span>
                </p>
              )}
              {updated && <p className="mt-1 text-sm text-forest-dark/60">{t('priceUpdated', { date: updated })}</p>}
            </>
          )}

          <p className="mt-5 max-w-md text-lg leading-relaxed text-forest-dark/80">{fruit.description[locale]}</p>

          <div className="mt-8 max-w-sm">
            {upcoming ? (
              <p className="text-forest-dark/70">{t('comingSoonNote')}</p>
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
          {!upcoming && !fruit.hidePrice && <p className="mt-4 text-sm text-forest-dark/60">{hero('note')}</p>}
        </div>
      </div>
    </section>
  );
}