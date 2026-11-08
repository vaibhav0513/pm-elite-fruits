import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default async function SeasonBanner() {
  const t = await getTranslations('home');
  return (
    <section className="container-x py-12">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border-2 border-gold bg-mango/20 px-8 py-10 md:px-14 md:py-12">
          <span aria-hidden="true" className="absolute -right-4 -top-6 select-none text-[9rem] opacity-90 md:right-10 md:text-[11rem]">🥭</span>
          <div className="relative max-w-lg">
            <h2 className="text-3xl font-bold md:text-4xl">{t('seasonTitle')}</h2>
            <p className="mt-3 text-lg text-forest-dark/80">{t('seasonText')}</p>
            <Link href="/shop/mango" className="btn btn-primary mt-6">{t('seasonCta')}</Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}