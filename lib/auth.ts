import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'lf_session';
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || 'linkforge-local-dev-secret';
}

/** The dashboard password from the environment, or null when none is configured. */
export function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  return value && value.trim() ? value.trim() : null;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function checkPassword(input: unknown): boolean {
  const real = adminPassword();
  return typeof input === 'string' && real !== null && safeEqual(input, real);
}

export function createSession(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TTL_MS })).toString('base64url');
  return payload + '.' + sign(payload);
}

export function verifySession(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
}

/** True when the current request carries a valid dashboard session cookie. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export const SESSION_MAX_AGE = Math.floor(TTL_MS / 1000);

/** Only mark the cookie Secure when the site is actually served over HTTPS. */
export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
    secure: (process.env.SITE_URL || '').startsWith('https://'),
  };
}
