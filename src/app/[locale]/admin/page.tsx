import { setRequestLocale } from 'next-intl/server';
import { isAdmin } from '@/lib/adminAuth';
import { getLiveFruits } from '@/lib/prices';
import { baseOptions } from '@/lib/options';
import AdminLogin from '@/components/admin/AdminLogin';
import PriceEditor from '@/components/admin/PriceEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await isAdmin())) {
    return (
      <section className="container-x py-12">
        <AdminLogin />
      </section>
    );
  }

  const live = await getLiveFruits();
  const rows = live.map((f) => ({
    slug: f.slug,
    emoji: f.emoji,
    name: f.name,
    description: f.description,
    status: f.status ?? 'available',
    hidePrice: !!f.hidePrice,
    options: baseOptions(f)
  }));

  return (
    <section className="container-x py-12">
      <PriceEditor fruits={rows} />
    </section>
  );
}