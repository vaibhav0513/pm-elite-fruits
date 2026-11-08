'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const labels: Record<string, string> = { en: 'English', mr: 'मराठी', hi: 'हिन्दी' };

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t('language')} className="inline-flex rounded-full border border-gold/60 bg-white/70 p-0.5">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          disabled={pending}
          onClick={() => startTransition(() => router.replace(pathname, { locale: l }))}
          className={`rounded-full px-3 py-1 text-sm transition ${
            l === locale ? 'bg-forest text-white' : 'text-forest hover:bg-gold/20'
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}