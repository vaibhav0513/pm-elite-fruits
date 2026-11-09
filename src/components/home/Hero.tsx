import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import FloatingFruits from './FloatingFruits';

export default async function Hero() {
  const t = await getTranslations('hero');
  return (
    <section className="container-x grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
      <div className="animate-rise">
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">{t('title')}</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-forest-dark/80">{t('subtitle')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-primary">{t('shop')}</Link>
          {/* <Link href="/bulk-order" className="btn btn-outline">{t('bulk')}</Link> */}
        </div>
        <p className="mt-4 text-sm text-forest-dark/60">{t('note')}</p>
      </div>

      <div className="relative mx-auto w-full max-w-sm md:max-w-md">
        <Image src="/logo.jpeg" alt="PM Elite Fruits" width={600} height={600} priority className="rounded-full shadow-2xl shadow-forest/20" />
        <FloatingFruits />
      </div>
    </section>
  );
}