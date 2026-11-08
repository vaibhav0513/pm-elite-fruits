import { getTranslations, setRequestLocale } from 'next-intl/server';
import { site } from '@/config/site';
import ContactForm from '@/components/contact/ContactForm';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const rows = [
    { label: t('call'), value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    { label: t('whatsapp'), value: site.phone, href: `https://wa.me/${site.whatsapp}` },
    { label: t('visit'), value: site.address },
    { label: t('hours'), value: site.hours }
  ];

  return (
    <section className="container-x py-12 md:py-16">
      <h1 className="text-4xl font-bold md:text-5xl">{t('title')}</h1>
      <p className="mt-3 max-w-xl text-lg text-forest-dark/75">{t('subtitle')}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <div className="rounded-3xl border border-gold/40 bg-cream-deep/60 p-6 md:p-8">
          <h2 className="text-2xl font-bold">{t('infoTitle')}</h2>
          <dl className="mt-5 space-y-5">
            {rows.map((r) => (
              <div key={r.label}>
                <dt className="text-sm text-forest-dark/60">{r.label}</dt>
                <dd className="mt-0.5 text-lg font-medium text-forest">
                  {r.href ? <a href={r.href} className="hover:text-leaf">{r.value}</a> : r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}