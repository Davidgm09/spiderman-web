# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Lint code
npx prisma db push       # Push schema changes to DB
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma studio        # Visual DB browser
```

## Content Population Scripts

All scripts read from `.env` (not `.env.local`). Run them with `node scripts/<name>.js`.

| Script | Source API | Notes |
|--------|-----------|-------|
| `scripts/populate-all-content.js` | Multiple | Seeds all content at once (movies, games, series, comics) |
| `scripts/populate-all-45-characters.js` | Comic Vine | 45 Spider-Man universe characters |
| `scripts/populate-movies.js` | TMDB | Uses `KNOWN_MOVIE_IDS` list |
| `scripts/populate-series-from-tmdb.js` | TMDB | Uses `KNOWN_SPIDER_SERIES_IDS` list |
| `scripts/populate-games-from-rawg.js [--clean]` | RAWG | Uses `KNOWN_GAME_IDS` + rating filter |
| `scripts/populate-comics-from-comicvine.js [--clean]` | Comic Vine | Fetches volumes → issues |
| `scripts/populate-blog.js [--clean]` | Static | 12 hand-written articles (2 per category) |
| `scripts/enrich-comics-from-comicvine.js [--credits\|--all-credits]` | Comic Vine | Real characters, story arcs and writer/artist per issue (rate-limited ~200 req/h; resumable). `--all-credits` re-checks every issue's writer/penciler (the import gave all issues of a series the same credits); progress in `backups/credits-progress.json` |
| `scripts/apply-comic-synopses.js` | Static | Hand-reviewed Spanish synopses from `scripts/data/comic-synopses-es.json` (re-run after any comic re-import) |
| `scripts/refresh-series-status.js` | TMDB | Refreshes series status, seasons, episodes and rating |
| `scripts/update-blog-noticias-2026.js` | Static | Updated versions of news articles (re-run after `populate-blog.js --clean`) |
| `scripts/update-blog-ampliados-2026.js` | Static | Expanded rewrites of short 2025 articles (same slugs); re-run after `populate-blog.js --clean` |
| `scripts/fix-videojuegos-2026.js` | Static | Correct developers/publishers imported wrong from RAWG; re-run after `populate-games-from-rawg.js` |
| `scripts/add-blog-guias-2026.js` | Static | "Guías" articles (gift guide with Amazon affiliate cards, `.gift` styles in `globals.css`); re-run after `populate-blog.js --clean` |
| `scripts/fix-tienda-productos-2026.js` | Static | Store fixes verified on Amazon.es (wrong ASINs, out-of-stock replacements); re-run after `populate-tienda-products.js --clean` |
| `scripts/add-tienda-brand-new-day.js` | Static | 8 Brand New Day products verified on Amazon.es (shown in their own block on `/tienda`); re-run after `populate-tienda-products.js --clean`, then `fix-tienda-productos-2026.js` |
| `scripts/build-juegos-data.js` | DB | Builds `data/juegos/personajes.json` for the daily game Arañadle (gender, origin universe, debut year, unified group names, Spanish search names, clues); re-run when characters change |
| `scripts/add-personajes-2026.js` | Static | 15 characters added in Oct 2026 (Mary Jane, Black Cat, Kingpin, Punisher, Spider-Punk…), with SEO titles; creates the `spider-allies` category. Then run `build-juegos-data.js` |
| `scripts/fix-personajes-seo-2026.js` | Static | Search titles/descriptions for the 45 characters (real name + Spanish hero name); re-run after `populate-all-45-characters.js` |

After re-importing comics from Comic Vine, run `enrich-comics-from-comicvine.js`, then `--all-credits`, then `apply-comic-synopses.js`: the import leaves placeholder data (`characters: ['Spider-Man']`, writer "Marvel Comics") and machine-translated, truncated synopses.

## Database safety

- `vercel.json` runs a daily cron to `/api/keepalive` (a tiny Prisma count) so the free Supabase project is never paused for inactivity. If `CRON_SECRET` is set in Vercel, the route only accepts Vercel's own call.
- `node scripts/backup-db.js` dumps every table to `backups/<date>/` as JSON (git-ignored). Run it weekly and before big changes.
- `node scripts/restore-db.js backups/<date>` is a dry run; add `--apply` to insert missing rows (never deletes or overwrites). On a new database run `npx prisma db push` first.

**Marvel API is permanently down** (has been for ~1 year). Use Comic Vine instead for character/comic data.

## Environment Variables (`.env`)

```
DATABASE_URL=               # Supabase PostgreSQL connection string
MARVEL_PUBLIC_KEY=          # Unused (API down)
TMDB_API_KEY=
TMDB_ACCESS_TOKEN=
RAWG_API_KEY=
COMICVINE_API_KEY=
YOUTUBE_API_KEY=
GOOGLE_ADSENSE_CLIENT_ID=
AMAZON_AFFILIATE_TAG=
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

**Stack:** Next.js 15 App Router · TypeScript · Prisma ORM · PostgreSQL (Supabase) · Tailwind CSS + Radix UI

### Data Flow

1. Content is populated once via scripts into PostgreSQL
2. Pages fetch from DB at request time via service functions in `lib/database.ts`
3. No client-side API calls for content — everything is server components

### Key Files

- `lib/database.ts` — All Prisma service functions (`characterService`, `movieService`, `comicService`, `blogService`, `productService`, etc.)
- `lib/content-helpers.tsx` — Shared helpers used across all detail pages: `renderStars()` (0–10 scale to 5-star UI), `parseJson<T>()` (safe JSON field parsing), `generateAmazonUrl()`, `convertToEmbedUrl()`
- `lib/config.ts` — Site-wide constants: `SITE_URL`, `AMAZON_TAG`, `ADSENSE_CLIENT_ID`
- `lib/rawg-api.ts` — RAWG API client for games
- `lib/supabase.ts` — Supabase Storage client for image uploads (used by `app/admin/upload/`)
- `data/personajes/fichas.json` + `components/characters/CharacterGuide.tsx` — hand-written expanded character pages (sections, film/TV table with actors, FAQ + FAQPage JSON-LD). Characters without an entry show only `longDescription`. Fact-check every entry before adding it.
- `types/content.ts` — TypeScript interfaces for all content types (`MovieContent`, `GameContent`, etc.)
- `prisma/schema.prisma` — Single source of truth for all models. Also contains cache/analytics tables: `MarvelCache`, `ExternalApiCache`, `ContentAnalytics`, `AffiliateProduct`, `UserFavorite`, `SearchQuery`

### Service Layer Conventions

All service functions in `lib/database.ts` follow these conventions:
- Always filter `isActive: true` — inactive records are never shown
- Default ordering: `rating DESC`, then `views DESC`
- JSON fields in the DB (e.g. `sceneImages`, `castWithPhotos`, `screenshotImages`) should be parsed with `parseJson<T>()` from `lib/content-helpers.tsx`

### Page Patterns

All content detail pages share this structure:

```ts
export const revalidate = 3600; // ISR: revalidate every hour

export async function generateStaticParams() { /* returns all slugs */ }
export async function generateMetadata({ params }): Promise<Metadata> { /* dynamic SEO */ }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next.js 15: must await params
}
```

### Import Alias

Use `@/` to import from the project root (configured in `tsconfig.json`):
```ts
import { characterService } from '@/lib/database';
import { renderStars } from '@/lib/content-helpers';
```

### Content Models

| Model | Category field values |
|-------|----------------------|
| `Character` | `spider-verse` · `spider-villains` · `spider-allies` (supporting cast) · `marvel-universe` |
| `Movie` | organized by `universe` field on the page |
| `Comic` | `importance` field: `Alta` · `Buena` · `Media` |
| `Game`, `Series` | no sub-categories |

### Routes

The site is in Spanish. URL segments map to:

| URL | Content |
|-----|---------|
| `/personajes` | Characters |
| `/peliculas` | Movies |
| `/series` | TV Series |
| `/comics` | Comics |
| `/videojuegos` | Games |
| `/blog` | Blog posts |
| `/tienda` | Store (Amazon affiliate) |
| `/juegos` | Minigames: Arañadle (daily), test, personality quiz. Static JSON in `data/juegos/`, client components in `components/juegos/`, no DB at runtime. New Arañadle characters need `since: <future day number>` in `build-juegos-data.js` so past daily answers don't change (see `dailyCharacter` in `lib/juegos.ts`) |
| `/admin/upload` | Admin image upload tool |

All dynamic routes follow `/app/[content-type]/[slug]/page.tsx`. **Important for Next.js 15:** `params` is a `Promise` and must be awaited:

```ts
interface PageProps { params: Promise<{ slug: string }> }
export default async function Page({ params }: PageProps) {
  const { slug } = await params;
```

### Image Sources

All external image domains are whitelisted in `next.config.mjs`. Working sources:
- `comicvine.gamespot.com` — character portraits and comic covers
- `image.tmdb.org` — movie/series posters and backdrops
- `media.rawg.io` — game screenshots
- `cdn.marvel.com` — some character images (pattern: `content/2x/<slug>.png`)
- `i.annihil.us` — Marvel CDN (most URLs are now 404)

Character images are stored directly in the DB. To fix a broken image: find the character in Prisma Studio or via a quick node script, then update the `image` field.

### Monetization

- `components/ads/GoogleAdsense.tsx` — `<InContentAd />` and `<SidebarAd />` components
- `components/affiliate/AmazonProduct.tsx` — builds Amazon search URLs with affiliate tag from `NEXT_PUBLIC_AMAZON_AFFILIATE_TAG`

### No Test Framework

Validation is done via standalone node scripts in `/scripts/` and root-level `test-*.js` files.
