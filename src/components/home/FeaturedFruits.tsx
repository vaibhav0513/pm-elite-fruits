import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLiveFruits } from '@/lib/prices';
import { baseOptions, priceSuffix } from '@/lib/options';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FruitImage from '@/components/shop/FruitImage';

export default async function FeaturedFruits() {
  const t = await getTranslations('home');
  const shop = await getTranslations('shop');
  const locale = (await getLocale()) as 'en' | 'mr' | 'hi';
  const featured = (await getLiveFruits()).filter((f) => f.featured);
  const pill = 'mt-1 inline-block rounded-full bg-gold/20 px-3 py-1 text-sm font-semibold text-forest';

  return (
    <section className="container-x py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">{t('featuredTitle')}</h2>
          <p className="mt-2 text-forest-dark/70">{t('featuredSub')}</p>
        </div>
        <Link href="/shop" className="btn btn-outline">{t('viewAll')}</Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {featured.map((f, i) => {
          const first = baseOptions(f)[0];
          return (
            <ScrollReveal key={f.slug} delay={i * 0.08}>
              <Link href={`/shop/${f.slug}`} className="group block overflow-hidden rounded-3xl border border-gold/40 bg-white transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl hover:shadow-gold/20">
                <div className={`relative aspect-square overflow-hidden ${f.tint}`}>
                  <FruitImage src={f.images?.[0]} emoji={f.emoji} sizes="(min-width: 768px) 25vw, 50vw" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold">{f.name[locale]}</h3>
                  {f.status === 'upcoming' ? (
                    <p className={pill}>{shop('comingSoon')}</p>
                  ) : f.hidePrice ? (
                    <p className={pill}>{shop('priceOnRequest')}</p>
                  ) : (
                    <p className="mt-1 text-sm text-forest-dark/70">
                      <span className="text-lg font-semibold text-leaf">₹{first.price}</span> {priceSuffix(first, t('perKg'))}
                    </p>
                  )}
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}