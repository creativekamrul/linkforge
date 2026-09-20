import { NextResponse, type NextRequest } from 'next/server';
import { isAuthed } from '@/lib/auth';
import { CONFIG_PATH, ConfigError, saveSite } from '@/lib/config';

export const dynamic = 'force-dynamic';

/** Writes the dashboard's edits back to data/site.json (atomic: temp file + rename). */
export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: 'Your session has expired - sign in again.' }, { status: 401 });
  }

  let payload: { config?: unknown };
  try {
    payload = (await request.json()) as { config?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const config = saveSite(payload.config);
    return NextResponse.json({
      ok: true,
      file: CONFIG_PATH,
      savedAt: new Date().toISOString(),
      counts: {
        links: config.links.length,
        socials: config.socials.length,
        stats: config.stats.length,
        stack: config.stack.length,
        experience: config.experience.length,
        sections: config.sections.length,
      },
    });
  } catch (error) {
    if (error instanceof ConfigError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          'Could not write the file: ' +
          (error instanceof Error ? error.message : String(error)) +
          ' - if you run this in Docker, make sure ./data is mounted read-write.',
      },
      { status: 500 },
    );
  }
}
