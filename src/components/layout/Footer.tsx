import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { site } from '@/config/site';

export default function Footer() {
  const t = useTranslations('footer');
  const n = useTranslations('nav');

  const waLink = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('whatsappMsg'))}`;

  return (
    <footer className="mt-16 bg-forest text-cream">
      <div className="container-x grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="" width={52} height={52} className="rounded-full" />
            <span className="font-serif text-xl font-bold text-white">{site.name}</span>
          </div>
          <p className="mt-4 font-hand text-2xl text-gold-light">{t('tagline')}</p>
        </div>

        <nav aria-label={t('links')}>
          <h2 className="text-lg font-bold text-white">{t('links')}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-gold-light" href="/shop">{n('shop')}</Link></li>
            <li><Link className="hover:text-gold-light" href="/bulk-order">{n('bulk')}</Link></li>
            <li><Link className="hover:text-gold-light" href="/about">{n('about')}</Link></li>
            <li><Link className="hover:text-gold-light" href="/contact">{n('contact')}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-lg font-bold text-white">{t('contact')}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{site.address}</li>
            <li>
              <a className="hover:text-gold-light" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                {site.phone}
              </a>
            </li>
          </ul>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow transition hover:scale-105 hover:brightness-110"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2a9.9 9.9 0 0 0-8.43 15.1L2 22l5.05-1.55A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3 .92.98-2.92-.2-.31a8.2 8.2 0 1 1 6.7 3.63Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.54.12.16 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.48-.29Z" />
            </svg>
            {t('whatsappBtn')}
          </a>
        </div>
      </div>
      <div className="border-t border-gold/30 py-4 text-center text-xs text-cream/70">
        © {new Date().getFullYear()} {site.name}. {t('rights')}
      </div>
    </footer>
  );
}