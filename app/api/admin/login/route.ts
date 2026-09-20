import { NextResponse, type NextRequest } from 'next/server';
import { adminPassword, checkPassword, cookieOptions, createSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!adminPassword()) {
    return NextResponse.json(
      { ok: false, error: 'No dashboard password is set. Add ADMIN_PASSWORD to your .env file.' },
      { status: 503 },
    );
  }

  let body: { password?: unknown } = {};
  try {
    body = (await request.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (!checkPassword(body.password)) {
    return NextResponse.json({ ok: false, error: 'That password is not right.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSession(), cookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { ...cookieOptions(), maxAge: 0 });
  return response;
}
