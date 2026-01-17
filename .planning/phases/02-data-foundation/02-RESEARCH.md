# Phase 2: Data Foundation - Research

**Researched:** 2026-01-17
**Domain:** Honey taxonomy, data modeling, Spring Data JPA, Flyway migrations
**Confidence:** HIGH

## Summary

This research covers everything needed to define honey taxonomy and build robust data models for the Honey Explorer platform. The honey domain has well-established classification systems (floral source, origin, processing type, flavor profiles) that can be mapped to controlled vocabularies using Java enums persisted as strings.

The existing project already has Spring Data JPA, Flyway, and PostgreSQL configured correctly. The data models need to support faceted filtering (Phase 5), verification metadata for freshness tracking, and the visual-first design philosophy (image URLs, hero images).

**Primary recommendation:** Use `@Enumerated(EnumType.STRING)` for all controlled vocabularies, leverage Spring Data JPA auditing for timestamps, and design entities with Phase 3 (data seeding) and Phase 5 (filtering/search) in mind.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Spring Data JPA | 3.4.1 (via Boot) | ORM and repository pattern | Standard for Spring Boot data access |
| Flyway | 10.x (via Boot) | Database migrations | Already configured, production-ready |
| PostgreSQL | 17 | Production database | Already provisioned on Fly.io |
| H2 | 2.x | Development database | In-memory, fast iteration |
| Lombok | 1.18.x | Boilerplate reduction | Already in pom.xml |
| Bean Validation | 3.0 (via Boot) | Entity validation | Already included via starter-validation |

### Supporting (No Additional Dependencies Needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Spring Data JPA Auditing | Built-in | @CreatedDate, @LastModifiedDate | Verification metadata |
| Jakarta Validation | Built-in | @NotNull, @Size, @Pattern | Entity constraints |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| String enums | PostgreSQL native enums | Adds complexity for enum evolution; STRING is safer |
| JSONB columns | Separate tables | JSONB good for flexible attributes; use sparingly |
| UUID keys | Long auto-increment | UUID better for distributed systems, API exposure |

**Installation:** No new dependencies required. All needed libraries already in pom.xml.

## Architecture Patterns

### Recommended Project Structure
```
backend/src/main/java/com/honeyexplorer/
├── entity/                    # JPA entities
│   ├── Honey.java
│   ├── LocalSource.java
│   └── BaseAuditEntity.java   # Shared audit fields
├── entity/enums/              # Controlled vocabularies
│   ├── FloralSource.java
│   ├── HoneyOrigin.java
│   ├── HoneyType.java
│   ├── FlavorProfile.java
│   ├── SourceType.java
│   └── Certification.java
├── repository/                # Spring Data repositories
│   ├── HoneyRepository.java
│   └── LocalSourceRepository.java
├── dto/                       # Data transfer objects
│   ├── HoneyDTO.java
│   ├── LocalSourceDTO.java
│   └── FilterOptionsDTO.java
├── controller/                # REST controllers
│   └── FilterController.java
└── config/
    └── JpaAuditingConfig.java
```

### Pattern 1: Base Audit Entity
**What:** Abstract class with shared audit/verification fields
**When to use:** All entities needing timestamp tracking and verification metadata
**Example:**
```java
// Source: Spring Data JPA Auditing documentation
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseAuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Verification metadata for data freshness
    @Column
    private LocalDateTime lastVerifiedAt;

    @Column
    private String verificationSource;

    @Column
    private Boolean isVerified = false;
}
```

### Pattern 2: Enum as STRING for Controlled Vocabularies
**What:** Store enum values as readable strings, not ordinals
**When to use:** All controlled vocabulary fields
**Example:**
```java
// Source: Vlad Mihalcea - best way to map enum with JPA/Hibernate
public enum FloralSource {
    CLOVER,
    WILDFLOWER,
    MANUKA,
    ORANGE_BLOSSOM,
    BUCKWHEAT,
    ACACIA,
    LAVENDER,
    EUCALYPTUS,
    // ... more
    OTHER
}

@Entity
public class Honey extends BaseAuditEntity {

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private FloralSource floralSource;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private HoneyType type;
}
```

### Pattern 3: Filter Options Endpoint
**What:** API endpoint returning available filter values with counts
**When to use:** Powering faceted search UI
**Example:**
```java
// DTO for filter metadata
public record FilterOptionsDTO(
    List<EnumOption> floralSources,
    List<EnumOption> origins,
    List<EnumOption> types,
    List<EnumOption> flavorProfiles
) {}

public record EnumOption(
    String value,
    String displayName,
    Long count  // Number of matching items (0 initially)
) {}

// Controller
@RestController
@RequestMapping("/api/filters")
public class FilterController {

    @GetMapping("/options")
    public FilterOptionsDTO getFilterOptions() {
        return new FilterOptionsDTO(
            Arrays.stream(FloralSource.values())
                .map(e -> new EnumOption(e.name(), e.getDisplayName(), 0L))
                .toList(),
            // ... other enums
        );
    }
}
```

### Anti-Patterns to Avoid
- **Ordinal enum persistence:** Never use `@Enumerated(EnumType.ORDINAL)`. Reordering enums breaks data.
- **Modifying applied migrations:** Never edit V1, V2 etc. after they run. Create new Vn migrations.
- **PostgreSQL native enums:** Tempting but hard to evolve. Adding values requires careful migration.
- **Over-normalization:** Don't create separate tables for small, stable controlled vocabularies.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Audit timestamps | Manual setPrePersist hooks | @CreatedDate/@LastModifiedDate | Built into Spring Data JPA, well-tested |
| UUID generation | UUID.randomUUID() in code | @GeneratedValue(strategy = UUID) | Hibernate 6+ handles it correctly |
| Enum display names | Database lookup table | Enum method + frontend mapping | Enums already contain all needed info |
| Migration ordering | Manual SQL scripts | Flyway versioned migrations | Automatic ordering, checksums, rollback tracking |
| Connection pooling | Manual DataSource config | HikariCP (default in Boot) | Already configured, optimal defaults |

**Key insight:** Spring Data JPA 3.x with Hibernate 6+ handles most data concerns out of the box. Focus on domain modeling, not infrastructure.

## Common Pitfalls

### Pitfall 1: Enum Evolution Breaking Data
**What goes wrong:** Adding/removing/reordering enum values breaks existing rows
**Why it happens:** ORDINAL storage uses index position; removing values shifts all indexes
**How to avoid:** Always use `@Enumerated(EnumType.STRING)`. Add `OTHER` fallback for unknowns.
**Warning signs:** Unexplained data corruption after enum changes

### Pitfall 2: Missing updatable=false on Created Fields
**What goes wrong:** createdAt gets updated on every save
**Why it happens:** Default JPA behavior updates all columns
**How to avoid:** `@Column(nullable = false, updatable = false)` on createdAt/createdBy
**Warning signs:** Created timestamps changing unexpectedly

### Pitfall 3: Flyway Checksum Mismatch
**What goes wrong:** Application fails to start with "checksum mismatch" error
**Why it happens:** Developer edited an already-applied migration file
**How to avoid:** Never modify Vn files after they've been applied. Create new Vn+1 instead.
**Warning signs:** CI/CD failures after migration file edits

### Pitfall 4: H2 vs PostgreSQL Syntax Differences
**What goes wrong:** Migrations work in dev (H2) but fail in prod (PostgreSQL)
**Why it happens:** H2 compatibility mode doesn't cover all PostgreSQL syntax
**How to avoid:** Use standard SQL syntax. Test migrations against PostgreSQL locally.
**Warning signs:** "Syntax error" in production but not development

### Pitfall 5: Forgetting @EnableJpaAuditing
**What goes wrong:** @CreatedDate and @LastModifiedDate stay null
**Why it happens:** Auditing requires explicit enablement
**How to avoid:** Add `@EnableJpaAuditing` to a @Configuration class
**Warning signs:** Null audit fields on newly created entities

## Honey Domain Knowledge

### Floral Source Classification (Controlled Vocabulary)
Based on UC Davis Honey Flavor Wheel and industry standards:

**Common Floral Sources (North America focus for MVP):**
- CLOVER - Most common US honey, mild and sweet
- WILDFLOWER - Polyfloral, varies by region
- ORANGE_BLOSSOM - Florida specialty, citrus notes
- BUCKWHEAT - Dark, bold, molasses-like
- MANUKA - New Zealand, medicinal properties
- ACACIA - Light, mild, slow to crystallize
- LAVENDER - Floral, herbal notes
- TUPELO - Southeast US, high fructose (resists crystallization)
- SAGE - California specialty
- SOURWOOD - Appalachian specialty
- EUCALYPTUS - Australia/California
- BLUEBERRY - Northeast US
- AVOCADO - California, dark and rich
- OTHER - Catch-all for rare varieties

### Honey Type Classification
Based on processing method:

| Type | Description | Visual Indicator |
|------|-------------|------------------|
| RAW | Unheated, unfiltered | Cloudy, may crystallize |
| FILTERED | Pollen/particles removed | Clear, smooth |
| PASTEURIZED | Heat-treated | Clear, shelf-stable |
| CREAMED | Controlled crystallization | Smooth, spreadable |
| COMB | Honeycomb intact | Wax visible |
| INFUSED | Flavors added | Varies |
| ORGANIC | Certified organic | Label required |

### Flavor Profile Categories
From UC Davis Honey Flavor Wheel (HIGH confidence):

**Primary Categories:**
- FRUITY (berry, citrus, tropical, dried fruit)
- FLORAL (light, medium, intense)
- EARTHY (soil, mineral, mushroom)
- WOODY (oak, cedar, bark)
- SPICY (cinnamon, pepper, warm spices)
- CONFECTIONARY (caramel, molasses, butterscotch)
- HERBACEOUS (green, herbal, tea-like)
- NUTTY (almond, hazelnut)

**Simplified for MVP (use multi-select):**
SWEET, FLORAL, FRUITY, EARTHY, BOLD, SPICY, MILD, COMPLEX

### Origin Regions
For geographic filtering:

**Country-level:** USA, NEW_ZEALAND, AUSTRALIA, ARGENTINA, MEXICO, CANADA, BRAZIL, GREECE, TURKEY, SPAIN, FRANCE, ITALY, OTHER

**USA Regions (for local filtering):** NORTHEAST, SOUTHEAST, MIDWEST, SOUTHWEST, WEST, PACIFIC_NORTHWEST

**Note:** Store country as enum, region as nullable string for flexibility.

### Certifications
| Certification | Meaning | Relevant For |
|---------------|---------|--------------|
| UMF | Unique Manuka Factor (5+, 10+, 15+, 20+) | Manuka honey only |
| MGO | Methylglyoxal level | Manuka honey |
| USDA_GRADE_A | Quality grade | Any US honey |
| USDA_ORGANIC | Organic certification | Organic honey |
| TRUE_SOURCE | Traceability verified | Import transparency |
| NON_GMO | Non-GMO project verified | Premium positioning |

## Code Examples

Verified patterns from official sources:

### Enable JPA Auditing
```java
// Source: Spring Data JPA documentation
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
    // Bean definitions if needed for AuditorAware
}
```

### Complete Honey Entity
```java
@Entity
@Table(name = "honeys")
public class Honey extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private FloralSource floralSource;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private HoneyType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private HoneyOrigin origin;

    @Column(length = 100)
    private String region;  // Nullable, more specific than origin

    // Multi-select flavor profiles stored as comma-separated or JSON
    @Column(length = 200)
    private String flavorProfiles;  // "FLORAL,SWEET,MILD"

    // Visual-first: image URLs
    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String thumbnailUrl;

    // Product details
    private String brand;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceMin;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceMax;

    // Certifications as comma-separated or JSON
    @Column(length = 200)
    private String certifications;

    // Manuka-specific
    private Integer umfRating;
    private Integer mgoRating;

    // SEO/content
    @Column(length = 200)
    private String slug;
}
```

### Complete LocalSource Entity
```java
@Entity
@Table(name = "local_sources")
public class LocalSource extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private SourceType sourceType;  // BEEKEEPER, FARM, FARMERS_MARKET, STORE, APIARY

    @Column(length = 1000)
    private String description;

    // Location
    @Column(nullable = false)
    private String address;

    private String city;
    private String state;

    @Column(length = 10)
    private String zipCode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // Contact
    private String phone;
    private String email;
    private String website;

    // Hours (JSON or structured)
    @Column(columnDefinition = "TEXT")
    private String hoursJson;  // {"mon": "9-5", "tue": "9-5", ...}

    // Visual-first: images
    @Column(length = 500)
    private String heroImageUrl;

    @Column(length = 500)
    private String thumbnailUrl;

    // Social
    private String instagramHandle;
    private String facebookUrl;

    // Verification
    @Column
    private Boolean isActive = true;
}
```

### Flyway Migration V2 Example
```sql
-- V2__create_honey_tables.sql
-- Creates core honey and local_source tables

CREATE TABLE honeys (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    floral_source VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL,
    origin VARCHAR(30) NOT NULL,
    region VARCHAR(100),
    flavor_profiles VARCHAR(200),
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    brand VARCHAR(100),
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    certifications VARCHAR(200),
    umf_rating INT,
    mgo_rating INT,
    slug VARCHAR(200),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_verified_at TIMESTAMP,
    verification_source VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE local_sources (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) NOT NULL,
    description TEXT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    hours_json TEXT,
    hero_image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    instagram_handle VARCHAR(100),
    facebook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_verified_at TIMESTAMP,
    verification_source VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE
);

-- Indexes for common queries
CREATE INDEX idx_honeys_floral_source ON honeys(floral_source);
CREATE INDEX idx_honeys_type ON honeys(type);
CREATE INDEX idx_honeys_origin ON honeys(origin);
CREATE INDEX idx_honeys_slug ON honeys(slug);

CREATE INDEX idx_local_sources_source_type ON local_sources(source_type);
CREATE INDEX idx_local_sources_state ON local_sources(state);
CREATE INDEX idx_local_sources_location ON local_sources(latitude, longitude);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @GenericGenerator for UUID | @GeneratedValue(strategy = UUID) | JPA 3.1 (2022) | Simpler, standard |
| Hibernate 5 type mappings | Native Hibernate 6 JSON | Hibernate 6.2 (2023) | No hypersistence-utils needed |
| Manual audit timestamps | Spring Data Auditing | Long-standing | Built-in, reliable |
| ORDINAL enums | STRING enums | Best practice consensus | Safer evolution |

**Deprecated/outdated:**
- `@Type(type = "...")` Hibernate 5 syntax - use Hibernate 6 annotations
- Manual UUID generation - use JPA 3.1 strategy
- Flyway < 10 syntax for PostgreSQL 17 - use flyway-database-postgresql module

## Open Questions

Things that couldn't be fully resolved:

1. **Multi-select flavor profiles storage**
   - What we know: Can use comma-separated string, JSON array, or join table
   - What's unclear: Best approach for filtering performance
   - Recommendation: Use comma-separated for MVP simplicity, migrate to join table if filtering becomes complex

2. **Business hours representation**
   - What we know: Can use JSON column or separate table
   - What's unclear: UI needs for hours display
   - Recommendation: JSON column for flexibility, parse in frontend

3. **Image CDN strategy**
   - What we know: Phase 3 will use Replicate for generation
   - What's unclear: CDN provider not yet decided
   - Recommendation: Store full URLs, make CDN decision in Phase 3

## Sources

### Primary (HIGH confidence)
- [Spring Data JPA Auditing Documentation](https://docs.spring.io/spring-data/jpa/reference/auditing.html) - Audit annotation patterns
- [Vlad Mihalcea - Enum Mapping](https://vladmihalcea.com/the-best-way-to-map-an-enum-type-with-jpa-and-hibernate/) - STRING vs ORDINAL decision
- [UC Davis Honey Flavor Wheel](https://honey.ucdavis.edu/news/honey-flavor-and-aroma-wheel-complete) - Flavor taxonomy
- [Baeldung - JPA Persisting Enums](https://www.baeldung.com/jpa-persisting-enums-in-jpa) - Enum patterns

### Secondary (MEDIUM confidence)
- [Bee Inspired Goods - 300 Types of Honey](https://beeinspiredgoods.com/blogs/beekeeping/types-of-honey-a-complete-list) - Floral source list
- [Manuka Health - UMF Certifications](https://us.manukahealth.com/blogs/articles/umf-certifications) - Certification standards
- [Nettie's Bees - Honey Varieties](https://www.nettiesbees.com/post/the-complete-guide-to-raw-honey-varieties-by-floral-source) - Variety descriptions

### Tertiary (LOW confidence)
- Various honey retailer sites - Price ranges (varies by market)
- Stack Overflow discussions - Pattern validation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already configured, well-documented
- Architecture: HIGH - Standard Spring Data JPA patterns
- Honey taxonomy: HIGH - Based on UC Davis research and industry standards
- Pitfalls: HIGH - Well-documented common issues

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - stable domain)
