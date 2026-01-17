# Honey Explorer

## What This Is

A discovery platform for honey enthusiasts to explore and find honey by geographic origin, flavor profile, and health benefits. Includes AI-powered recommendations, a local finder for beekeepers and farmers markets, educational content, and user reviews. Automated daily jobs keep data fresh and generate new content.

## Core Value

Users can discover and learn about honey varieties from around the world and find local sources near them.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Browse and filter honey by geographic origin (country/region terroir)
- [ ] Browse and filter honey by flavor profile (floral, earthy, bold, fruity)
- [ ] Browse and filter honey by type/health benefits (raw, Manuka, medicinal, local for allergies)
- [ ] View detailed honey product pages with descriptions, origin, flavor notes
- [ ] AI recommendations: "Describe what you like" → personalized honey suggestions
- [ ] Local finder: search for beekeepers, apiaries, farmers markets by city
- [ ] AI-generated educational articles (health benefits, pairings, honey guides)
- [ ] User reviews and ratings for honey products
- [ ] Daily automated job: scrape new honey products from retailers
- [ ] Daily automated job: update farmers market schedules/locations
- [ ] Daily automated job: validate existing data (dead links, availability)
- [ ] Daily automated job: auto-generate content about new discoveries

### Out of Scope

- E-commerce/direct sales — affiliate model only, not selling honey directly
- Mobile app — web-first
- Monetization features — deferred to later versions
- User accounts for basic browsing — discovery should work without login
- Real-time chat/community features — focus on discovery first

## Context

**Inspiration:** Cigar Explorer (cigar-explorer.fly.dev) — proven model for discovery + affiliate + local finder in a niche hobby space.

**Why honey:**
- Low competition in discovery space (most honey sites are just stores)
- Geographic terroir angle (like wine)
- Health benefits angle drives search traffic
- "Honey near me" / local producer interest
- Interesting product with passionate hobbyists and health-conscious consumers

**Data strategy:**
- Start with curated seed data (manual entry of quality honey products)
- API integrations where available (farmers market APIs, food databases)
- Grow catalog via automated scraping of honey retailers
- Daily validation to keep data fresh

**SEO opportunities:**
- "Best [type] honey" (Manuka, clover, wildflower, buckwheat)
- "Honey from [region]" (New Zealand, Hungary, local states)
- "[Type] honey benefits" (health-focused searches)
- "Honey near me" / "local honey [city]"
- "Honey for [use]" (allergies, cooking, tea)

## Constraints

- **Tech stack**: Similar to cigar-explorer (React frontend, Java/Spring backend) unless research suggests better alternatives
- **Hosting**: Fly.io for deployment consistency
- **AI Text**: Groq API for fast recommendations, Claude/OpenAI for content generation
- **AI Images**: Replicate API (FLUX/SDXL) for high-quality product photography and hero images
- **Budget**: Minimize ongoing costs — prefer scraping over paid APIs where legal/ethical

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full stack v1 (not MVP) | User wants discovery + local + automation from day 1 | — Pending |
| Cigar-explorer as template | Proven model, reuse patterns | — Pending |
| Daily automation jobs | Keep data fresh, generate content, competitive advantage | — Pending |
| User reviews included | "As much content as possible" — UGC helps SEO | — Pending |

---
*Last updated: 2026-01-17 after initialization*
