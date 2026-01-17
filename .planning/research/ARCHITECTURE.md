# Architecture Patterns

**Domain:** Discovery/recommendation platform (honey enthusiasts)
**Researched:** 2026-01-17
**Reference:** cigar-explorer proven architecture

## Recommended Architecture

Based on cigar-explorer's proven model and project requirements, Honey Explorer follows a **three-tier monolith** deployed to Fly.io:

```
                                    +------------------+
                                    |   Fly.io Edge    |
                                    |    (HTTPS/CDN)   |
                                    +--------+---------+
                                             |
                    +------------------------+------------------------+
                    |                                                 |
           +--------v--------+                               +--------v--------+
           |     Nginx       |                               |   Cron Manager  |
           |  (Static + Proxy)                               |  (Scheduled Jobs)|
           +--------+--------+                               +--------+--------+
                    |                                                 |
    +---------------+---------------+                    +------------+------------+
    |                               |                    |            |            |
+---v---+                     +-----v-----+        +-----v----+ +-----v----+ +-----v----+
| React |                     | Spring    |        | Scraper  | | Validator| | Content  |
|  SPA  |                     | Boot API  |        | Job      | | Job      | | Gen Job  |
+-------+                     +-----+-----+        +----------+ +----------+ +----------+
                                    |
                              +-----v-----+
                              | PostgreSQL|
                              |   (Fly)   |
                              +-----------+
```

### Component Breakdown

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React + Vite + TypeScript | Browse honey, filters, AI recommendations, local finder |
| **API Server** | Spring Boot 3 (Java 17) | REST API, business logic, AI integration |
| **Database** | PostgreSQL (Fly.io) | Honey catalog, reviews, locations, articles |
| **Reverse Proxy** | Nginx | Serve static files, proxy /api to Spring Boot |
| **Job Scheduler** | Fly.io Cron Manager or Spring @Scheduled | Daily automation tasks |
| **AI Service** | OpenAI API (or Groq fallback) | Recommendations, content generation |

## Component Boundaries

### Frontend (React SPA)

**Responsibility:** User interface, client-side filtering, SEO-friendly rendering

**Owns:**
- Page routing (React Router)
- UI components (filter sidebar, honey cards, local finder map)
- Client-side state (filters, recommendations)
- SEO metadata (vite-react-ssg for static generation)

**Communicates with:**
- API Server via fetch/axios for data
- No direct database access

**Key Pages (from cigar-explorer pattern):**
```
/                    # Browse/filter honey
/honey/:slug         # Individual honey detail
/recommendations     # AI recommendation interface
/local/:city         # Local finder city guide
/local              # City guide index
/blog               # Article index
/blog/:slug         # Individual article
```

### API Server (Spring Boot)

**Responsibility:** Business logic, data access, external integrations

**Owns:**
- REST endpoints
- Database access (JPA/Hibernate)
- AI service integration
- Data validation

**Communicates with:**
- PostgreSQL (direct)
- OpenAI/Groq API (HTTP)
- Frontend (receives requests)

**Key Controllers:**
```
/api/honey           # CRUD + filtering
/api/honey/facets    # Filter options (origins, flavors, types)
/api/recommendations # AI-powered suggestions
/api/locations       # Local beekeepers, farmers markets
/api/articles        # Blog content
/api/reviews         # User reviews (auth required for POST)
```

**Service Layer Pattern:**
```
Controller -> Service -> Repository -> Database
                |
                v
           External APIs (OpenAI, scraping targets)
```

### Database (PostgreSQL)

**Responsibility:** Persistent storage, data integrity

**Core Tables:**
```sql
-- Product catalog
honey (id, name, slug, origin_country, origin_region,
       flavor_profile, type, health_benefits,
       price, affiliate_url, image_url, rating,
       is_available, created_at, updated_at)

-- Geographic data
regions (id, country, region_name, terroir_notes)

-- Local sources
locations (id, name, type, city, state, address,
           lat, lng, hours, website, phone,
           has_honey, farmers_market_schedule)

-- Content
articles (id, title, slug, content, category,
          published_at, is_ai_generated)

-- User-generated
reviews (id, honey_id, rating, text,
         author_name, created_at, approved)

-- Automation tracking
job_runs (id, job_name, started_at, completed_at,
          status, items_processed, errors)
```

### Job Scheduler

**Responsibility:** Daily automation tasks

**Pattern Options:**

1. **Spring @Scheduled (Simple)**
   - Built into Spring Boot
   - Runs in same process as API
   - Good for simple, fast jobs
   - Risk: blocks API if job is heavy

2. **Fly.io Cron Manager (Recommended for heavy jobs)**
   - Spins up isolated machines per job
   - Jobs don't affect API performance
   - Clean environment each run
   - Central JSON configuration

**Recommendation:** Use **Spring @Scheduled for light jobs** (validation checks, cache refresh) and **Cron Manager for heavy jobs** (scraping, content generation) that could impact API performance.

**Job Types:**
```
Daily:
  - ScrapeHoneyProducts: Find new honey from retailers
  - ValidateData: Check affiliate links still work
  - UpdateFarmersMarkets: Refresh market schedules
  - GenerateContent: AI-generate new articles

Weekly:
  - RefreshRatings: Recalculate aggregate ratings
  - CleanupData: Archive stale products
```

### AI Integration Layer

**Responsibility:** AI-powered features

**Pattern (from cigar-explorer):**
```java
@Service
public class RecommendationService {
    // Primary: OpenAI API
    // Fallback: Keyword-based matching

    public Recommendations getRecommendations(String description) {
        if (openAiService.isConfigured()) {
            try {
                return openAiService.recommend(description, getAllHoney());
            } catch (Exception e) {
                log.warn("OpenAI failed, falling back");
            }
        }
        return keywordBasedRecommendations(description);
    }
}
```

**AI Use Cases:**
1. **Recommendations** - "I like mild, floral honey for tea" -> suggestions
2. **Content Generation** - Auto-generate articles about honey types
3. **Description Enhancement** - Enrich product descriptions

## Data Flow

### Browse/Filter Flow
```
User selects filters -> React updates URL params
    |
    v
React calls GET /api/honey?origin=New+Zealand&flavor=manuka
    |
    v
Spring Controller parses params -> Service builds query
    |
    v
Repository executes filtered query -> Returns honey list
    |
    v
React receives JSON -> Updates UI with filtered results
```

### AI Recommendation Flow
```
User describes preference -> POST /api/recommendations/describe
    |
    v
RecommendationService receives description
    |
    v
If OpenAI configured:
    - Format all honey as context
    - Send to OpenAI with prompt
    - Parse structured response
    - Match cigar IDs to full objects
Else:
    - Parse keywords from description
    - Score each honey against keywords
    - Return top 5 scored
    |
    v
Return recommendations with reasoning
    |
    v
React displays cards with match scores
```

### Local Finder Flow
```
User enters city or uses geolocation
    |
    v
GET /api/locations?city=Austin OR ?lat=30.2&lng=-97.7
    |
    v
Repository queries by city OR by distance (PostGIS or simple math)
    |
    v
Return locations with distance, open status
    |
    v
React displays on map + list view
```

### Daily Automation Flow (Cron Manager pattern)
```
06:00 UTC - Cron Manager triggers scrape job
    |
    v
Job machine starts with fresh environment
    |
    v
1. Fetch retailer pages
2. Parse honey products
3. Check for duplicates
4. Insert new / update existing
5. Log results to job_runs table
    |
    v
Job machine shuts down
    |
    v
12:00 UTC - Validation job runs
    |
    v
1. Check all affiliate URLs (HEAD requests)
2. Mark unavailable products
3. Alert if too many failures
```

## Patterns to Follow

### Pattern 1: Faceted Search
**What:** Return available filter options dynamically based on data

**Why:** Users see only relevant filter options (origins that exist in catalog)

**Example:**
```java
@GetMapping("/facets")
public Map<String, List<String>> getFacets() {
    return Map.of(
        "origins", honeyService.getAllOrigins(),
        "flavors", honeyService.getAllFlavors(),
        "types", honeyService.getAllTypes(),
        "benefits", honeyService.getAllBenefits()
    );
}
```

### Pattern 2: AI with Fallback
**What:** Try AI service, fall back to algorithmic matching

**Why:** AI costs money and can fail; keyword matching is free and reliable

**When:** Any AI-powered feature

### Pattern 3: Slug-based URLs
**What:** Use SEO-friendly slugs, not IDs, in URLs

**Example:**
```
/honey/new-zealand-manuka-mgo-400 (good)
/honey/12345 (bad)
```

### Pattern 4: Affiliate Link Indirection
**What:** Route clicks through your API for tracking

**Example:**
```
GET /api/honey/123/click -> 302 redirect to affiliate URL
```

**Why:** Track clicks, swap links without DB updates, add analytics

### Pattern 5: Static Site Generation for SEO
**What:** Pre-render key pages at build time

**Example (vite-react-ssg):**
```typescript
export const getStaticPaths = async () => {
    const honey = await fetchAllHoneySlugs();
    return honey.map(h => ({ params: { slug: h.slug }}));
};
```

**Why:** Search engines index static HTML; React hydrates for interactivity

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct AI Calls from Frontend
**What:** Calling OpenAI directly from React

**Why bad:**
- Exposes API key
- No fallback when AI fails
- Can't rate limit or cache

**Instead:** Always proxy through backend

### Anti-Pattern 2: Blocking Scraping in API Process
**What:** Running long scraping jobs in API thread pool

**Why bad:**
- Consumes threads needed for user requests
- One slow scrape can starve the API

**Instead:** Use separate job machines (Cron Manager) or dedicated process group

### Anti-Pattern 3: Storing HTML in Database
**What:** Storing scraped raw HTML for later parsing

**Why bad:**
- Bloats database
- Parsing is fragile over time

**Instead:** Parse immediately, store structured data, log source URL for re-scrape

### Anti-Pattern 4: Global Mutable State for Jobs
**What:** Using static variables to track job state

**Why bad:**
- Won't work with multiple instances
- State lost on restart

**Instead:** Store job state in database (job_runs table)

### Anti-Pattern 5: No Graceful Degradation
**What:** Failing completely when optional service is down

**Why bad:**
- AI outage breaks recommendations entirely
- Scraping failure shows errors to users

**Instead:** Always have fallback (keyword matching, cached data, "unavailable" message)

## Build Order (Suggested Phase Dependencies)

Based on component dependencies:

```
Phase 1: Foundation
├── PostgreSQL schema
├── Spring Boot project structure
├── Basic Honey entity + CRUD
└── React project with routing

Phase 2: Core Discovery
├── Honey browse/filter (depends on Phase 1)
├── Faceted search
├── Honey detail pages
└── SEO/SSG setup

Phase 3: AI Features
├── OpenAI integration (depends on honey data)
├── Recommendation endpoint
├── Fallback keyword matching
└── AI recommendation UI

Phase 4: Local Finder
├── Location entity + data
├── City guides (static data first)
├── Location API with geo queries
└── Map UI component

Phase 5: Content & Reviews
├── Article entity + admin
├── AI content generation job
├── Review entity + moderation
└── Article/review UI

Phase 6: Automation
├── Job scheduler setup (Cron Manager)
├── Scraping jobs
├── Validation jobs
└── Monitoring/alerting
```

**Rationale:**
- Phase 1-2 delivers core value (browse honey) quickly
- Phase 3 adds differentiation (AI) once data exists
- Phase 4 adds local finder (separate data source)
- Phase 5 adds content (depends on honey catalog for topics)
- Phase 6 adds automation (requires stable data model)

## Scalability Considerations

| Concern | At 100 users/day | At 10K users/day | At 1M users/day |
|---------|------------------|------------------|-----------------|
| Database | Fly.io shared PG | Fly.io dedicated PG | Read replicas + connection pooling |
| API | Single 1GB machine | 2x machines + auto-scale | Multiple regions |
| Frontend | Static on Nginx | CDN edge caching | Full CDN (Cloudflare) |
| AI calls | Per-request | Response caching (5min) | Request queuing + cache |
| Scraping | Single job machine | Parallel job machines | Distributed queue |

**Current Recommendation:** Start with single-region, single-machine setup (like cigar-explorer). Fly.io auto-scaling handles spikes. Optimize later when traffic justifies complexity.

## Deployment Architecture (Fly.io)

Based on cigar-explorer pattern:

```dockerfile
# Multi-stage build
FROM maven:3.9-eclipse-temurin-17-alpine AS backend-build
# Build Spring Boot JAR

FROM node:18-alpine AS frontend-build
# Build React static files

FROM eclipse-temurin:17-jre-alpine
# Install nginx
# Copy JAR + static files
# Start both services with supervisord or start.sh
```

**fly.toml:**
```toml
app = 'honey-explorer'
primary_region = 'dfw'

[http_service]
  internal_port = 80
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 1

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
```

**For Cron Manager (if used):**
```json
{
  "jobs": [
    {
      "name": "scrape-honey",
      "schedule": "0 6 * * *",
      "image": "honey-explorer-jobs:latest",
      "command": ["java", "-jar", "/app/jobs.jar", "scrape"]
    },
    {
      "name": "validate-links",
      "schedule": "0 12 * * *",
      "image": "honey-explorer-jobs:latest",
      "command": ["java", "-jar", "/app/jobs.jar", "validate"]
    }
  ]
}
```

## Sources

**Architecture Patterns:**
- [Spring Boot Architecture](https://www.geeksforgeeks.org/springboot/spring-boot-architecture/)
- [Microservices Service Discovery](https://microservices.io/patterns/client-side-discovery.html)
- [Software Architecture Patterns 2026](https://www.sayonetech.com/blog/software-architecture-patterns/)

**Scheduling:**
- [Spring Boot @Scheduled](https://www.baeldung.com/spring-scheduled-tasks)
- [Spring Boot Scheduling Best Practices](https://dev.to/dixitgurv/spring-boot-scheduling-best-practices-503h)
- [Mastering Job Scheduling in Spring Boot](https://medium.com/hprog99/mastering-job-scheduling-in-spring-boot-from-basics-to-best-practices-74ab938d80fa)

**Fly.io:**
- [Fly.io Cron Manager](https://github.com/fly-apps/cron-manager)
- [Fly.io Task Scheduling Guide](https://fly.io/docs/blueprints/task-scheduling/)
- [Supercronic for Fly.io](https://github.com/fly-apps/supercronic)

**Proven Reference:**
- cigar-explorer codebase (React + Spring Boot + PostgreSQL on Fly.io)
