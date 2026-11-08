import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('nav');
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <Link href="/" className="btn btn-primary mt-8">{t('home')}</Link>
    </div>
  );
}