import { NextResponse } from 'next/server';
import { getLiveFruits } from '@/lib/prices';
import { baseOptions } from '@/lib/options';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await getLiveFruits();
  const body = Object.fromEntries(
    list.map((f) => [
      f.slug,
      { status: f.status, hidePrice: !!f.hidePrice, name: f.name, options: baseOptions(f) }
    ])
  );
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}