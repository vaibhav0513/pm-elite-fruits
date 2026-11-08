import { getTranslations } from 'next-intl/server';
import ScrollReveal from '@/components/ui/ScrollReveal';

const keys = [
  { key: 'fresh', icon: '🌿' },
  { key: 'pay', icon: '💵' },
  { key: 'bulk', icon: '📦' }
] as const;

export default async function WhyChooseUs() {
  const t = await getTranslations('home.why');
  return (
    <section className="container-x py-12">
      <h2 className="text-3xl font-bold md:text-4xl">{t('title')}</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {keys.map((k, i) => (
          <ScrollReveal key={k.key} delay={i * 0.1}>
            <div className="h-full rounded-3xl border border-gold/40 bg-cream-deep/60 p-6">
              <span className="text-4xl" aria-hidden="true">{k.icon}</span>
              <h3 className="mt-4 text-xl font-bold">{t(`${k.key}.title`)}</h3>
              <p className="mt-2 leading-relaxed text-forest-dark/75">{t(`${k.key}.text`)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}