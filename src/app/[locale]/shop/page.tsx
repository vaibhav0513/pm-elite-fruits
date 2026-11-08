import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fruits } from '@/data/fruits';
import ShopBrowser from '@/components/shop/ShopBrowser';

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('shop');

  return (
    <section className="container-x py-12">
      <h1 className="text-4xl font-bold md:text-5xl">{t('title')}</h1>
      <p className="mt-3 max-w-xl text-lg text-forest-dark/75">{t('subtitle')}</p>
      <ShopBrowser fruits={fruits} />
    </section>
  );
}