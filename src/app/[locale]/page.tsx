import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import FeaturedFruits from '@/components/home/FeaturedFruits';
import SeasonBanner from '@/components/home/SeasonBanner';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedFruits />
      <SeasonBanner />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}