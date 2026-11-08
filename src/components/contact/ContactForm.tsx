'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { site } from '@/config/site';

type Errors = { name?: string; phone?: string; message?: string };

export default function ContactForm() {
  const t = useTranslations('contact');
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').replace(/\D/g, '');
    const message = String(data.get('message') || '').trim();

    const next: Errors = {};
    if (!name) next.name = t('nameRequired');
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = t('phoneInvalid');
    if (!message) next.message = t('messageRequired');
    setErrors(next);
    if (Object.keys(next).length) return;

    const text = t('waMessage', { name, phone, message });
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  const field = 'mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-forest-dark';
  const ok = 'border-gold/60';
  const bad = 'border-berry';

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-gold/40 bg-white p-6 md:p-8">
      <h2 className="text-2xl font-bold">{t('formTitle')}</h2>

      <div className="mt-5">
        <label htmlFor="name" className="text-sm font-medium text-forest">{t('name')}</label>
        <input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} className={`${field} ${errors.name ? bad : ok}`} />
        {errors.name && <p id="name-err" className="mt-1 text-sm text-berry">{errors.name}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="phone" className="text-sm font-medium text-forest">{t('phone')}</label>
        <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-err' : undefined} className={`${field} ${errors.phone ? bad : ok}`} />
        {errors.phone && <p id="phone-err" className="mt-1 text-sm text-berry">{errors.phone}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-sm font-medium text-forest">{t('message')}</label>
        <textarea id="message" name="message" rows={4} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} className={`${field} ${errors.message ? bad : ok}`} />
        {errors.message && <p id="message-err" className="mt-1 text-sm text-berry">{errors.message}</p>}
      </div>

      <button type="submit" className="btn btn-primary mt-6 w-full">{t('send')}</button>
      <p className="mt-3 text-sm text-forest-dark/60">{t('note')}</p>
    </form>
  );
}