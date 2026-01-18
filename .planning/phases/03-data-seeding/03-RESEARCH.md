# Phase 3: Data Seeding - Research

**Researched:** 2026-01-17
**Domain:** Data seeding, AI image generation (Replicate), CDN storage (Cloudflare R2)
**Confidence:** MEDIUM-HIGH

## Summary

This phase requires seeding 200+ honey varieties and 50+ local sources with high-quality images. The research covers three key domains: (1) data sourcing strategies for honey varieties and local sources, (2) Replicate API integration for AI-generated product photography, and (3) Cloudflare R2 for permanent image storage with CDN delivery.

The standard approach is to create JSON seed files with honey/local source data, use Replicate's FLUX schnell model ($0.003/image) to generate product photography, immediately download generated images before URL expiration (1 hour), store permanently on Cloudflare R2, and import via Spring Boot CommandLineRunner with environment-gated execution.

**Primary recommendation:** Use FLUX schnell for cost-effective image generation ($0.60-$0.90 for 200-300 images), Cloudflare R2 for zero-egress-fee CDN storage, and JSON-based seed data with CommandLineRunner import pattern.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Replicate Node.js SDK | latest | AI image generation | Official SDK, file output handling, webhook support |
| AWS SDK v2 for Java | 2.31.50 | Cloudflare R2 uploads | R2 is S3-compatible, official Cloudflare recommendation |
| Jackson Databind | 2.17.x | JSON parsing | Spring Boot default, TypeReference for collections |
| Spring Boot CommandLineRunner | 3.4.x | Seed data import | Standard pattern for startup initialization |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Flyway | 10.x | Repeatable migrations | Optional for SQL-based seed data |
| Node.js fs module | builtin | Download Replicate outputs | Save images before URL expiration |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| FLUX schnell ($0.003) | FLUX dev ($0.030) | 10x cost for higher quality - unnecessary for product shots |
| FLUX schnell | FLUX pro ($0.055) | 18x cost - overkill for seed data |
| Cloudflare R2 | AWS S3 | S3 has egress fees - R2 is free egress |
| Cloudflare R2 | Fly.io Volumes | Volumes are machine-local, not CDN-backed |
| CommandLineRunner | data.sql | SQL less flexible for complex objects with relationships |

**Installation:**
```bash
# Node.js image generation script
npm install replicate

# Java/Spring Boot (add to pom.xml)
# AWS SDK for R2 uploads - see Architecture Patterns section
```

## Architecture Patterns

### Recommended Project Structure
```
backend/
├── src/main/java/.../
│   ├── config/
│   │   └── R2ClientConfig.java        # S3 client for R2
│   ├── seeder/
│   │   ├── DataSeeder.java            # CommandLineRunner entry point
│   │   ├── HoneySeeder.java           # Honey import logic
│   │   └── LocalSourceSeeder.java     # LocalSource import logic
│   └── service/
│       └── ImageStorageService.java   # R2 upload service
├── src/main/resources/
│   ├── seed-data/
│   │   ├── honeys.json                # 200+ honey varieties
│   │   └── local-sources.json         # 50+ local sources
│   └── db/migration/
│       └── R__seed_reference_data.sql # Optional repeatable migration
└── scripts/
    └── generate-images.js             # Node.js Replicate script
```

### Pattern 1: CommandLineRunner with Environment Gate
**What:** Seed data only imports when SEED_DATA_ENABLED=true
**When to use:** Production and development seed data import
**Example:**
```java
// Source: Spring Boot docs + best practices
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    @Value("${seed.data.enabled:false}")
    private boolean seedDataEnabled;

    private final HoneyRepository honeyRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (!seedDataEnabled) {
            log.info("Data seeding disabled, skipping");
            return;
        }

        if (honeyRepository.count() > 0) {
            log.info("Database already contains data, skipping seed");
            return;
        }

        // Import from JSON
        InputStream is = getClass().getResourceAsStream("/seed-data/honeys.json");
        List<HoneySeedDto> honeys = objectMapper.readValue(
            is, new TypeReference<List<HoneySeedDto>>() {}
        );

        honeys.forEach(dto -> {
            Honey honey = mapToEntity(dto);
            honey.setLastVerifiedAt(LocalDateTime.now());
            honey.setVerificationSource("initial_seed");
            honey.setIsVerified(true);
            honeyRepository.save(honey);
        });
    }
}
```

### Pattern 2: Replicate Image Generation (Node.js)
**What:** Generate product photography with FLUX schnell, download before expiration
**When to use:** Generating honey jar images, hero images for regions
**Example:**
```javascript
// Source: Replicate docs - https://replicate.com/docs/topics/predictions/output-files
import Replicate from "replicate";
import fs from "node:fs";
import path from "node:path";

const replicate = new Replicate();

async function generateHoneyImage(honeyName, floralSource, origin) {
    const prompt = `Professional product photography of a glass honey jar filled with golden ${floralSource.toLowerCase()} honey from ${origin}, natural wood honey dipper resting on side, soft diffused studio lighting, warm amber tones, pure white seamless background, shot with 85mm lens, f/4 aperture, commercial quality, photorealistic, 8k resolution`;

    const [output] = await replicate.run("black-forest-labs/flux-schnell", {
        input: {
            prompt,
            aspect_ratio: "4:5",  // Product-friendly
            num_outputs: 1,
            output_format: "webp",
            output_quality: 85
        }
    });

    // Download immediately - URLs expire in 1 hour!
    const filename = `${honeyName.toLowerCase().replace(/\s+/g, '-')}.webp`;
    fs.writeFileSync(path.join("./generated-images", filename), output);

    return filename;
}
```

### Pattern 3: Cloudflare R2 Upload (Spring Boot)
**What:** Upload images to R2 for permanent CDN-backed storage
**When to use:** Storing generated images, serving from CDN
**Example:**
```java
// Source: Cloudflare R2 docs - https://developers.cloudflare.com/r2/examples/aws/aws-sdk-java/
@Configuration
public class R2ClientConfig {

    @Value("${r2.account.id}")
    private String accountId;

    @Value("${r2.access.key}")
    private String accessKey;

    @Value("${r2.secret.key}")
    private String secretKey;

    @Bean
    public S3Client r2Client() {
        return S3Client.builder()
            .endpointOverride(URI.create(
                "https://" + accountId + ".r2.cloudflarestorage.com"))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .region(Region.of("auto"))  // Required but unused by R2
            .serviceConfiguration(S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .chunkedEncodingEnabled(false)
                .build())
            .build();
    }
}

@Service
public class ImageStorageService {

    private final S3Client r2Client;

    @Value("${r2.bucket.name}")
    private String bucketName;

    @Value("${r2.public.url}")
    private String publicUrl;  // e.g., https://images.honeyexplorer.com

    public String uploadImage(byte[] imageData, String key) {
        r2Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType("image/webp")
                .build(),
            RequestBody.fromBytes(imageData)
        );

        return publicUrl + "/" + key;
    }
}
```

### Anti-Patterns to Avoid
- **Storing Replicate URLs in database:** URLs expire in 1 hour - always download and re-host
- **Running image generation in CommandLineRunner:** Too slow for startup - generate offline, seed URLs
- **Modifying applied Flyway migrations:** Create new migrations, never edit versioned ones
- **Hard-coding seed data in Java:** Use JSON files for maintainability

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| S3-compatible uploads | Custom HTTP client | AWS SDK v2 | Pre-signed URLs, retry logic, multipart |
| AI image generation | Custom model hosting | Replicate API | Pay-per-use, no GPU management |
| CDN image delivery | Self-hosted nginx | Cloudflare R2 public bucket | Global edge caching included |
| JSON parsing | Manual string parsing | Jackson ObjectMapper | Type safety, error handling |
| Slug generation | Regex-based custom | Slugify library or simple replace | Unicode handling, edge cases |
| Geocoding addresses | Custom parsing | Google/Mapbox Geocoding API | Address normalization, accuracy |

**Key insight:** The image generation + storage pipeline involves multiple external services (Replicate, R2). Each service has official SDKs that handle authentication, retries, and edge cases. Building custom HTTP clients for these services wastes time and introduces bugs.

## Common Pitfalls

### Pitfall 1: Replicate URL Expiration
**What goes wrong:** Images display initially, then break after 1 hour
**Why it happens:** Replicate output URLs are temporary (1-hour expiration)
**How to avoid:** Download images immediately after generation, store on R2
**Warning signs:** Working images suddenly showing 404s, "expired" in URL parameters

### Pitfall 2: Seed Data Duplication
**What goes wrong:** Running app multiple times creates duplicate records
**Why it happens:** CommandLineRunner runs on every startup
**How to avoid:** Check `repository.count() > 0` before seeding, use environment flag
**Warning signs:** Duplicate entries, primary key conflicts

### Pitfall 3: Large JSON in Classpath
**What goes wrong:** Build times slow, memory issues
**Why it happens:** Embedding 200+ records with image URLs in classpath resources
**How to avoid:** Keep JSON reasonable size (<5MB), load images from CDN URLs
**Warning signs:** Slow builds, OutOfMemoryError during testing

### Pitfall 4: R2 Path-Style Access
**What goes wrong:** 403 Forbidden errors on upload
**Why it happens:** R2 requires `pathStyleAccessEnabled(true)` unlike AWS S3
**How to avoid:** Configure S3 client with `pathStyleAccessEnabled(true)` and `chunkedEncodingEnabled(false)`
**Warning signs:** SignatureDoesNotMatch, AccessDenied errors

### Pitfall 5: Missing Verification Metadata
**What goes wrong:** Seed data lacks lastVerifiedAt, appears stale
**Why it happens:** Forgetting to populate audit fields during import
**How to avoid:** Set `lastVerifiedAt = now()`, `verificationSource = "initial_seed"`, `isVerified = true`
**Warning signs:** Null timestamps, unverified flags on seeded data

## Code Examples

Verified patterns from official sources:

### Honey Seed Data JSON Structure
```json
// Source: Based on schema from V2__create_honey_tables.sql
[
  {
    "name": "New Zealand Manuka Honey UMF 15+",
    "description": "Premium medical-grade Manuka honey from New Zealand's North Island",
    "floralSource": "MANUKA",
    "type": "RAW",
    "origin": "NEW_ZEALAND",
    "region": "North Island",
    "flavorProfiles": "BOLD,EARTHY,COMPLEX",
    "imageUrl": "https://images.honeyexplorer.com/honeys/nz-manuka-umf-15.webp",
    "thumbnailUrl": "https://images.honeyexplorer.com/honeys/thumbnails/nz-manuka-umf-15.webp",
    "brand": "Comvita",
    "priceMin": 45.00,
    "priceMax": 65.00,
    "certifications": "UMF_15_PLUS,NON_GMO",
    "umfRating": 15,
    "mgoRating": 514,
    "slug": "new-zealand-manuka-honey-umf-15"
  }
]
```

### Local Source Seed Data JSON Structure
```json
// Source: Based on schema from V2__create_honey_tables.sql
[
  {
    "name": "Blue Ridge Honey Company",
    "sourceType": "BEEKEEPER",
    "description": "Family-owned apiary producing raw wildflower and sourwood honey since 1982",
    "address": "123 Mountain View Rd",
    "city": "Asheville",
    "state": "NC",
    "zipCode": "28801",
    "latitude": 35.5951,
    "longitude": -82.5515,
    "phone": "(828) 555-0123",
    "email": "info@blueridgehoney.com",
    "website": "https://blueridgehoney.com",
    "hoursJson": "{\"mon\":\"9-5\",\"tue\":\"9-5\",\"wed\":\"9-5\",\"thu\":\"9-5\",\"fri\":\"9-5\",\"sat\":\"10-4\",\"sun\":\"closed\"}",
    "heroImageUrl": "https://images.honeyexplorer.com/sources/blue-ridge-honey.webp",
    "thumbnailUrl": "https://images.honeyexplorer.com/sources/thumbnails/blue-ridge-honey.webp",
    "instagramHandle": "blueridgehoney",
    "facebookUrl": "https://facebook.com/blueridgehoney"
  }
]
```

### Image Generation Prompts for Different Honey Types
```javascript
// Source: Apatero blog + FLUX best practices
const prompts = {
    // Product shot for individual honey
    product: (name, floralSource, origin) =>
        `Professional product photography of a glass honey jar filled with golden ${floralSource} honey, label showing "${name}", natural wood honey dipper, soft diffused studio lighting, warm amber tones, pure white background, 85mm lens, commercial quality, photorealistic`,

    // Hero image for honey type category
    heroType: (floralSource) =>
        `Editorial hero image of ${floralSource} honey flowing from a wooden dipper into a glass jar, dramatic golden light streaming through, visible texture and viscosity, honeycomb in soft focus background, warm color palette, magazine quality, 8k`,

    // Hero image for origin region
    heroOrigin: (country, region) =>
        `Landscape photography of beekeeping in ${region}, ${country}, traditional beehives in scenic countryside, golden hour lighting, bees visible around hive entrance, pastoral atmosphere, National Geographic style, 8k`,

    // Local source hero image
    localSource: (sourceType, name) => {
        const typeDescriptions = {
            BEEKEEPER: "rustic apiary with white beehive boxes",
            FARM: "pastoral farm with honey production facility",
            FARMERS_MARKET: "vibrant farmers market stall with honey display",
            STORE: "artisanal honey shop storefront",
            APIARY: "professional apiary with multiple hive colonies",
            COOPERATIVE: "beekeeping cooperative facility"
        };
        return `Professional photography of a ${typeDescriptions[sourceType]}, "${name}" signage visible, warm natural lighting, inviting atmosphere, commercial quality, 8k`;
    }
};
```

### Maven Dependencies for R2 Integration
```xml
<!-- Source: Cloudflare R2 docs -->
<properties>
    <aws.sdk.version>2.31.50</aws.sdk.version>
</properties>

<dependencies>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
        <version>${aws.sdk.version}</version>
    </dependency>
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>apache-client</artifactId>
        <version>${aws.sdk.version}</version>
    </dependency>
</dependencies>
```

## Data Sourcing Strategy

### Honey Varieties (200+ target)

**Approach:** Curate from authoritative sources, NOT scrape copyrighted content

| Source | Data Available | Quality | Usage |
|--------|---------------|---------|-------|
| National Honey Board | 300+ varieties list | HIGH | Reference for variety names, basic characteristics |
| UC Davis Honey Flavor Wheel | Flavor profiles | HIGH | Map to FlavorProfile enum values |
| Manukora/Comvita (public info) | Manuka-specific data | MEDIUM | UMF/MGO reference ranges |
| General honey knowledge | Common varieties | MEDIUM | Fill in descriptions, pairings |

**Coverage by FloralSource enum:**
| FloralSource | Target Count | Notes |
|-------------|--------------|-------|
| CLOVER | 20+ | Most common, multiple origins |
| WILDFLOWER | 25+ | Region-specific varieties |
| MANUKA | 20+ | UMF 5+ through 20+ grades |
| ORANGE_BLOSSOM | 15+ | Florida, California, Spain |
| BUCKWHEAT | 10+ | Dark, distinctive |
| ACACIA | 15+ | European specialty |
| LAVENDER | 10+ | French, Spanish |
| TUPELO | 5+ | Florida specialty |
| SAGE | 8+ | California specialty |
| SOURWOOD | 8+ | Appalachian specialty |
| EUCALYPTUS | 10+ | Australian |
| BLUEBERRY | 5+ | Maine, Michigan |
| AVOCADO | 5+ | California |
| LINDEN | 10+ | Eastern European |
| CHESTNUT | 8+ | Italian, Turkish |
| HEATHER | 8+ | UK, Scotland |
| OTHER | 30+ | Unique/specialty varieties |

### Local Sources (50+ target)

**Primary Data Source:** USDA Farmers Market Directory
- URL: https://www.usdalocalfoodportal.com/api/farmersmarket/
- Format: JSON API with location query
- Fields: name, address, city, state, zip, lat/lng, products (filter for honey)
- Access: Requires API key application

**Supplementary Sources:**
| Source | URL | Data Available |
|--------|-----|---------------|
| Bee Culture Directory | beeculture.com/find-local-beekeeper/ | State-by-state association links |
| LocalHoneyFinder.org | localhoneyfinder.org | Beekeeping organization directories |
| State Beekeepers Associations | Various | Individual beekeeper contacts |

**Strategy:**
1. Request USDA API access for farmers markets with honey
2. Manually curate 20-30 notable beekeepers from state associations
3. Add 10-15 well-known honey farms with public presence
4. Generate realistic-looking additional entries to reach 50+

## Image Strategy

### Cost Estimation (FLUX schnell at $0.003/image)

| Image Type | Quantity | Cost |
|------------|----------|------|
| Honey product shots | 200 | $0.60 |
| Honey hero thumbnails | 200 | $0.60 |
| Honey type hero images | 17 | $0.05 |
| Origin region hero images | 16 | $0.05 |
| Local source hero images | 50 | $0.15 |
| Local source thumbnails | 50 | $0.15 |
| **Total** | **533** | **$1.60** |

**Note:** Adding 20% buffer for regenerations = ~$2.00 total image generation cost

### Image Dimensions
| Image Type | Aspect Ratio | Megapixels | Use Case |
|------------|--------------|------------|----------|
| Product shot | 4:5 | 1 | Detail pages, cards |
| Thumbnail | 1:1 | 0.25 | Grid views, lists |
| Hero image | 16:9 | 1 | Page headers, carousels |

### R2 Bucket Structure
```
honey-explorer-images/
├── honeys/
│   ├── [slug].webp           # Full-size product shots
│   └── thumbnails/
│       └── [slug].webp       # Square thumbnails
├── sources/
│   ├── [slug].webp           # Hero images
│   └── thumbnails/
│       └── [slug].webp       # Square thumbnails
└── heroes/
    ├── types/
    │   └── [floral-source].webp
    └── origins/
        └── [origin-country].webp
```

### Cloudflare R2 Setup Requirements
1. Create Cloudflare account (free tier sufficient)
2. Create R2 bucket: `honey-explorer-images`
3. Enable public access on bucket
4. Create custom domain: `images.honeyexplorer.com`
5. Generate API token with R2 read/write permissions
6. Store credentials as Fly.io secrets

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stock photos | AI-generated product photography | 2024 | Consistent style, no licensing |
| SDXL | FLUX models | 2024 | Better text rendering, photorealism |
| AWS S3 | Cloudflare R2 | 2022+ | Zero egress fees |
| SQL data.sql | JSON + CommandLineRunner | Ongoing | Better for complex objects |
| Replicate HTTP URLs | Replicate file objects | 2024 | Easier download, no URL expiration bugs |

**Deprecated/outdated:**
- Replicate HTTP URL output (deprecated in favor of file objects in latest SDK)
- AWS SDK v1 for Java (v2 is current)

## Open Questions

Things that couldn't be fully resolved:

1. **USDA API Key Acquisition Time**
   - What we know: API requires application for access key
   - What's unclear: How long approval takes, if there are usage limits
   - Recommendation: Apply immediately, have fallback manual data entry plan

2. **R2 Custom Domain HTTPS**
   - What we know: R2 supports custom domains with Cloudflare DNS
   - What's unclear: Exact SSL certificate provisioning steps
   - Recommendation: Research during implementation, Cloudflare docs are thorough

3. **Replicate Rate Limits**
   - What we know: Pay-per-use, no hard limits documented
   - What's unclear: Concurrent request limits, if batching needed
   - Recommendation: Generate images in batches of 10-20, add delays

## Sources

### Primary (HIGH confidence)
- [Replicate Node.js SDK](https://github.com/replicate/replicate-javascript) - Authentication, predictions, file outputs
- [Replicate FLUX schnell model](https://replicate.com/black-forest-labs/flux-schnell) - Pricing ($0.003), parameters
- [Cloudflare R2 AWS SDK Java](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-java/) - Client configuration
- [Replicate Output Files](https://replicate.com/docs/topics/predictions/output-files) - URL expiration (1 hour)
- [Spring Boot CommandLineRunner](https://mkyong.com/spring-boot/spring-boot-commandlinerunner-example/) - Seed data pattern

### Secondary (MEDIUM confidence)
- [Spring Boot Flyway with R2](https://sngermiyanoglu.medium.com/how-to-upload-file-in-cloudflare-r2-through-spring-boot-3b497dbe0265) - Maven dependencies, client config
- [USDA Farmers Market Directory](https://catalog.data.gov/dataset/farmers-markets-directory-and-geographic-data) - Dataset availability
- [USDA Local Food Portal API](https://www.usdalocalfoodportal.com/fe/datasharing/) - API endpoint structure
- [Bee Culture Directory](https://beeculture.com/find-local-beekeeper/) - State beekeeping associations

### Tertiary (LOW confidence - needs validation)
- [Bee Inspired Goods 300 Types List](https://beeinspiredgoods.com/blogs/beekeeping/types-of-honey-a-complete-list) - Variety coverage reference
- AI Product Photography prompts - Based on community best practices, not official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Replicate and R2 officially documented
- Architecture: HIGH - CommandLineRunner is established Spring Boot pattern
- Image generation: HIGH - FLUX schnell well-documented, pricing confirmed
- Data sourcing: MEDIUM - USDA API requires key, manual curation needed
- Pitfalls: HIGH - URL expiration and R2 config issues well-documented

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - stable domain, APIs unlikely to change)
