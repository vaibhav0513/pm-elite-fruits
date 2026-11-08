'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

type NavLink = { href: string; label: string };

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-panel"
        aria-label={open ? t('close') : t('menu')}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-gold/60"
      >
        <span className={`h-0.5 w-5 bg-forest transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`h-0.5 w-5 bg-forest transition ${open ? 'opacity-0' : ''}`} />
        <span className={`h-0.5 w-5 bg-forest transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      <div
        id="mobile-panel"
        className={`absolute inset-x-0 top-full border-b border-gold/40 bg-cream px-5 shadow-lg transition-all duration-300 ${
          open ? 'visible max-h-96 py-5 opacity-100' : 'invisible max-h-0 overflow-hidden py-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-lg font-medium text-forest hover:bg-gold/15">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4"><LanguageSwitcher /></div>
      </div>
    </div>
  );
}