import { getTranslations, setRequestLocale } from 'next-intl/server';
import CartView from '@/components/cart/CartView';

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('cart');

  return (
    <section className="container-x py-12">
      <h1 className="font-serif text-4xl font-bold text-forest">{t('title')}</h1>
      <CartView />
    </section>
  );
}