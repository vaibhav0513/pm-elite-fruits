import { NextResponse } from 'next/server';
import { adminConfigured, createSession, credentialsOk } from '@/lib/adminAuth';

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Admin is not set up yet.' }, { status: 500 });
  }
  let email = '';
  let password = '';
  try {
    const b = (await req.json()) as { email?: unknown; password?: unknown };
    email = typeof b.email === 'string' ? b.email : '';
    password = typeof b.password === 'string' ? b.password : '';
  } catch {
    /* ignore bad body */
  }
  if (!credentialsOk(email, password)) {
    await new Promise((r) => setTimeout(r, 1000)); // slows down guessing
    return NextResponse.json({ error: 'Wrong email or password.' }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}