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
- `lib/content-helpers.tsx` — Shared helpers used across all detail pages: `renderStars()` (0–10 scale to 5-star UI), `generateAmazonUrl()`, `convertToEmbedUrl()`
- `lib/rawg-api.ts` — RAWG API client for games
- `lib/supabase.ts` — Supabase Storage client for image uploads (used by `app/admin/upload/`)
- `types/content.ts` — TypeScript interfaces for all content types (`MovieContent`, `GameContent`, etc.)
- `prisma/schema.prisma` — Single source of truth for all models

### Content Models

| Model | Category field values |
|-------|----------------------|
| `Character` | `spider-verse` · `spider-villains` · `marvel-universe` |
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
