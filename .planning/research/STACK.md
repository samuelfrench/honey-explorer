# Technology Stack

**Project:** Honey Explorer
**Researched:** 2026-01-17
**Overall Confidence:** HIGH (verified via web search, cross-referenced with cigar-explorer existing stack)

## Executive Summary

Honey Explorer should follow the proven cigar-explorer architecture with targeted upgrades where the ecosystem has evolved. The core pattern (React SPA + Java/Spring backend + PostgreSQL + Fly.io) remains the recommended approach in 2025/2026. Key updates include React 19, Spring Boot 3.4, Tailwind CSS v4, and adding Groq for fast AI inference.

---

## Recommended Stack

### Frontend

| Technology | Version | Purpose | Confidence | Rationale |
|------------|---------|---------|------------|-----------|
| **React** | 19.2.x | UI framework | HIGH | Current stable. Includes useEffectEvent, Activity component. Mature ecosystem, SSG support. |
| **Vite** | 6.x | Build tool | HIGH | Faster than Webpack (5x full builds). Native ESM, excellent DX. Already proven in cigar-explorer. |
| **vite-react-ssg** | 0.8.x+ | Static site generation | HIGH | SEO-critical for discovery content. Same approach as cigar-explorer. |
| **TypeScript** | 5.7.x | Type safety | HIGH | Industry standard. Catches bugs at compile time. |
| **Tailwind CSS** | 4.1.x | Styling | HIGH | v4 released Jan 2025 with Oxide engine (Rust). 5x faster builds. CSS-first config is cleaner. |
| **React Router** | 7.x | Client routing | HIGH | v7 stable, supports SSG patterns. |
| **Axios** | 1.7.x | HTTP client | HIGH | Proven, good error handling, interceptors. |
| **Zustand** | 5.x | State management | MEDIUM | Lightweight, simpler than Redux. Use only if useState/useContext insufficient. |
| **Lucide React** | 0.460.x | Icons | HIGH | Consistent icon set, tree-shakeable. |
| **React Helmet Async** | 2.x | SEO meta tags | HIGH | Required for SSG SEO. |

**Why NOT Next.js:** For a discovery platform with static content (honey profiles, articles), Vite+SSG is simpler and sufficient. Next.js adds server complexity not needed when Fly.io backend handles dynamic data. Consistency with cigar-explorer reduces cognitive load.

**Why NOT SvelteKit/Astro:** React ecosystem familiarity, existing component patterns from cigar-explorer can be adapted.

### Backend

| Technology | Version | Purpose | Confidence | Rationale |
|------------|---------|---------|------------|-----------|
| **Java** | 21 LTS | Runtime | HIGH | Current LTS. Virtual threads (Project Loom) for better concurrency. |
| **Spring Boot** | 3.4.x | Framework | HIGH | Current stable (3.4.13+). Full Java 21 support. Proven in cigar-explorer with 3.2. |
| **Spring Data JPA** | (via Boot) | ORM | HIGH | Standard for Java persistence. Reduces boilerplate. |
| **Spring Validation** | (via Boot) | Request validation | HIGH | Declarative validation. |
| **Lombok** | 1.18.x | Boilerplate reduction | HIGH | Reduces getter/setter noise. |
| **Maven** | 3.9.x | Build tool | HIGH | Consistent with cigar-explorer. Well-documented. |
| **OkHttp** | 4.12.x | HTTP client (for AI APIs) | HIGH | Already in cigar-explorer. Clean API for external calls. |
| **Jsoup** | 1.18.x | HTML parsing (scraping) | HIGH | Standard Java scraping library. Sufficient for static HTML. |

**Why NOT Micronaut/Quarkus:** While faster startup (under 1s vs 3-5s), Spring Boot's ecosystem maturity, documentation, and your existing familiarity outweigh startup time gains. Fly.io keeps instances warm anyway.

**Why NOT Kotlin:** Java 21 with records and pattern matching closes the gap. Consistency with cigar-explorer is more valuable.

### Database

| Technology | Version | Purpose | Confidence | Rationale |
|------------|---------|---------|------------|-----------|
| **PostgreSQL** | 16.x | Production database | HIGH | Scales well, JSON support for flexible honey attributes, full-text search for discovery. |
| **H2** | 2.x | Development database | HIGH | Fast local dev, in-memory testing. Same pattern as cigar-explorer. |
| **Flyway** | 10.x | Schema migrations | HIGH | Version-controlled migrations. Prevents drift. |

**Why NOT SQLite:** Multi-user discovery platform needs concurrent writes. PostgreSQL handles this natively. Fly.io provides managed Postgres (Fly Postgres).

**Why NOT MongoDB:** Honey data is relational (origin -> region -> beekeepers, flavor profiles -> categories). PostgreSQL JSONB provides schema flexibility without sacrificing relations.

### AI/ML Integration

| Technology | Version | Purpose | Confidence | Rationale |
|------------|---------|---------|------------|-----------|
| **Groq API** | - | Fast inference for recommendations | HIGH | 10x faster than OpenAI/Claude. Already used in cigar-explorer. Great for user-facing AI ("describe what you like"). |
| **Claude API** (Anthropic) | Sonnet 3.5/4 | Content generation, complex reasoning | MEDIUM | Higher quality for long-form articles. Use when speed less critical. |
| **OpenAI API** | GPT-4o | Alternative/fallback | MEDIUM | Function calling support, fine-tuning options. Consider for structured extraction. |

**Recommendation:** Use Groq as primary for real-time recommendations (fast, cheap). Use Claude/OpenAI for batch content generation jobs (quality > speed). Multi-provider strategy protects against outages and rate limits.

**Pricing notes (as of late 2025):**
- Groq: Significantly cheaper than competitors for inference
- Claude Sonnet: $3/$15 per million tokens (input/output)
- OpenAI GPT-4o: $2.50/$10 per million tokens
- Claude Opus: $15/$75 per million tokens (use sparingly)

### Geolocation / Local Finder

| Technology | Purpose | Confidence | Rationale |
|------------|---------|------------|-----------|
| **Geoapify Places API** | Primary location search | MEDIUM | OpenStreetMap-based. 40x cheaper than Google Places. Allows data caching (Google doesn't). |
| **Leaflet** | Map rendering | HIGH | Open-source, lightweight. No licensing cost. |
| **Browser Geolocation API** | User location | HIGH | Native, no external dependency for getting user coordinates. |

**Why NOT Google Places:** $20 per 1000 requests. For a discovery platform with many searches, costs escalate quickly. Geoapify at ~$0.50 per 1000 is sustainable.

**Alternative considered:** HERE Geocoding (120M POIs) - good fallback if Geoapify coverage insufficient for beekeepers.

### Automation / Job Scheduling

| Technology | Purpose | Confidence | Rationale |
|------------|---------|------------|-----------|
| **Spring @Scheduled** | Built-in cron jobs | HIGH | Simple, no external dependency. Sufficient for daily scraping, content generation. |
| **GitHub Actions** | Scheduled workflows | HIGH | For jobs that shouldn't run on Fly.io (long-running scrapes, external triggers). |

**Why NOT Quartz:** Overkill for simple daily jobs. Only needed for clustering/persistence, which Fly.io single-instance doesn't require.

**Job patterns:**
- Daily: Scrape honey sources, validate data, generate content
- Weekly: Full index refresh, dead link cleanup
- On-demand: User-triggered recommendations

### Hosting / Infrastructure

| Technology | Purpose | Confidence | Rationale |
|------------|---------|------------|-----------|
| **Fly.io** | Application hosting | HIGH | Edge deployment, simple scaling. Proven with cigar-explorer. |
| **Fly Postgres** | Managed PostgreSQL | HIGH | Co-located with app, automatic backups. |
| **GitHub** | Code repository | HIGH | Standard. |
| **GitHub Actions** | CI/CD | HIGH | Deploy on push, run tests. |

**Fly.io specifics for Java:**
- Minimum 512MB RAM (256MB too small for JVM)
- Use `-XX:MaxRAMPercentage=75.0` for container-aware memory
- Consider Spring Native (GraalVM) for smaller footprint if memory becomes expensive

**Deployment strategy:** Rolling deployment (Fly.io default). Zero-downtime.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **react-markdown** | 10.x | Render AI-generated content | Article pages |
| **@tanstack/react-table** | 8.x | Data tables | Browse/filter honey listing |
| **Resend** | 3.x | Transactional email | User notifications, admin alerts |
| **Playwright** | 1.50.x | E2E testing, scraping JS sites | Dev/CI testing, dynamic site scraping |
| **Vitest** | 3.x | Unit testing | Frontend tests |
| **JUnit 5** | 5.x | Unit testing | Backend tests |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Frontend Framework | React + Vite | Next.js | Adds server complexity; SSG via vite-react-ssg sufficient |
| Backend Framework | Spring Boot | Micronaut | Startup time gains not critical; ecosystem maturity matters more |
| Database | PostgreSQL | MongoDB | Relational honey data; JSONB provides flexibility |
| CSS | Tailwind v4 | CSS Modules | Tailwind faster to develop; v4 is production-ready |
| State Management | Zustand | Redux Toolkit | Simpler for moderate state needs |
| Maps | Leaflet + Geoapify | Google Maps | Cost (40x cheaper); caching allowed |
| AI Primary | Groq | OpenAI direct | Speed for real-time recommendations |

---

## Version Pinning Strategy

**Pin major.minor, allow patch updates:**
```json
{
  "react": "^19.2.0",
  "vite": "^6.0.0",
  "tailwindcss": "^4.1.0"
}
```

**Why:** Patch updates fix bugs without breaking changes. Minor updates add features, may need review.

---

## Installation Commands

### Frontend
```bash
# Create project
npm create vite@latest frontend -- --template react-ts

# Core dependencies
npm install react-router-dom axios lucide-react react-helmet-async react-markdown @tanstack/react-table vite-react-ssg zustand

# Styling
npm install -D tailwindcss

# Testing
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom playwright
```

### Backend
```bash
# Use Spring Initializr or add to pom.xml:
# - spring-boot-starter-web
# - spring-boot-starter-data-jpa
# - spring-boot-starter-validation
# - postgresql
# - h2 (scope: runtime)
# - lombok (optional: true)
# - okhttp (4.12.0)
# - jsoup (1.18.3)
# - flyway-core
```

---

## Cost Considerations

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|------------------------|
| Fly.io (256MB x2) | $0 | $0-5 (may need 512MB for Java) |
| Fly Postgres (1GB) | $0 | $0 (dev), ~$7 (prod) |
| Geoapify | 3000 requests/day | $0 (likely sufficient) |
| Groq | Limited free tier | $0-10 (depends on usage) |
| Claude API | None | $10-50 (for content generation) |
| GitHub Actions | 2000 min/month | $0 |

**Total estimated:** $20-70/month for production with moderate traffic.

---

## Migration Path from Cigar-Explorer

Since honey-explorer follows the same architecture, components can be adapted:

| Cigar-Explorer Component | Honey-Explorer Adaptation |
|-------------------------|---------------------------|
| Cigar entity/API | Honey entity/API (similar structure) |
| Flavor profile system | Flavor profile system (different attributes) |
| Brand/Country relations | Origin/Beekeeper relations |
| Article generation | Article generation (different prompts) |
| Review system | Review system (reusable) |

**Estimated effort:** 70% of backend patterns reusable. Frontend components need restyling but architecture identical.

---

## Sources

### Frontend
- [React 19.2 Release](https://react.dev/blog/2025/10/01/react-19-2) - HIGH confidence
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) - HIGH confidence
- [Vite vs Next.js Comparison](https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison) - MEDIUM confidence

### Backend
- [Spring Boot 3.4 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.4-Release-Notes) - HIGH confidence
- [Spring Boot Version History](https://www.codejava.net/frameworks/spring-boot/spring-boot-version-history) - HIGH confidence
- [Java Web Scraping Libraries 2026](https://www.zenrows.com/blog/java-web-scraping-library) - MEDIUM confidence

### Database
- [PostgreSQL vs SQLite Comparison](https://www.datacamp.com/blog/sqlite-vs-postgresql-detailed-comparison) - HIGH confidence

### AI/ML
- [LLM API Pricing 2025](https://intuitionlabs.ai/articles/llm-api-pricing-comparison-2025) - MEDIUM confidence
- [Claude API vs OpenAI API](https://collabnix.com/claude-api-vs-openai-api-2025-complete-developer-comparison-with-benchmarks-code-examples/) - MEDIUM confidence
- [Groq Inference](https://groq.com/) - HIGH confidence

### Geolocation
- [Google Places API Alternatives](https://www.safegraph.com/guides/google-places-api-alternatives) - MEDIUM confidence
- [Geoapify as Alternative](https://www.geoapify.com/geoapify-as-a-google-places-api-alternative/) - HIGH confidence

### Hosting
- [Fly.io Java Deployment](https://medium.com/@vergil333/deploy-spring-boot-to-fly-iof-d54d5ca05243) - MEDIUM confidence
- [Fly.io Deployment Docs](https://fly.io/docs/launch/deploy/) - HIGH confidence
