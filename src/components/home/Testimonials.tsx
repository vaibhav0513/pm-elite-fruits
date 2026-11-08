import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ui/ScrollReveal';

type Item = { name: string; place: string; text: string };

export default async function Testimonials() {
  const t = await getTranslations('home.testimonials');
  const items = t.raw('items') as Item[];

  return (
    <section className="container-x py-12">
      <h2 className="text-3xl font-bold md:text-4xl">{t('title')}</h2>
      <p className="mt-2 text-forest-dark/70">{t('subtitle')}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <ScrollReveal key={item.name} delay={i * 0.1}>
            <figure className="flex h-full flex-col rounded-3xl border border-gold/40 bg-white p-6">
              <div className="text-gold" role="img" aria-label={t('rating')}>★★★★★</div>
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-forest-dark/85">{item.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-forest font-serif text-lg font-bold text-white">
                  {item.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-forest">{item.name}</span>
                  <span className="block text-sm text-forest-dark/60">{item.place}</span>
                </span>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}