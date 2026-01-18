---
phase: 03-data-seeding
plan: 02
subsystem: database
tags: [json, jackson, commandlinerunner, seeding, spring-boot]

# Dependency graph
requires:
  - phase: 02-data-foundation
    provides: Entity classes (Honey, LocalSource) and repositories
provides:
  - 210 honey varieties seed data with complete metadata
  - 52 local source seed data with location coordinates
  - CommandLineRunner seeder infrastructure
  - Conditional seeding via seed.data.enabled property
affects: [04-backend-api, production-deployment]

# Tech tracking
tech-stack:
  added: [jackson-databind (existing)]
  patterns: [CommandLineRunner for initialization, TypeReference for generic JSON parsing]

key-files:
  created:
    - backend/src/main/java/com/honeyexplorer/seeder/HoneySeedDto.java
    - backend/src/main/java/com/honeyexplorer/seeder/LocalSourceSeedDto.java
    - backend/src/main/java/com/honeyexplorer/seeder/DataSeeder.java
    - backend/src/main/java/com/honeyexplorer/seeder/HoneySeeder.java
    - backend/src/main/java/com/honeyexplorer/seeder/LocalSourceSeeder.java
    - backend/src/main/resources/seed-data/honeys.json
    - backend/src/main/resources/seed-data/local-sources.json
  modified:
    - backend/src/main/resources/application.properties

key-decisions:
  - "Java records for seed DTOs for immutable data transfer"
  - "Idempotent seeding - skips if database already has data"
  - "Conditional seeding via seed.data.enabled property (default false)"
  - "Verification metadata set during seeding (lastVerifiedAt, verificationSource='initial_seed', isVerified=true)"

patterns-established:
  - "Seed data stored as JSON in classpath resources"
  - "CommandLineRunner with @Order for startup initialization"
  - "Placeholder image URLs following CDN pattern"

# Metrics
duration: 12min
completed: 2026-01-18
---

# Phase 3 Plan 2: Honey and Local Source Seed Data Summary

**210 curated honey varieties and 52 local sources with CommandLineRunner seeder infrastructure for database population**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-18T19:35:24Z
- **Completed:** 2026-01-18T19:47:26Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Created seeder infrastructure with CommandLineRunner, DTOs, and conditional flag
- Curated 210 honey varieties covering all 17 FloralSource types with realistic metadata
- Curated 52 local sources across 37 US states with accurate coordinates
- Established idempotent seeding pattern (skips if data exists)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Seed DTOs and Seeder Infrastructure** - `570cebc` (feat)
2. **Task 2: Curate Honey Seed Data (200+ varieties)** - `eb5455a` (feat)
3. **Task 3: Curate Local Source Seed Data (50+ sources)** - `a4379eb` (feat)

## Files Created/Modified

- `backend/src/main/java/com/honeyexplorer/seeder/HoneySeedDto.java` - Java record for honey JSON mapping
- `backend/src/main/java/com/honeyexplorer/seeder/LocalSourceSeedDto.java` - Java record for local source JSON mapping
- `backend/src/main/java/com/honeyexplorer/seeder/DataSeeder.java` - CommandLineRunner entry point with seed.data.enabled flag
- `backend/src/main/java/com/honeyexplorer/seeder/HoneySeeder.java` - Loads honeys.json and maps to entities
- `backend/src/main/java/com/honeyexplorer/seeder/LocalSourceSeeder.java` - Loads local-sources.json and maps to entities
- `backend/src/main/resources/seed-data/honeys.json` - 210 honey varieties (3782 lines)
- `backend/src/main/resources/seed-data/local-sources.json` - 52 local sources (990 lines)
- `backend/src/main/resources/application.properties` - Added seed.data.enabled=false

## Seed Data Distribution

**Honeys by FloralSource (210 total):**
- CLOVER: 20, WILDFLOWER: 22, MANUKA: 18, ORANGE_BLOSSOM: 14
- BUCKWHEAT: 10, ACACIA: 14, LAVENDER: 10, TUPELO: 5
- SAGE: 8, SOURWOOD: 8, EUCALYPTUS: 10, BLUEBERRY: 5
- AVOCADO: 5, LINDEN: 10, CHESTNUT: 8, HEATHER: 8, OTHER: 35

**Local Sources by SourceType (52 total):**
- BEEKEEPER: 16, FARM: 9, FARMERS_MARKET: 9
- APIARY: 8, STORE: 4, COOPERATIVE: 6

**Geographic Coverage:** 37 US states from Alaska to Florida

## Decisions Made

1. **Java records for DTOs** - Immutable, concise, auto-generated equals/hashCode
2. **Idempotent seeding** - Check `repository.count() > 0` before seeding to prevent duplicates
3. **Conditional flag** - `seed.data.enabled=false` by default, set to true for one-time seeding
4. **Verification metadata** - All seeded records get `isVerified=true`, `verificationSource='initial_seed'`, `lastVerifiedAt=now()`
5. **Placeholder image URLs** - Follow CDN pattern `https://images.honeyexplorer.com/honeys/{slug}.webp`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Seed data ready for production deployment
- To seed production database: set `SEED_DATA_ENABLED=true` environment variable
- After initial seeding, set back to false to prevent re-seeding on restarts
- Image URLs are placeholders - will need actual images uploaded to CDN

---
*Phase: 03-data-seeding*
*Completed: 2026-01-18*
