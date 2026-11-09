import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/config/site';
import { fruits } from '@/data/fruits';
import { FOUNDED_YEAR, aboutStats } from '@/data/about';
import CountUp from '@/components/ui/CountUp';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Milestone = { year: string; title: string; text: string };

// Put the owner's photo in /public/images/ and write its path here, for example '/images/owner.jpg'.
// Leave it empty to show the "PM" circle instead.
const OWNER_PHOTO = '';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const c = await getTranslations('contact');
  const milestones = t.raw('milestones') as Milestone[];

  const stats = [
    { to: new Date().getFullYear() - FOUNDED_YEAR, suffix: '+', label: t('stats.years') },
    { to: aboutStats.customers, suffix: '+', label: t('stats.customers') },
    { to: aboutStats.kgDelivered, suffix: '+', label: t('stats.kg') },
    { to: fruits.length, suffix: '', label: t('stats.varieties') }
  ];

  return (
    <>
      <section className="container-x py-12 md:py-16">
        <h1 className="text-4xl font-bold md:text-6xl">{t('title')}</h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-forest-dark/80">{t('subtitle')}</p>
      </section>

      <section className="container-x pb-8" aria-label={t('stats.label')}>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-gold/40 bg-white p-6 text-center">
              <dt className="order-2 mt-1 text-sm text-forest-dark/70">{s.label}</dt>
              <dd className="font-serif text-4xl font-bold text-forest md:text-5xl"><CountUp to={s.to} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x py-12">
        <h2 className="text-3xl font-bold md:text-4xl">{t('journeyTitle')}</h2>
        <ol className="mt-8 ml-3 border-l-2 border-gold/70">
          {milestones.map((m, i) => (
            <li key={m.year} className="relative pb-10 pl-8 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-gold bg-cream" />
              <ScrollReveal delay={i * 0.05}>
                <p className="font-serif text-2xl font-bold text-leaf">{m.year}</p>
                <h3 className="mt-1 text-xl font-bold">{m.title}</h3>
                <p className="mt-1 max-w-xl leading-relaxed text-forest-dark/75">{m.text}</p>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x py-12">
        <div className="grid items-center gap-8 rounded-3xl border-2 border-gold bg-cream-deep/60 p-6 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">{t('familyTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-forest-dark/80">{t('familyText')}</p>
          </div>
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-white">
            {site.familyPhoto ? (
              <Image src={site.familyPhoto} alt={t('familyPhotoAlt')} width={640} height={480} className="h-full w-full object-cover" />
            ) : (
              <span className="text-8xl" aria-hidden="true">👨‍👩‍👧‍👦</span>
            )}
          </div>
        </div>
      </section>

      <section className="container-x py-12" aria-labelledby="owner-title">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold/40 bg-white p-6 text-center md:flex-row md:gap-10 md:p-10 md:text-left">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold bg-cream-deep/60 md:h-40 md:w-40">
              {OWNER_PHOTO ? (
                <Image src={OWNER_PHOTO} alt={t('ownerName')} width={160} height={160} className="h-full w-full object-cover" />
              ) : (
                <span className="font-serif text-4xl font-bold text-forest md:text-5xl" aria-hidden="true">PM</span>
              )}
            </div>

            <div>
              <h2 id="owner-title" className="text-sm font-semibold uppercase tracking-wide text-leaf">{t('ownerTitle')}</h2>
              <p className="mt-1 font-serif text-3xl font-bold text-forest md:text-4xl">{t('ownerName')}</p>
              <p className="text-forest-dark/70">{t('ownerRole')}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-forest-dark/80">{t('ownerText')}</p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-leaf"
                >
                  {c('call')}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  {c('whatsapp')}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="container-x py-12 text-center">
        <h2 className="text-3xl font-bold">{t('ctaTitle')}</h2>
        <Link href="/shop" className="btn btn-primary mt-6">{t('ctaButton')}</Link>
      </section>
    </>
  );
}