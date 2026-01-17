---
phase: 01-infrastructure-foundation
plan: 02
subsystem: infra
tags: [fly-io, docker, nginx, postgres, github-actions, ci-cd, deployment]

# Dependency graph
requires:
  - phase: 01-01
    provides: Spring Boot backend, React frontend, health endpoint
provides:
  - Production deployment on Fly.io (https://honey-explorer.fly.dev)
  - PostgreSQL 17 database provisioned and attached
  - Multi-stage Docker build (Maven + Node + Runtime)
  - Nginx reverse proxy with Java backend
  - GitHub Actions CI/CD pipeline for auto-deploy on push to main
affects: [all-phases, 02-database-schema, 03-data-seeding]

# Tech tracking
tech-stack:
  added: [fly-io, postgres-17, docker-multi-stage, nginx-alpine, github-actions, flyway-database-postgresql]
  patterns: [multi-stage-docker, database-url-parsing, prod-profile-config]

key-files:
  created:
    - Dockerfile
    - start.sh
    - fly.toml
    - backend/src/main/resources/application-prod.properties
    - .github/workflows/deploy.yml
  modified:
    - backend/pom.xml (added flyway-database-postgresql)

key-decisions:
  - "Used Fly.io Dallas (dfw) region for low latency"
  - "1GB VM memory to support JVM + Nginx"
  - "Auto-stop machines enabled to save costs when idle"
  - "Flyway manages schema in production (ddl-auto=validate)"
  - "Added flyway-database-postgresql for PostgreSQL 17 compatibility"

patterns-established:
  - "Multi-stage Docker: Maven build -> Node build -> Runtime"
  - "start.sh parses DATABASE_URL to JDBC format"
  - "Single Fly machine runs both Nginx (frontend) and Java (backend)"
  - "GitHub Actions deploys on push to main branch"

# Metrics
duration: 14min
completed: 2026-01-17
---

# Phase 1 Plan 02: Fly.io Deployment and CI/CD Pipeline Summary

**Production deployment on Fly.io with PostgreSQL 17, multi-stage Docker build, Nginx reverse proxy, and GitHub Actions CI/CD auto-deploy pipeline**

## Performance

- **Duration:** 14 min
- **Started:** 2026-01-17T19:11:29Z
- **Completed:** 2026-01-17T19:25:23Z
- **Tasks:** 7 (6 automated + 1 human verification checkpoint)
- **Files modified:** 6

## Accomplishments
- Deployed honey-explorer to Fly.io at https://honey-explorer.fly.dev
- Provisioned PostgreSQL 17 database with Fly Postgres
- Multi-stage Dockerfile: Maven build, Node build, and Alpine runtime with Nginx + JRE
- Production application properties with Flyway schema management
- GitHub Actions workflow for automatic deployment on push to main
- Health endpoint verified working at /api/health

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Dockerfile for multi-stage build** - `a0bdf30` (chore)
2. **Task 2: Create start.sh startup script** - `abd79b0` (chore)
3. **Task 3: Create production application properties** - `65a090d` (chore)
4. **Task 4: Create fly.toml configuration** - `dc3c04b`, `8120a80` (chore)
5. **Task 5: Deploy to Fly.io and provision PostgreSQL** - `f1d9c0c` (fix)
6. **Task 6: Create GitHub Actions CI/CD workflow** - `71156a6` (chore)
7. **Task 7: Verify production deployment** - Human verification checkpoint (passed)

## Files Created/Modified

### Root
- `Dockerfile` - Multi-stage build: Maven backend, Node frontend, Alpine runtime with Nginx + JRE
- `start.sh` - Startup script parsing DATABASE_URL to JDBC, starting Java backend and Nginx
- `fly.toml` - Fly.io configuration: dfw region, 1GB memory, auto-stop enabled

### Backend
- `backend/src/main/resources/application-prod.properties` - Production config with Flyway validate mode
- `backend/pom.xml` - Added flyway-database-postgresql dependency for PG 17 support

### GitHub Actions
- `.github/workflows/deploy.yml` - CI/CD workflow deploying to Fly.io on push to main

## Decisions Made
- **Dallas (dfw) region:** Selected for low latency and cost efficiency
- **1GB VM memory:** JVM needs at least 512MB; 1GB provides headroom for Nginx and caching
- **Auto-stop machines:** Enabled to save costs during idle periods; min_machines_running=0
- **Flyway validate mode:** Production uses `ddl-auto=validate` since Flyway manages all migrations
- **flyway-database-postgresql:** Required for PostgreSQL 17 compatibility (separate dialect module)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added flyway-database-postgresql dependency**
- **Found during:** Task 5 (Initial deployment attempt)
- **Issue:** Flyway 10.x requires separate database dialect module for PostgreSQL 17
- **Fix:** Added `flyway-database-postgresql` dependency to pom.xml
- **Files modified:** backend/pom.xml
- **Verification:** Deploy succeeded, health endpoint returns healthy
- **Committed in:** f1d9c0c

**2. [Rule 1 - Bug] Set min_machines_running to 0**
- **Found during:** Task 4 (fly.toml configuration)
- **Issue:** Fly.io personal org limits prevented min_machines_running=1
- **Fix:** Changed to min_machines_running=0 to work within limits
- **Files modified:** fly.toml
- **Verification:** Deployment succeeded
- **Committed in:** 8120a80

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for successful deployment. No scope creep.

## Authentication Gates

During execution, these authentication requirements were handled:

1. Task 5: Fly CLI was already authenticated (no action needed)
2. Task 6: GitHub repository secrets required manual FLY_API_TOKEN configuration

## Issues Encountered

- **PostgreSQL 17 dialect:** Flyway 10.x moved database dialects to separate modules. Error message pointed to missing `flyway-database-postgresql`. Added dependency and redeployed successfully.
- **Fly machine limits:** Personal organization has restrictions on min_machines_running. Adjusted configuration to work within limits.

## User Setup Required

**GitHub Actions requires manual FLY_API_TOKEN configuration:**

1. Generate Fly.io deploy token:
   ```bash
   fly tokens create deploy -x 999999h
   ```
2. Add token as GitHub repository secret named `FLY_API_TOKEN`
3. Push to main branch to trigger deployment

## Next Phase Readiness
- Production infrastructure fully operational
- PostgreSQL 17 database ready for schema creation
- Flyway migration system configured for schema evolution
- CI/CD pipeline ready for automatic deployments
- Ready for Phase 2: Database Schema and Entity Models

---
*Phase: 01-infrastructure-foundation*
*Completed: 2026-01-17*
