import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { site } from '@/config/site';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import CartBadge from '@/components/cart/CartBadge';

export default function Header() {
  const t = useTranslations('nav');
  const links = [
    { href: '/', label: t('home') },
    { href: '/shop', label: t('shop') },
    { href: '/bulk-order', label: t('bulk') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-cream/90 backdrop-blur">
      <div className="container-x relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="" width={44} height={44} className="rounded-full" />
          <span className="font-serif text-lg font-bold text-forest">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-forest/80 transition hover:text-leaf">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block"><LanguageSwitcher /></div>
                    <Link href="/cart" aria-label={t('cart')} className="relative flex h-10 items-center gap-2 rounded-full bg-forest px-4 text-sm font-semibold text-white transition hover:bg-leaf">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 7H6" />
            </svg>
            <span className="hidden sm:inline">{t('cart')}</span>
            <CartBadge />
          </Link>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}