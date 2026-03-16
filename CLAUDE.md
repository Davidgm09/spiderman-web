# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build and Development:**
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

**Database Management:**
```bash
# Database schema operations
npx prisma db push
npx prisma generate
npx prisma studio

# Run database setup/migrations
node setup-database.js
node create-tables.js
node execute-schema.js
```

**Content Population Scripts:**
```bash
# Master setup and content population
node complete-setup.js
node populate-all-content.js
node clean-and-repopulate-final.js

# TMDB integration for series
node populate-series-from-tmdb.js
node clean-and-populate-series.js

# RAWG integration for games (replaces IGDB)
node scripts/populate-games-from-rawg.js
node scripts/populate-games-from-rawg.js --clean

# Image management system
node scripts/master-image-manager.js
node scripts/fetch-real-images.js
node scripts/image-validation-system.js
```

**Testing and Validation:**
```bash
# Connection and API testing
node test-supabase-connection.js
node test-marvel-api.js
node test-database-direct.js
node debug-database.js

# TMDB series integration testing
node test-series-tmdb-integration.js
node test-series-api-simple.js

# RAWG games integration testing
node test-rawg-api-integration.js

# Image system testing
node test-image-system-simulation.js
```

**Environment Setup:**
```bash
# Install dependencies
npm install

# Environment variables required in .env.local:
# DATABASE_URL=postgresql://...
# MARVEL_API_KEY=...
# MARVEL_API_PRIVATE_KEY=...
# TMDB_API_KEY=...
# RAWG_API_KEY=...
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Architecture Overview

**Tech Stack:**
- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL via Prisma ORM
- **External APIs:** Marvel API, TMDB API, RAWG API, Supabase
- **Styling:** Tailwind CSS + Radix UI components
- **Language:** TypeScript

**Core Architecture Patterns:**

1. **Database-First Content Management:** All content (characters, movies, comics, games, series) is stored in PostgreSQL and served via Prisma services in `lib/database.ts`

2. **External API Integration:** Marvel API provides official character/comic data, RAWG API provides game data with intelligent caching via `lib/marvel-api.ts` and `lib/rawg-api.ts`

3. **Multi-Content Type System:** Characters are categorized as 'spider-verse', 'spider-villains', or 'marvel-universe' with comprehensive metadata

4. **Image Management Pipeline:** Sophisticated system for fetching, validating, and optimizing images from multiple sources (Marvel API, TMDB, fallbacks)

5. **SEO-Optimized Structure:** Each content type has dedicated slug-based pages with comprehensive metadata

**Database Schema Design (Prisma):**
- **Primary Content:** Character, Movie, Comic, Game, Series, BlogPost, Product models
- **Caching:** MarvelCache, ExternalApiCache for API response optimization  
- **Analytics:** ContentAnalytics, SearchQuery, UserFavorite for engagement tracking
- **Monetization:** AffiliateProduct, MonetizationConfig for revenue optimization

**Key Service Layers:**
- `lib/database.ts`: Core Prisma services for all content types
- `lib/marvel-api.ts`: Marvel API integration with intelligent caching
- `lib/tmdb-api.ts`: TMDB API for movies and series data
- `lib/cache-manager.ts`: API response caching with expiration
- `lib/analytics.ts`: Page view and conversion tracking
- `lib/error-logger.ts`: API error logging and debugging

**File Structure Conventions:**
- `/app/[content-type]/[slug]/page.tsx` - Dynamic content pages
- `/components/[feature]/` - Feature-specific React components  
- `/lib/` - Core services (database, APIs, utilities)
- `/scripts/` - Data population and maintenance scripts
- `/data/` - Static content definitions

**API Architecture:**
- `/api/marvel/` - Marvel API proxy endpoints with caching
- `/api/external/` - TMDB and other external API integrations
- Next.js API routes handle authentication, rate limiting, and response formatting

**Content Management Workflow:**
1. Data fetched from Marvel API and cached in database
2. Images validated and optimized via master image management system
3. Content served via Prisma services with intelligent caching
4. Analytics tracked for performance optimization

**Key Configuration:**
- Marvel API keys required in `.env` for character/comic data
- Supabase DATABASE_URL for PostgreSQL connection
- Image domains configured in `next.config.mjs` for external images
- Comprehensive redirects for SEO URL management

**Monetization Architecture:**
- **Google AdSense:** Display advertising with strategic component placement
- **Amazon Affiliates:** Product recommendations with conversion tracking via `AffiliateProduct` model
- **Analytics Tracking:** Revenue optimization via `ContentAnalytics` and `MonetizationConfig`

**Important Development Notes:**
- No formal testing framework configured (uses utility scripts for validation)
- Image management requires external API keys (Marvel, TMDB) for optimal results
- Database population scripts should be run in sequence for proper setup
- Content is heavily SEO-optimized with extensive metadata and structured data
- All external APIs have intelligent caching to prevent rate limiting
- Component library uses Radix UI with comprehensive design system in `/components/ui/`
- Dynamic routes follow pattern: `/[content-type]/[slug]` for all content pages