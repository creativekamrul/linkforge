import fs from 'node:fs';
import path from 'node:path';
import { parse as parseJsonc, printParseErrorCode, type ParseError } from 'jsonc-parser';
import { siteConfigSchema, type SiteConfig } from './types';
import { resolveTheme, type ResolvedTheme } from './theme';

export const CONFIG_PATH =
  (process.env.CONFIG_PATH && process.env.CONFIG_PATH.trim()) ||
  path.join(process.cwd(), 'data', 'site.json');

/**
 * Config shipped inside the image. Used when CONFIG_PATH does not exist yet -
 * which is exactly what happens when an empty host folder is bind-mounted over
 * /app/data: a mount hides whatever the image had at that path.
 */
export const DEFAULT_CONFIG_PATH =
  (process.env.DEFAULT_CONFIG_PATH && process.env.DEFAULT_CONFIG_PATH.trim()) ||
  path.join(process.cwd(), 'defaults', 'site.json');

/** Raised when the JSON file is missing, unparseable or fails validation. */
export class ConfigError extends Error {
  file: string;
  issues: string[];

  constructor(file: string, message: string, issues: string[]) {
    super(message);
    this.name = 'ConfigError';
    this.file = file;
    this.issues = issues;
  }
}

export type ResolvedSite = {
  file: string;
  updatedAt: string;
  siteUrl: string;
  config: SiteConfig;
  theme: ResolvedTheme;
};

type CacheEntry = { key: string; value: ResolvedSite };

// Small mtime-keyed cache: editing the file invalidates it on the next request,
// so a change on disk shows up instantly without a restart or a rebuild.
let cache: CacheEntry | null = null;

function statKey(file: string): string {
  try {
    const stat = fs.statSync(file);
    return stat.mtimeMs + ':' + stat.size;
  } catch {
    return 'missing';
  }
}

function preview(text: string, offset: number): string {
  const line = text.slice(0, offset).split('\n').length;
  const column = offset - text.lastIndexOf('\n', offset - 1);
  return 'line ' + line + ', column ' + column;
}

function parseConfigText(file: string, text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) throw new ConfigError(file, 'Config file is empty', ['Add at least a "profile" object.']);

  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall back to JSON-with-comments so // comments and trailing commas are allowed.
  }

  const errors: ParseError[] = [];
  const value = parseJsonc(trimmed, errors, { allowTrailingComma: true, disallowComments: false });
  if (errors.length > 0) {
    const first = errors[0];
    throw new ConfigError(file, 'Could not parse the config file', [
      printParseErrorCode(first.error) + ' at ' + preview(trimmed, first.offset),
    ]);
  }
  return value;
}

function formatIssues(issues: Array<{ path: Array<string | number>; message: string }>): string[] {
  return issues.map((issue) => {
    const where = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    return where + ' - ' + issue.message;
  });
}

function exists(file: string): boolean {
  try {
    fs.accessSync(file, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Prefers the real config, falls back to the seed that ships in the image and
 * copies it into place once so the dashboard can start saving immediately. If
 * the mount is read-only we still serve the seed instead of an error page.
 */
let seedAttempted = false;

function readSource(): { file: string; seeded: boolean } {
  if (exists(CONFIG_PATH)) return { file: CONFIG_PATH, seeded: false };
  if (!exists(DEFAULT_CONFIG_PATH)) return { file: CONFIG_PATH, seeded: false };

  if (!seedAttempted) {
    seedAttempted = true;
    try {
      fs.copyFileSync(DEFAULT_CONFIG_PATH, CONFIG_PATH);
      return { file: CONFIG_PATH, seeded: false };
    } catch {
      // Read-only mount or an unwritable folder: serve the seed anyway.
    }
  }
  return { file: DEFAULT_CONFIG_PATH, seeded: true };
}

export function loadSite(): ResolvedSite {
  const source = readSource();
  const file = source.file;
  const key = file + '|' + statKey(CONFIG_PATH) + '|' + statKey(DEFAULT_CONFIG_PATH);
  if (cache && cache.key === key) return cache.value;

  let text: string;
  let updatedAt: string;
  try {
    text = fs.readFileSync(file, 'utf8');
    updatedAt = new Date(fs.statSync(file).mtimeMs).toISOString();
  } catch {
    throw new ConfigError(file, 'Config file not found', [
      'No file at ' + CONFIG_PATH,
      'Mount a folder that already contains site.json, or let the app seed it from ' +
        DEFAULT_CONFIG_PATH + '.',
    ]);
  }

  const parsed = parseConfigText(file, text);
  const result = siteConfigSchema.safeParse(parsed);
  if (!result.success) {
    throw new ConfigError(file, 'The config file has problems', formatIssues(result.error.issues));
  }

  const config = result.data;
  const rawUrl = (process.env.SITE_URL && process.env.SITE_URL.trim()) || config.site.url || '';
  const siteUrl = (rawUrl || 'http://localhost:3000').replace(/\/+$/, '');

  const value: ResolvedSite = {
    file,
    updatedAt,
    siteUrl,
    config,
    theme: resolveTheme(config.theme),
  };
  cache = { key, value };
  return value;
}

/** Never throws - returns a fallback site so the shell can still render. */
export function safeLoadSite(): { site: ResolvedSite | null; error: ConfigError | null } {
  try {
    return { site: loadSite(), error: null };
  } catch (error) {
    if (error instanceof ConfigError) return { site: null, error };
    return {
      site: null,
      error: new ConfigError(CONFIG_PATH, 'Unexpected error while loading config', [String(error)]),
    };
  }
}


/**
 * Validates the dashboard payload and writes it back to the config file: temp
 * file first, then an atomic rename, so a crash mid-write can never leave a
 * half-written site.json behind. The mtime cache is dropped immediately.
 */
export function saveSite(input: unknown): SiteConfig {
  const parsed = siteConfigSchema.safeParse(input);
  if (!parsed.success) {
    throw new ConfigError(
      CONFIG_PATH,
      'The config did not validate - nothing was written',
      formatIssues(parsed.error.issues),
    );
  }
  const text = JSON.stringify(parsed.data, null, 2) + '\n';
  const tmp = CONFIG_PATH + '.tmp';
  fs.writeFileSync(tmp, text, 'utf8');
  fs.renameSync(tmp, CONFIG_PATH);
  cache = null;
  return parsed.data;
}