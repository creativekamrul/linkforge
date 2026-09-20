# LinkForge

A modern, elegant link page — a LinkStack alternative with a better default design,
no database. **Everything on the page comes from one JSON file** - edited by hand or in the
built-in dashboard.

```
data/site.json   ←  edit this. reload the browser. done.
```

No rebuild, no restart. The container re-reads the file on every request, so a change is
live the moment you refresh - whether it came from your editor or from the dashboard.

---

## Quick start

### With Docker (recommended)

```bash
docker compose up -d --build
# open http://localhost:3000 - or whatever PORT you set in .env
```

`docker-compose.yml` bind-mounts `./data` into the container, so editing
`data/site.json` on the host is reflected the moment you refresh the page — the
container keeps running the whole time.

### Without Docker

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
```

Production build:

```bash
npm run build
npm run start
```

---

## How the config works

`data/site.json` is read from disk at request time. A change on disk invalidates an
internal mtime cache, so your edit is live on the next page load.

* **Missing file / broken JSON / wrong types** → the page is replaced with a friendly
  error screen that lists exactly what is wrong and which line, e.g.
  `links.3.url - must start with https://, http://, mailto:, tel: or /`.
  `/api/health` returns `503` in that state, so orchestrators can see it too.
* **Comments and trailing commas are allowed.** Strict JSON is parsed first; if that
  fails, a JSON-with-comments parser takes over. So `// like this` is fine.
* **Autocomplete in your editor.** `data/site.json` starts with
  `"$schema": "./site.schema.json"`, so VS Code (or anything else that understands
  JSON Schema) gives you completion, hover documentation and inline validation for
  every field while you type.

### Top-level structure

```jsonc
{
  "site":       { "url": "...", "language": "en" },   // deployment bits
  "profile":    { "name": "...", ... },               // who you are
  "theme":      { "preset": "midnight", ... },        // look and feel
  "stats":      [ { "value": "100+", "label": "projects shipped" } ],
  "links":      [ { "label": "...", "url": "..." } ], // the main list
  "stack":      [ "React", "Next.js", "Node.js" ],    // tech chips
  "experience": [ { "role": "CTO", "company": "..." } ],
  "socials":    [ { "platform": "github", "url": "..." } ],
  "settings":   { "showQrCode": true, ... },          // which controls appear
  "seo":      { "title": "...", ... },              // search + social previews
  "footer":   { "text": "...", "branding": true }
}
```

Only `profile.name` is truly required; everything else has a sensible default.
The full field-by-field reference with descriptions lives in
[`data/site.schema.json`](data/site.schema.json).

---

## Editing the JSON

### Add a link

Append to the `links` array — order is preserved exactly:

```json
{ "label": "Newsletter", "url": "https://example.substack.com", "description": "Twice a month", "icon": "mail" }
```

| Field | Required | What it does |
| --- | --- | --- |
| `label` | yes | Bold text on the card |
| `url` | yes | `https://…`, `mailto:…`, `tel:…` or `/file.pdf` for something in `public/` |
| `description` | no | Small grey second line |
| `icon` | no | Built-in icon name or a brand name (see below) |
| `badge` | no | Tiny pill next to the label, e.g. `"New"` |
| `group` | no | Section heading; consecutive links with the same group share one heading |
| `stack` | no | Tech tags under the description, e.g. `["Next.js", "Prisma", "PostgreSQL"]` |
| `featured` | no | Accent-gradient card for the one link you care about most |
| `openInNewTab` | no | Overrides the global setting for this link only |

### Group links into sections

Give consecutive links the same `group` and a heading appears automatically:

```json
{ "group": "Work", "label": "Portfolio", "url": "https://example.com", "icon": "globe" },
{ "group": "Work", "label": "My CV", "url": "/resume.pdf", "icon": "file" },
{ "group": "Support", "label": "Buy me a coffee", "url": "https://buymeacoffee.com/you", "icon": "coffee" }
```

### Icons

`links[].icon` accepts a built-in stroke icon — `globe`, `link`, `briefcase`,
`calendar`, `file`, `mail`, `cart`, `podcast`, `coffee`, `palette`, `code`, `video`,
`camera`, `music`, `book`, `heart`, `star`, `map-pin`, `phone`, `download`, `play`,
`rss`, `sparkles`, `zap`, `users`, `message`, `send`, `trophy`, `graduation`, `gift`,
`image`, `shield` — or **any brand name** such as `github`, `spotify`, `figma`,
`notion`, `steam`, `vercel`. Brand glyphs come from [simple-icons](https://simpleicons.org),
so there are ~3000 of them. Unknown names quietly fall back to a globe.

### Socials

The round buttons under your links. The `platform` is a brand name (`github`, `x`,
`linkedin`, `instagram`, `youtube`, `tiktok`, `discord`, `telegram`, `whatsapp`,
`reddit`, `dribbble`, `bluesky`, `threads`, `mastodon`, `spotify`, …) or `email` for a
mail icon. `label` overrides the tooltip and screen-reader text.

### Themes

Pick a `preset` and then override any single colour:

| preset | vibe |
| --- | --- |
| `midnight` | deep blue-black, violet + cyan (default) |
| `aurora` | near-black, emerald + sky |
| `sunset` | plum-black, rose + amber |
| `ocean` | navy, sky + teal |
| `forest` | dark green, lime + emerald |
| `mono` | pure greyscale |
| `paper` | warm light theme |
| `terminal` | high-contrast ink-green, lime + violet |
| `cream` | warm cream paper, ink text, coral highlights (light) |

```json
"theme": {
  "preset": "midnight",
  "radius": "xl",
  "font": "inter",
  "displayFont": "inter",
  "backgroundStyle": "aurora",
  "backgroundStyle": "grid",
  "animations": true
}
```

`card` is `glass` (frosted), `solid` (opaque panel) or `outline` (border only).
`backgroundStyle` is `aurora` (drifting colour blobs), `mesh`, `grid`, `dots` or
`plain`. Fonts are `inter`, `manrope`, `geist`, `plus-jakarta`, `space-grotesk`,
`jetbrains-mono`, `playfair`, `dm-sans`, `instrument-serif` and are loaded from Google
Fonts at runtime — so the Docker build never needs network access.
`prefers-reduced-motion` is always respected.

`font` sets the body face; `displayFont` sets the optional second face used for the
profile tagline and the headline numbers. Set both to the same value for a single
typeface (the shipped config uses `inter` everywhere), or pair a sans with a serif
(`inter` + `playfair`) when you want the editorial look. Monospace accents - section
headings, tech tags, dates and the footer - use the system mono stack, so they cost
nothing extra to load unless you pick `jetbrains-mono` as the body font.

Light/dark text colour is derived from how light your `background` actually is, so
setting a light background automatically produces readable dark text.

### Stats, stack and experience (built for developers)

Three optional arrays turn the page from a link list into a developer profile. Each one
is rendered only when it has content, so you can delete any of them.

```json
"stats": [
  { "value": "100+", "label": "projects shipped" },
  { "value": "8 yrs", "label": "building for the web" }
],

"stack": ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Docker"],

"experience": [
  {
    "period": "2025 - Present",
    "role": "Chief Technology Officer",
    "company": "FluxCredit Inc.",
    "summary": "Leading technology across the business, including a CRM used by 1,000+ people.",
    "tags": ["CRM", "IT admin"]
  }
]
```

* **`stats`** is the proof strip under your name: big numbers in the serif display
  face, labels in monospace. Three items look best.
* **`stack`** is your toolkit, rendered as chips. Every name is looked up in
  [simple-icons](https://simpleicons.org) for its official brand glyph — `React`,
  `Next.js`, `Node.js`, `PostgreSQL`, `Docker`, `WordPress` and ~3000 more all have
  one. Anything without a glyph (say `JetEngine`) gets a tidy monogram instead, so
  nothing breaks.
* **`experience`** is a compact résumé timeline, most recent role first. `role` is the
  only required field.

Section headings are generated automatically and read like config comments
(`# stack`, `# experience`), and each link card can carry its own `stack` tags.

### Your avatar

Drop the file into `public/` and reference it as `"/photo.jpg"`, or point `avatar` at
any absolute URL. Omit `avatar` and your initials are rendered instead.

---

## What the visitor gets

Beyond the links themselves, each page ships with:

* **Share / Copy link** — native share sheet where supported, clipboard fallback.
* **QR code** — generated on the server at `/qr`, opened in a modal.
* **Save contact** — a real `.vcf` vCard built from your profile at `/vcard`.
* **SEO** — title, description, keywords, Open Graph and Twitter cards, canonical URL.
* **`/sitemap.xml` and `/robots.txt`**, plus `<meta name="theme-color">` matching your
  background.
* Accessible markup, visible focus rings, keyboard-dismissable modal, reduced-motion
  support, and a responsive layout down to small phones.

All of these can be switched off in `settings`.

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | the page |
| `/api/health` | `200` + JSON when the config is valid, `503` with the list of problems when it is not |
| `/qr?target=…` | SVG QR code |
| `/vcard` | downloadable `.vcf` contact card |
| `/sitemap.xml`, `/robots.txt` | SEO |

---

## Docker details

`Dockerfile` is a three-stage build (`deps` → `builder` → `runner`) producing
Next.js' standalone output on `node:22-alpine`, running as a non-root user with a
built-in `HEALTHCHECK` that hits `/api/health`.

Deploy without compose:

```bash
docker build -t linkforge .
docker run -d --name linkforge -p 8080:8080 \
  -e PORT=8080 \
  -e SITE_URL=https://links.example.com \
  -v "$PWD/data:/app/data:ro" \
  linkforge
```

| Env var | Default | Purpose |
| --- | --- | --- |
| `CONFIG_PATH` | `/app/data/site.json` | Where to read the config from |
| `SITE_URL` | value of `site.url` in the JSON | Public URL used for OG tags, QR, vCard, sitemap and robots. Set it to the address you actually browse, port included |
| `PORT` | `3000` | The port the app listens on. Compose publishes it on the host *and* hands it to the app, so host and container always match - no port is hardcoded |

### Changing the port

`PORT` is the only place the port is written down. Compose publishes
`${PORT}:${PORT}` and passes the same value into the container, into the app and into
the healthcheck, so the app listens on exactly the port you published:

```bash
# .env
PORT=8080
SITE_URL=http://192.168.1.50:8080   # the address you actually browse
```

```bash
docker compose up -d --build     # now on :8080, port 3000 is left alone
```

Keep `SITE_URL` and `PORT` in sync - `SITE_URL` is what ends up in the QR code, the
sitemap, the vCard and the social preview tags.

### With Portainer

Create a **stack**, paste `docker-compose.yml`, then set these in the stack's
*Environment variables* section: `PORT`, `SITE_URL`, `ADMIN_PASSWORD`, `AUTH_SECRET`.

**Use `docker-compose.portainer.yml` as the compose path** - it is the same stack with
a named volume instead of a bind mount. Docker seeds a named volume from the image, so
`site.json` is there on the first start and is owned by the app user, which means the
dashboard can save into it.

If you would rather keep the file on the host, use the default `docker-compose.yml` with
an absolute path, because Portainer resolves relative paths against its own working
directory:

```yaml
    volumes:
      - /opt/linkforge/data:/app/data
```

Pick a port that is actually free on the Docker host before you deploy - the app will
fail to start if something else already publishes it.

Either way the app never comes up empty-handed: if the mounted folder has no
`site.json`, it seeds one from the copy baked into the image at `/app/defaults/site.json`
and carries on. You only see the config error screen if both are missing.

Put it behind Caddy, Traefik or nginx for automatic HTTPS.

---

## Project layout

```
app/                 Next.js App Router
  layout.tsx         injects the theme variables + webfont, sets metadata
  page.tsx           loads site.json, renders the page or the config error screen
  qr/ vcard/         QR + vCard route handlers
  api/health/        health + config validation report
components/          ProfileHeader, StatsBar, LinkList, StackRow,
                     ExperienceList, SocialRow, ActionBar, Background, Footer
lib/
  types.ts           zod schema — the single source of truth for valid fields
  config.ts          reads/parses/caches site.json, friendly ConfigError
  theme.ts           presets, colour math, CSS variable generation
  icons.tsx          built-in stroke icons
  brand-icons.tsx    simple-icons bridge for social/brand glyphs
data/site.json       YOUR CONTENT
data/site.schema.json  editor autocomplete + documentation
```

---

## Adding a field

1. Add it to the relevant schema in `lib/types.ts`.
2. Document it in `data/site.schema.json` (so editors autocomplete it).
3. Render it in the component that owns that area.

Validation errors surface automatically on screen, so you cannot ship a broken page.

---

## Notes

**On "Next.js and Vite".** Next.js compiles with its own bundler (Turbopack/webpack) —
Vite is not a drop-in bundler for it, and mixing the two would fight over the build
pipeline. This project therefore uses Next.js + Tailwind CSS v4, which is what gives
you the instant dev reload and the tiny production bundle. If you specifically want a
Vite-powered SPA (for example a separate dashboard on top of the same JSON), say so
and it can be added as a second package — but for the public link page it would only
add weight and lose the server-side QR, vCard and SEO tags.

**Shipped example content.** `data/site.json` currently holds the real profile of
Kamrul Islam — full-stack developer, Dhaka — sourced from his own site
[kamrulinfo.com](https://kamrulinfo.com): 7 links across two groups (Start here,
Open source), 23 stack chips, four roles and three headline numbers. Client work is
deliberately not listed - the work lives on his own site, this page is for the links
that matter. The shipped theme is the neutral blue `midnight` preset and the avatar is
the generic placeholder - no personal brand colours, fonts or logo artwork are bundled.
Swap in your own values; the structure is the point, not the data.

**Rebranding.** `footer.branding` controls the credit line; the app name itself lives
in `package.json`.


## Dashboard (`/admin`)

The same JSON, with a UI. Sign in at `/admin` with `ADMIN_PASSWORD`.

A discreet **edit** pill sits in the bottom-right corner of the public page whenever
`ADMIN_PASSWORD` is set; it links straight to `/admin`. With no password configured it is
not rendered at all.

- **Add, remove and reorder components.** The `sections` array decides which blocks the
  public page renders and in what order: `profile`, `stats`, `links`, `stack`,
  `experience`, `socials`, `actions`, `footer`. Drag a handle to reorder it, `del` to
  remove it, and pick it from "add a component" to bring it back.
- **Every card, pill and button is editable**: link cards (label, url, group, icon,
  badge, description, tech tags, featured), headline numbers, tech pills (type and press
  Enter), experience roles, social buttons, profile fields, theme, footer and SEO.
- **Drag to reorder** works on cards, pills, socials and sections. Each row also has
  up / down / copy / del buttons, because drag-and-drop is not always what you want.
- **Save** validates the whole payload against the zod schema and then writes
  `data/site.json` atomically (temp file, then rename). Problems are reported per field
  in the banner and nothing is written. The public page shows the change on the next
  refresh - no rebuild, no restart.

Saving rewrites the file from the validated object, so `//` comments and hand-made
formatting are not preserved once you start using the dashboard.

### Dashboard auth

| env | meaning |
| --- | --- |
| `ADMIN_PASSWORD` | the dashboard password. Leave it empty to disable the dashboard. |
| `AUTH_SECRET` | HMAC key for the session cookie. Change it to sign every session out. |

The password is compared on the server only, in constant time. The session is an
`HttpOnly`, `SameSite=Lax` cookie signed with HMAC-SHA256 and valid for 12 hours; it is
marked `Secure` only when `SITE_URL` starts with `https://`. There is no rate limiting,
so if this is on the public internet, put it behind HTTPS and rate-limit
`/api/admin/login` at the proxy.

> The compose file mounts `./data` read-write, because the dashboard has to be able to
> save. That mount is the only path the container can write to.