import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'node:crypto';

const COOKIE = 'pm_admin';
const secret = () => process.env.ADMIN_SESSION_SECRET ?? '';
const key = () => new TextEncoder().encode(secret());

const sha = (s: string) => createHash('sha256').update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

export function adminConfigured() {
  return secret().length >= 32 && !!process.env.ADMIN_PASSWORD && !!process.env.ADMIN_EMAIL;
}

export function credentialsOk(email: string, password: string) {
  const realEmail = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const realPass = process.env.ADMIN_PASSWORD ?? '';
  if (!realEmail || !realPass) return false;
  const emailOk = same(email.trim().toLowerCase(), realEmail);
  const passOk = same(password, realPass);
  return emailOk && passOk;
}

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}