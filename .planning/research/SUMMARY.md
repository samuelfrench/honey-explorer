# Project Research Summary

**Project:** Honey Explorer
**Domain:** Specialty food discovery platform
**Researched:** 2026-01-17
**Confidence:** HIGH

## Executive Summary

Honey Explorer is a discovery platform following the proven cigar-explorer architecture pattern: React SPA with static site generation for SEO, Spring Boot REST API, PostgreSQL on Fly.io. The domain gap analysis reveals an underserved market -- existing honey platforms (Sweet Local Honey, Honey Lookup) focus on producer directories without comprehensive variety discovery or AI-powered recommendations. The opportunity is to become "Vivino for honey" with local sourcing emphasis.

The recommended approach prioritizes data seeding before feature development. Research consistently warns that discovery platforms fail from cold start problems, not technical issues. Launch requires 200+ curated honey varieties and 50+ verified local sources before any user acquisition. The cigar-explorer codebase provides 70% reusable patterns for backend structure, making this primarily a data and content challenge rather than a technical one.

Key risks center on content quality and data freshness. AI-generated content must go through human review to avoid Google penalties (17%+ traffic loss documented for detected AI content). Local finder data decays rapidly -- farmers markets are seasonal, small producers move. Build verification metadata and user feedback loops from day one, not as afterthought.

## Key Findings

### Recommended Stack

**One-liner:** React 19 + Vite + Tailwind v4 frontend, Spring Boot 3.4 + Java 21 backend, PostgreSQL on Fly.io, Groq for fast AI inference.

The stack mirrors cigar-explorer with targeted upgrades: React 19.2 (stable with useEffectEvent), Tailwind CSS v4 (Oxide engine, 5x faster builds), Spring Boot 3.4 with Java 21 virtual threads. Groq provides 10x faster inference than OpenAI for real-time recommendations at lower cost.

**Core technologies:**
- **React + Vite + vite-react-ssg**: SEO-critical static generation for discovery content -- same pattern proven in cigar-explorer
- **Spring Boot 3.4 + Java 21**: Mature ecosystem, virtual threads for better concurrency, existing familiarity reduces risk
- **PostgreSQL**: Relational honey data (origin -> region -> producers), JSONB for flexible attributes, full-text search
- **Groq API (primary) + Claude (batch)**: Fast inference for recommendations, higher quality for content generation
- **Geoapify + Leaflet**: 40x cheaper than Google Places, caching allowed, sufficient for local finder

### Expected Features

**Must have (table stakes):**
- Product catalog with search and multi-faceted filtering (origin, floral source, type, price)
- Product detail pages with origin, flavor profile, certifications (UMF/MGO), producer info
- Ratings and reviews system (community trust signals)
- Local finder with map view (beekeepers, farmers markets, stores)
- Mobile-responsive design (60%+ traffic is mobile for discovery platforms)

**Should have (competitive):**
- AI preference matcher ("describe what you like" natural language recommendations)
- Honey quiz for beginners (guided discovery, lower barrier than freeform)
- Certification education (UMF/MGO explained -- 80% of Manuka honey not properly certified)
- Health benefits guide (evidence-based, with disclaimers)
- Local producer profiles with stories (Farmish-style)

**Defer (v2+):**
- E-commerce/cart system -- link to producer sites instead
- Mobile native apps -- PWA/responsive web sufficient
- User-generated listings -- curated catalog prevents fake honey problem
- Events calendar -- nice-to-have, not core discovery

### Architecture Approach

Three-tier monolith on Fly.io: Nginx serves React static files and proxies /api to Spring Boot; PostgreSQL co-located for low latency. Job scheduling uses Spring @Scheduled for light tasks (cache refresh) and Fly.io Cron Manager for heavy jobs (scraping, content generation) to avoid blocking API threads. All AI calls go through backend with keyword-matching fallback when services fail.

**Major components:**
1. **React SPA** -- Browse, filter, recommendations UI; SSG for SEO-critical pages (honey detail, articles)
2. **Spring Boot API** -- REST endpoints, business logic, AI integration with fallback patterns
3. **PostgreSQL** -- Honey catalog, reviews, locations, articles, job tracking
4. **Job Scheduler** -- Daily scraping, data validation, content generation (isolated from API)
5. **AI Service Layer** -- Groq for real-time, Claude for batch; always with non-AI fallback

### Critical Pitfalls

1. **Cold Start Death Spiral** -- Seed 200+ honey varieties and 50+ local sources before launch; never launch with empty catalog; use popularity-based recommendations when personalization data is thin

2. **AI Content Google Penalties** -- Human-in-the-loop for all published content; limit to 2-3 articles/week not 10/day; add E-E-A-T signals (author bylines, cited sources); run through AI detectors before publish

3. **Web Scraping Legal Landmines** -- Never scrape personal data without consent; check robots.txt and ToS; focus on factual product data; document decisions for compliance audit; encourage self-registration for local sources

4. **Stale Local Source Data** -- Build verification metadata into data model from day one; implement "last verified" dates visible to users; automated staleness alerts at 6+ months; user feedback loop ("is this still accurate?")

5. **Honey Taxonomy Chaos** -- Define controlled vocabulary before any data entry; use floral source as primary classification, region as secondary; handle multifloral as explicit category not catch-all

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation + Data Seeding
**Rationale:** Cold start problem is the critical risk -- data must exist before features matter. Architecture research confirms database schema and taxonomy decisions gate everything else.
**Delivers:** 200+ honey varieties seeded, 50+ local sources, basic data model, project infrastructure
**Addresses:** Product catalog (table stakes), taxonomy definition
**Avoids:** Cold start death spiral, taxonomy chaos

### Phase 2: Core Discovery Experience
**Rationale:** Once data exists, users need to browse and filter it. This is the primary value proposition.
**Delivers:** Browse/filter UI, honey detail pages, basic search, SEO/SSG setup
**Uses:** React + Vite + vite-react-ssg, faceted search pattern
**Implements:** Frontend SPA, API endpoints for filtering, slug-based URLs

### Phase 3: Local Finder
**Rationale:** Second core value proposition (discover + buy locally). Independent data source, can parallelize with Phase 2 if resources allow.
**Delivers:** Map view, location search, producer profiles, city guides
**Uses:** Leaflet + Geoapify, Spring Boot location endpoints
**Avoids:** Stale local data (verification metadata built in)

### Phase 4: AI Recommendations
**Rationale:** Key differentiator but requires honey data to exist first. Research warns against over-engineering -- start simple, validate usage.
**Delivers:** "Describe what you like" feature, preference matching, quiz flow
**Uses:** Groq API with keyword fallback
**Implements:** Recommendation service with degradation

### Phase 5: Reviews + Community
**Rationale:** Community engagement builds after users have something to engage with. Requires moderation infrastructure.
**Delivers:** Ratings, reviews, user contributions
**Avoids:** UGC moderation overwhelm (ship with report system, health claim flagging)

### Phase 6: Content + Automation
**Rationale:** SEO and engagement layer. Requires stable data model. AI content needs governance established early.
**Delivers:** Blog articles, AI content generation, daily automation jobs
**Avoids:** Google penalties (human-in-the-loop), silent job failures (logging + alerting)

### Phase Ordering Rationale

- **Data before features:** Phases 1-2 establish the core catalog that everything else depends on. AI recommendations need honey data. Reviews need products to review.
- **Local finder separate track:** Phase 3 uses different data sources (location APIs vs product data) -- can parallelize development if team capacity allows.
- **AI as differentiator, not foundation:** Phase 4 adds value but research warns against over-engineering before validation. Simple browse/filter may satisfy most users.
- **Content last:** Phase 6 content automation builds on stable taxonomy and product data. Governance patterns established in Phase 1 but heavy automation deferred.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Data Seeding):** Need to identify specific scraping targets, seed data sources, establish taxonomy vocabulary -- domain-specific research
- **Phase 3 (Local Finder):** Geoapify vs alternatives, farmers market data sources, beekeeper directory partnerships -- coverage validation needed
- **Phase 4 (AI Recommendations):** Groq prompt engineering, recommendation diversity metrics, fallback algorithm tuning -- implementation research

Phases with standard patterns (skip research-phase):
- **Phase 2 (Core Discovery):** Well-documented React SPA + filtering patterns; cigar-explorer provides direct reference implementation
- **Phase 5 (Reviews):** Standard UGC patterns; moderation well-documented; cigar-explorer has existing patterns
- **Phase 6 (Automation):** Spring @Scheduled + Fly.io Cron Manager documented; content generation prompts need tuning but architecture is standard

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified versions, proven in cigar-explorer, official release notes checked |
| Features | HIGH | Cross-referenced Vivino, Roasters App, existing honey platforms, clear patterns |
| Architecture | HIGH | Direct reference implementation exists, Fly.io patterns documented |
| Pitfalls | MEDIUM-HIGH | Cold start and AI penalties well-documented; local data staleness inferred from patterns |

**Overall confidence:** HIGH

### Gaps to Address

- **Seed data sources:** Research identified need for 200+ varieties but did not identify specific sources to scrape. Need to identify retailers, databases (Open Food Facts honey data) during Phase 1 planning.

- **Geoapify honey coverage:** Unclear if Geoapify has good beekeeper/farm coverage. May need to supplement with manual research or partnerships with beekeeping associations.

- **Honey taxonomy standard:** No industry-standard taxonomy exists. Will need to create and document proprietary classification during Phase 1.

- **UMF/MGO certification verification:** How to verify certification claims without official database? May need manual verification or partnership with UMF Honey Association.

## Sources

### Primary (HIGH confidence)
- Spring Boot 3.4 Release Notes (official)
- React 19.2 Release Blog (official)
- Tailwind CSS v4.0 Announcement (official)
- Fly.io Deployment Documentation (official)
- cigar-explorer codebase (reference implementation)

### Secondary (MEDIUM confidence)
- Vivino App Store listing and Symphony Solutions analysis
- DoorDash Zesty AI announcement (PYMNTS)
- Google AI content guidance (official + SEO case studies)
- GDPR web scraping guidance (legal analysis)
- Groq inference benchmarks

### Tertiary (LOW confidence)
- Honey authentication scientific literature (classification complexity)
- Local directory data decay patterns (inferred from USDA farmers market data)
- UGC moderation scaling estimates

---
*Research completed: 2026-01-17*
*Ready for roadmap: yes*
