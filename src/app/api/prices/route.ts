import { NextResponse } from 'next/server';
import { getLiveFruits } from '@/lib/prices';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await getLiveFruits();
  const body = Object.fromEntries(
    list.map((f) => [f.slug, { pricePerKg: f.pricePerKg, status: f.status }])
  );
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
