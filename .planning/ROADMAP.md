# Roadmap: Honey Explorer

## Overview

Honey Explorer delivers a visual-first discovery platform for honey enthusiasts. The journey begins with infrastructure and data foundation (addressing the critical cold start problem), then builds the visual design system, core discovery experience, local finder with events, AI recommendations, content/blog, community features, and finally automation. Each phase delivers observable value, with data and visual appeal as the unifying themes.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3...): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure Foundation** - Project scaffolding, deployment pipeline, database setup ✓
- [x] **Phase 2: Data Foundation** - Taxonomy definition, data models, verification metadata ✓
- [x] **Phase 3: Data Seeding** - 200+ honeys with images, 50+ local sources with photos ✓
- [x] **Phase 4: Visual Design System** - Honey color palette, component library, animations ✓
- [ ] **Phase 5: Core Discovery** - Browse, filter, search, detail pages with visual-first layout
- [ ] **Phase 6: Local Finder** - Map with markers, producer profiles, events carousel on homepage
- [ ] **Phase 7: AI Recommendations** - Conversational input, visual quiz, shareable profile cards
- [ ] **Phase 8: Content Platform** - Visual-first articles, infographic health info, newsletter
- [ ] **Phase 9: Community Features** - Visual ratings, photo reviews, testimonial cards
- [ ] **Phase 10: Automation** - Scraping jobs, validation, content generation, monitoring

## Phase Details

### Phase 1: Infrastructure Foundation
**Goal**: Project scaffolding deployed and accessible, ready for feature development
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-03, INFRA-04
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. React + Vite frontend builds and serves static pages
  2. Spring Boot 3.4 backend responds to health check endpoint
  3. PostgreSQL database is provisioned and accessible from backend
  4. Site is deployed on Fly.io and accessible via public URL
  5. CI/CD pipeline deploys on push to main branch
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding and local development environment ✓
- [x] 01-02-PLAN.md — Fly.io deployment and CI/CD pipeline ✓

**Completed:** 2026-01-17
**Production URL:** https://honey-explorer.fly.dev

---

### Phase 2: Data Foundation
**Goal**: Honey taxonomy and data models defined with verification metadata built in
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-04, DATA-05
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. Honey taxonomy documented (floral source, origin, type, flavor profile controlled vocabularies)
  2. Honey entity with all attributes exists in database schema
  3. Local source entity with location, hours, contact, verification metadata exists
  4. API endpoints return empty but properly structured faceted filter options
  5. Database migrations run successfully via Flyway
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Taxonomy enums and JPA entities (Honey, LocalSource) ✓
- [x] 02-02-PLAN.md — Repositories and filter options API endpoint ✓

**Completed:** 2026-01-17

---

### Phase 3: Data Seeding
**Goal**: Platform populated with 200+ curated honeys and 50+ verified local sources (cold start prevention)
**Depends on**: Phase 2
**Requirements**: DATA-02, DATA-03, DATA-06
**Complexity**: L
**Image Strategy**: Used fal.ai FLUX schnell to generate high-quality product photography and hero images.
**Success Criteria** (what must be TRUE):
  1. Database contains 200+ honey varieties with complete metadata ✓
  2. Each honey has a high-quality image (AI-generated) ✓
  3. Database contains 50+ local sources (beekeepers, farms, markets) with photos ✓
  4. Hero images generated for each major honey type and origin region ✓
  5. All seeded data includes "last verified" timestamp ✓
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Cloudflare R2 setup and Java integration ✓
- [x] 03-02-PLAN.md — Data curation and seeder infrastructure (210 honeys, 52 sources) ✓
- [x] 03-03-PLAN.md — fal.ai image generation and CDN finalization (295 images) ✓

**Completed:** 2026-01-18
**Image Stats:** 17 floral heroes + 16 origin heroes + 210 honeys + 52 local sources = 295 images
**Cost:** ~$0.89 via fal.ai FLUX schnell

---

### Phase 4: Visual Design System
**Goal**: Honey-themed visual design system with reusable components
**Depends on**: Phase 1
**Requirements**: UX-03, UX-05, UX-06, UX-07, UX-08
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. Tailwind CSS v4 configured with honey color palette (amber, gold, warm browns) ✓
  2. Card component with generous whitespace and visual hierarchy implemented ✓
  3. Smooth animations/transitions work on page loads and interactions ✓
  4. Icon system established using Lucide React with honey-themed icons ✓
  5. Image placeholder/loading states display polished skeleton loaders ✓
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Tailwind configuration and color palette ✓
- [x] 04-02-PLAN.md — Core component library (cards, badges, loaders) ✓

**Completed:** 2026-01-18
**Components:** Card, Badge, Button, Skeleton, Spinner, Container, Section

---

### Phase 5: Core Discovery
**Goal**: Users can browse, filter, and search honey with visual-first detail pages
**Depends on**: Phase 3, Phase 4
**Requirements**: UX-01, UX-02, UX-04, DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, UX-DISC-06, DISC-07, DISC-08, DISC-09, DISC-10, DISC-11, DISC-12, INFRA-02
**Complexity**: L
**Success Criteria** (what must be TRUE):
  1. Homepage displays large rotating hero image with featured honeys
  2. User can search honeys by name, brand, or keyword with instant results
  3. User can filter by origin, floral source, type, and flavor profile
  4. Browse view shows large product imagery (not tiny thumbnails)
  5. Honey detail page leads with full-width hero image and concise info cards
  6. Certification badges (UMF/MGO) display with tap-to-learn tooltips
  7. User can compare two honeys side-by-side in visual comparison layout
  8. Pairing suggestions shown as visual icons (cheese, tea, toast)
  9. Mobile displays swipeable cards; desktop shows image-forward grid
  10. SEO meta tags and schema.org markup present on all discovery pages
**Plans**: TBD

Plans:
- [ ] 05-01: Homepage with hero and featured honeys
- [ ] 05-02: Browse/filter interface with faceted search
- [ ] 05-03: Honey detail page and comparison feature
- [ ] 05-04: SEO and static site generation setup

---

### Phase 6: Local Finder
**Goal**: Users can find local honey sources with visual map and events prominently featured
**Depends on**: Phase 3, Phase 4
**Requirements**: LOCAL-01, LOCAL-02, LOCAL-03, LOCAL-04, LOCAL-05, LOCAL-06, LOCAL-07
**Complexity**: L
**Success Criteria** (what must be TRUE):
  1. User can search for local honey sources by city or zip code
  2. Interactive map displays with custom honey-themed markers and clustering
  3. List view shows large producer photos and quick-glance info cards
  4. Producer profile pages feature hero photos and visual story format
  5. Visual events calendar displays image-rich event cards
  6. Homepage prominently features events carousel (visual, not list)
  7. User can filter local sources by type using visual icons (bee, barn, etc.)
**Plans**: TBD

Plans:
- [ ] 06-01: Local search API and Leaflet map integration
- [ ] 06-02: Producer profiles and list view
- [ ] 06-03: Events calendar and homepage carousel

---

### Phase 7: AI Recommendations
**Goal**: AI-powered honey discovery with visual quiz and shareable results
**Depends on**: Phase 5
**Requirements**: AI-01, AI-02, AI-03, AI-04
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. User can describe preferences in natural language and receive visual recommendation cards
  2. AI match reasoning displayed as concise bullet points with icons
  3. Visual quiz flow presents image-based choices (not text-heavy questions)
  4. Quiz results generate shareable "honey profile" card image
  5. Fallback keyword-based recommendations work when AI service unavailable
**Plans**: TBD

Plans:
- [ ] 07-01: AI recommendation service with Groq integration
- [ ] 07-02: Visual quiz flow and shareable profile cards

---

### Phase 8: Content Platform
**Goal**: Visual-first content system with blog, health infographics, and newsletter
**Depends on**: Phase 5
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. Blog articles display with large hero images and minimal paragraph text
  2. Health benefits shown as infographic-style cards, not text walls
  3. Health disclaimers appear as subtle footnotes, not prominent warnings
  4. Newsletter signup shows visual preview of subscriber content
  5. Email newsletter template uses image-rich design with curated honey picks
**Plans**: TBD

Plans:
- [ ] 08-01: Blog article system with visual-first layout
- [ ] 08-02: Health infographics and disclaimer system
- [ ] 08-03: Newsletter signup and email templates

---

### Phase 9: Community Features
**Goal**: Visual review system with ratings, photos, and testimonial cards
**Depends on**: Phase 5
**Requirements**: COMM-01, COMM-02, COMM-03, COMM-04
**Complexity**: M
**Success Criteria** (what must be TRUE):
  1. Visual star rating displays with animated hover/click interactions
  2. Users can submit reviews with optional photo upload
  3. Review cards show user avatar, short text, and uploaded photo
  4. Honey detail pages display reviews as visual testimonial cards
  5. Aggregate rating badge prominently displayed on honey cards and detail pages
**Plans**: TBD

Plans:
- [ ] 09-01: Rating and review submission system
- [ ] 09-02: Testimonial card display and aggregation

---

### Phase 10: Automation
**Goal**: Daily automation jobs keep data fresh and generate content with monitoring
**Depends on**: Phase 5, Phase 6, Phase 8
**Requirements**: AUTO-01, AUTO-02, AUTO-03, AUTO-04, AUTO-05, AUTO-06, INFRA-05
**Complexity**: L
**Success Criteria** (what must be TRUE):
  1. Daily scraping job discovers new honey products from configured retailers
  2. Daily job updates farmers market schedules and locations
  3. Validation job checks for dead links and marks unavailable products
  4. Content generation job creates AI articles with human review queue
  5. All jobs include error handling, logging, and retry logic
  6. Monitoring alerts fire on job failures via configured channel
  7. Automated validation job checks site features are working correctly
**Plans**: TBD

Plans:
- [ ] 10-01: Job scheduling infrastructure and monitoring
- [ ] 10-02: Scraping and data refresh jobs
- [ ] 10-03: Validation and content generation jobs

---

## Critical Path Analysis

```
                    Phase 1: Infrastructure
                           |
              +------------+------------+
              |                         |
        Phase 2: Data              Phase 4: Design
        Foundation                    System
              |                         |
        Phase 3: Data                   |
         Seeding                        |
              |                         |
              +------------+------------+
                           |
                    Phase 5: Core Discovery
                           |
         +-----------------+-----------------+
         |                 |                 |
   Phase 6:          Phase 7:          Phase 8:
   Local Finder      AI Recs           Content
         |                                   |
         +-----------------+-----------------+
                           |
                    Phase 9: Community
                           |
                    Phase 10: Automation
```

**Parallelization opportunities:**
- Phase 2 (Data Foundation) and Phase 4 (Design System) can run in parallel after Phase 1
- Phase 6, 7, 8 can partially parallelize after Phase 5
- Phase 9 can begin once Phase 5 is complete

**Sequential dependencies:**
- Phase 3 requires Phase 2 (need schema before seeding)
- Phase 5 requires Phase 3 and Phase 4 (need data and design system)
- Phase 10 requires Phase 5, 6, and 8 (automation needs features to exist)

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10
(With parallelization where dependencies allow)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure Foundation | 2/2 | Complete | 2026-01-17 |
| 2. Data Foundation | 2/2 | Complete | 2026-01-17 |
| 3. Data Seeding | 3/3 | Complete | 2026-01-18 |
| 4. Visual Design System | 2/2 | Complete | 2026-01-18 |
| 5. Core Discovery | 0/4 | Ready | - |
| 6. Local Finder | 0/3 | Not started | - |
| 7. AI Recommendations | 0/2 | Not started | - |
| 8. Content Platform | 0/3 | Not started | - |
| 9. Community Features | 0/2 | Not started | - |
| 10. Automation | 0/3 | Not started | - |

**Total Plans:** 26
**Total Requirements:** 54 mapped

---
*Roadmap created: 2026-01-17*
*Last updated: 2026-01-18*
