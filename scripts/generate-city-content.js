/**
 * City Content Generation Script
 *
 * Uses Ollama (local LLM) to generate city-specific honey content,
 * then validates with Claude API for quality assurance.
 *
 * Workflow:
 * 1. Generate content with Ollama (fast, free)
 * 2. Validate with Claude (quality check, fact-check)
 * 3. Store validated content in PostgreSQL
 *
 * Run: node scripts/generate-city-content.js
 */

import Anthropic from '@anthropic-ai/sdk';
import pg from 'pg';
import crypto from 'crypto';

// Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3.2:latest';
const MIN_VALIDATION_SCORE = 7;

// Top 20 US cities for local SEO
const TARGET_CITIES = [
  { city: 'Austin', state: 'Texas', lat: 30.2672, lng: -97.7431 },
  { city: 'Houston', state: 'Texas', lat: 29.7604, lng: -95.3698 },
  { city: 'Dallas', state: 'Texas', lat: 32.7767, lng: -96.7970 },
  { city: 'San Antonio', state: 'Texas', lat: 29.4241, lng: -98.4936 },
  { city: 'Denver', state: 'Colorado', lat: 39.7392, lng: -104.9903 },
  { city: 'Phoenix', state: 'Arizona', lat: 33.4484, lng: -112.0740 },
  { city: 'Seattle', state: 'Washington', lat: 47.6062, lng: -122.3321 },
  { city: 'Portland', state: 'Oregon', lat: 45.5152, lng: -122.6784 },
  { city: 'San Francisco', state: 'California', lat: 37.7749, lng: -122.4194 },
  { city: 'Los Angeles', state: 'California', lat: 34.0522, lng: -118.2437 },
  { city: 'San Diego', state: 'California', lat: 32.7157, lng: -117.1611 },
  { city: 'Chicago', state: 'Illinois', lat: 41.8781, lng: -87.6298 },
  { city: 'Miami', state: 'Florida', lat: 25.7617, lng: -80.1918 },
  { city: 'Atlanta', state: 'Georgia', lat: 33.7490, lng: -84.3880 },
  { city: 'Nashville', state: 'Tennessee', lat: 36.1627, lng: -86.7816 },
  { city: 'Charlotte', state: 'North Carolina', lat: 35.2271, lng: -80.8431 },
  { city: 'Boston', state: 'Massachusetts', lat: 42.3601, lng: -71.0589 },
  { city: 'New York', state: 'New York', lat: 40.7128, lng: -74.0060 },
  { city: 'Philadelphia', state: 'Pennsylvania', lat: 39.9526, lng: -75.1652 },
  { city: 'Washington', state: 'District of Columbia', lat: 38.9072, lng: -77.0369 },
];

// Regional honey information for accurate content generation
const REGIONAL_HONEY_INFO = {
  'Texas': {
    commonHoneys: ['Mesquite', 'Wildflower', 'Huajillo', 'Tallow', 'Clover'],
    bestSeasons: 'Spring (March-May) and early fall (September-October)',
    climate: 'Hot summers, mild winters, diverse ecosystems from Hill Country to Gulf Coast',
  },
  'Colorado': {
    commonHoneys: ['Wildflower', 'Clover', 'Alfalfa', 'Buckwheat'],
    bestSeasons: 'Late summer (August-September) after mountain wildflower blooms',
    climate: 'High altitude, dry climate, short but intense flowering seasons',
  },
  'Arizona': {
    commonHoneys: ['Mesquite', 'Desert Wildflower', 'Catclaw', 'Palo Verde'],
    bestSeasons: 'Spring (March-May) after winter rains',
    climate: 'Desert climate with unique Sonoran Desert flora',
  },
  'Washington': {
    commonHoneys: ['Blackberry', 'Fireweed', 'Clover', 'Wildflower'],
    bestSeasons: 'Late summer (July-September)',
    climate: 'Maritime climate with lush vegetation in western regions',
  },
  'Oregon': {
    commonHoneys: ['Blackberry', 'Clover', 'Meadowfoam', 'Fireweed'],
    bestSeasons: 'Late summer (August-September)',
    climate: 'Varied from coastal rainforest to high desert',
  },
  'California': {
    commonHoneys: ['Orange Blossom', 'Sage', 'Avocado', 'Wildflower', 'Eucalyptus'],
    bestSeasons: 'Year-round availability, peak in spring and summer',
    climate: 'Mediterranean climate with diverse agricultural regions',
  },
  'Illinois': {
    commonHoneys: ['Clover', 'Wildflower', 'Basswood', 'Soybean'],
    bestSeasons: 'Late summer (August-September)',
    climate: 'Continental climate with hot summers',
  },
  'Florida': {
    commonHoneys: ['Orange Blossom', 'Palmetto', 'Mangrove', 'Tupelo', 'Wildflower'],
    bestSeasons: 'Spring (March-May) and fall (September-November)',
    climate: 'Subtropical climate with year-round flowering',
  },
  'Georgia': {
    commonHoneys: ['Tupelo', 'Sourwood', 'Wildflower', 'Cotton'],
    bestSeasons: 'Spring and early summer (April-June)',
    climate: 'Humid subtropical with diverse flora',
  },
  'Tennessee': {
    commonHoneys: ['Sourwood', 'Tulip Poplar', 'Clover', 'Wildflower'],
    bestSeasons: 'Early summer (May-July) for sourwood',
    climate: 'Humid subtropical with Appalachian mountain influence',
  },
  'North Carolina': {
    commonHoneys: ['Sourwood', 'Tulip Poplar', 'Wildflower', 'Gallberry'],
    bestSeasons: 'Summer (June-August) for prized sourwood',
    climate: 'Varied from coastal plains to Blue Ridge Mountains',
  },
  'Massachusetts': {
    commonHoneys: ['Wildflower', 'Clover', 'Blueberry', 'Cranberry'],
    bestSeasons: 'Late summer (August-September)',
    climate: 'Continental climate with distinct seasons',
  },
  'New York': {
    commonHoneys: ['Wildflower', 'Clover', 'Buckwheat', 'Basswood', 'Apple Blossom'],
    bestSeasons: 'Late summer to early fall (August-October)',
    climate: 'Varied from coastal to upstate continental',
  },
  'Pennsylvania': {
    commonHoneys: ['Wildflower', 'Clover', 'Buckwheat', 'Black Locust'],
    bestSeasons: 'Summer (June-August)',
    climate: 'Humid continental with rich agricultural regions',
  },
  'District of Columbia': {
    commonHoneys: ['Wildflower', 'Clover', 'Tulip Poplar'],
    bestSeasons: 'Summer (June-August)',
    climate: 'Humid subtropical, urban beekeeping popular',
  },
};

/**
 * Generate content using Ollama
 */
async function generateWithOllama(city, state) {
  const regionalInfo = REGIONAL_HONEY_INFO[state] || {
    commonHoneys: ['Wildflower', 'Clover'],
    bestSeasons: 'Late summer',
    climate: 'Varied',
  };

  const prompt = `You are a honey expert writing content for a local honey guide website. Write unique, accurate content about finding and buying local honey in ${city}, ${state}.

Regional context:
- Common honey varieties in ${state}: ${regionalInfo.commonHoneys.join(', ')}
- Best seasons to buy: ${regionalInfo.bestSeasons}
- Climate: ${regionalInfo.climate}

Write the following sections (each as a separate paragraph, marked with headers):

## Introduction
Write 2-3 sentences introducing ${city} as a place to find local honey. Mention specific local characteristics that make it interesting for honey buyers.

## Honey Facts
Write 2-3 sentences about the types of honey available in the ${city}/${state} region. Be specific about local flora and what makes regional honey unique.

## Buying Tips
Write 2-3 practical tips for buying authentic local honey in ${city}. Include advice about finding real local producers.

## Best Seasons
Write 1-2 sentences about the best time of year to buy local honey in ${city}, ${state}.

## FAQ
Provide exactly 3 FAQ items in this format:
Q: [Question about buying honey in ${city}]
A: [Answer]

Requirements:
- Be specific to ${city} and ${state} - no generic content
- Don't make up specific business names
- Don't include unverifiable statistics
- Focus on helpful, actionable information
- Keep each section concise but informative`;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error generating content for ${city}, ${state}:`, error.message);
    throw error;
  }
}

/**
 * Parse generated content into structured sections
 */
function parseGeneratedContent(content) {
  const sections = {
    introText: '',
    honeyFacts: '',
    buyingTips: '',
    bestSeasons: '',
    faqJson: '[]',
  };

  // Extract sections using headers
  const introMatch = content.match(/## Introduction\s*([\s\S]*?)(?=##|$)/i);
  const factsMatch = content.match(/## Honey Facts\s*([\s\S]*?)(?=##|$)/i);
  const tipsMatch = content.match(/## Buying Tips\s*([\s\S]*?)(?=##|$)/i);
  const seasonsMatch = content.match(/## Best Seasons\s*([\s\S]*?)(?=##|$)/i);
  const faqMatch = content.match(/## FAQ\s*([\s\S]*?)$/i);

  if (introMatch) sections.introText = introMatch[1].trim();
  if (factsMatch) sections.honeyFacts = factsMatch[1].trim();
  if (tipsMatch) sections.buyingTips = tipsMatch[1].trim();
  if (seasonsMatch) sections.bestSeasons = seasonsMatch[1].trim();

  // Parse FAQ section
  if (faqMatch) {
    const faqContent = faqMatch[1];
    const faqs = [];
    const qaPairs = faqContent.match(/Q:\s*(.*?)\s*A:\s*(.*?)(?=Q:|$)/gs);

    if (qaPairs) {
      for (const pair of qaPairs) {
        const qMatch = pair.match(/Q:\s*(.*?)(?=\s*A:)/s);
        const aMatch = pair.match(/A:\s*(.*)/s);
        if (qMatch && aMatch) {
          faqs.push({
            question: qMatch[1].trim(),
            answer: aMatch[1].trim(),
          });
        }
      }
    }
    sections.faqJson = JSON.stringify(faqs);
  }

  return sections;
}

/**
 * Validate content using Claude API
 */
async function validateWithClaude(city, state, content) {
  const anthropic = new Anthropic();
  const regionalInfo = REGIONAL_HONEY_INFO[state] || { commonHoneys: [] };

  const validationPrompt = `Review this city honey guide for ${city}, ${state}:

Introduction:
${content.introText}

Honey Facts:
${content.honeyFacts}

Buying Tips:
${content.buyingTips}

Best Seasons:
${content.bestSeasons}

FAQ:
${content.faqJson}

Regional context for validation:
- Common honeys in ${state}: ${regionalInfo.commonHoneys?.join(', ') || 'Various'}
- Climate: ${regionalInfo.climate || 'Varied'}

Evaluate on these criteria (1-10 each):
1. Factual accuracy - Are claims verifiable? Is the information about honey types accurate for this region?
2. Regional accuracy - Does flora/climate information match the actual region?
3. Uniqueness - Is this specific to ${city}, not generic boilerplate?
4. Usefulness - Would a honey buyer find this helpful?
5. No hallucinations - Are there any made-up business names or unverifiable statistics?

Return ONLY a JSON object (no markdown, no explanation):
{"scores":{"accuracy":X,"regional":X,"uniqueness":X,"usefulness":X,"no_hallucinations":X},"overall":X,"issues":["issue1","issue2"],"approved":true/false}

The overall score should be the average. Set approved to true only if overall >= 7.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: validationPrompt,
        },
      ],
    });

    const responseText = response.content[0].text.trim();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not parse validation response, defaulting to manual review');
      return { overall: 5, approved: false, issues: ['Could not parse validation response'] };
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Error validating content for ${city}, ${state}:`, error.message);
    return { overall: 0, approved: false, issues: [error.message] };
  }
}

/**
 * Generate slug from city and state
 */
function generateSlug(city, state) {
  const stateAbbrev = {
    'Texas': 'tx', 'Colorado': 'co', 'Arizona': 'az', 'Washington': 'wa',
    'Oregon': 'or', 'California': 'ca', 'Illinois': 'il', 'Florida': 'fl',
    'Georgia': 'ga', 'Tennessee': 'tn', 'North Carolina': 'nc',
    'Massachusetts': 'ma', 'New York': 'ny', 'Pennsylvania': 'pa',
    'District of Columbia': 'dc',
  };

  const abbrev = stateAbbrev[state] || state.toLowerCase().replace(/\s+/g, '-');
  return `${city.toLowerCase().replace(/\s+/g, '-')}-${abbrev}`;
}

/**
 * Save city content to database
 */
async function saveCityContent(client, cityData, content, validation) {
  const slug = generateSlug(cityData.city, cityData.state);

  // Check if exists
  const existing = await client.query(
    'SELECT id FROM city_content WHERE slug = $1',
    [slug]
  );

  const query = existing.rows.length > 0
    ? `UPDATE city_content SET
        intro_text = $1, honey_facts = $2, buying_tips = $3, best_seasons = $4,
        faq_json = $5, validated = $6, validation_score = $7, updated_at = NOW()
       WHERE slug = $8`
    : `INSERT INTO city_content
        (city, state, slug, latitude, longitude, intro_text, honey_facts, buying_tips,
         best_seasons, faq_json, validated, validation_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

  const params = existing.rows.length > 0
    ? [
        content.introText, content.honeyFacts, content.buyingTips, content.bestSeasons,
        content.faqJson, validation.approved, Math.round(validation.overall), slug
      ]
    : [
        cityData.city, cityData.state, slug, cityData.lat, cityData.lng,
        content.introText, content.honeyFacts, content.buyingTips, content.bestSeasons,
        content.faqJson, validation.approved, Math.round(validation.overall)
      ];

  await client.query(query, params);
  return { slug, isNew: existing.rows.length === 0 };
}

/**
 * Main execution
 */
async function main() {
  console.log('Starting city content generation...\n');

  // Connect to database
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to database\n');

  const results = {
    generated: 0,
    validated: 0,
    failed: 0,
    cities: [],
  };

  for (const cityData of TARGET_CITIES) {
    console.log(`\n--- Processing ${cityData.city}, ${cityData.state} ---`);

    try {
      // Check if already validated
      const existing = await client.query(
        'SELECT validated, validation_score FROM city_content WHERE slug = $1',
        [generateSlug(cityData.city, cityData.state)]
      );

      if (existing.rows.length > 0 && existing.rows[0].validated && existing.rows[0].validation_score >= MIN_VALIDATION_SCORE) {
        console.log(`  Skipping - already validated with score ${existing.rows[0].validation_score}`);
        continue;
      }

      // Generate content with Ollama
      console.log('  Generating content with Ollama...');
      const rawContent = await generateWithOllama(cityData.city, cityData.state);
      results.generated++;

      // Parse content
      console.log('  Parsing generated content...');
      const parsedContent = parseGeneratedContent(rawContent);

      // Validate with Claude
      console.log('  Validating with Claude...');
      const validation = await validateWithClaude(cityData.city, cityData.state, parsedContent);

      console.log(`  Validation score: ${validation.overall?.toFixed(1) || 'N/A'}`);
      if (validation.issues?.length > 0) {
        console.log(`  Issues: ${validation.issues.join(', ')}`);
      }

      // Save to database
      console.log('  Saving to database...');
      const { slug, isNew } = await saveCityContent(client, cityData, parsedContent, validation);

      if (validation.approved) {
        results.validated++;
        console.log(`  ✓ ${isNew ? 'Created' : 'Updated'} and validated: /honey-near/${slug}`);
      } else {
        console.log(`  ⚠ Saved but needs review: /honey-near/${slug}`);
      }

      results.cities.push({
        city: cityData.city,
        state: cityData.state,
        slug,
        score: validation.overall,
        approved: validation.approved,
      });

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      results.failed++;
    }
  }

  await client.end();

  // Print summary
  console.log('\n========== SUMMARY ==========');
  console.log(`Generated: ${results.generated}`);
  console.log(`Validated: ${results.validated}`);
  console.log(`Failed: ${results.failed}`);
  console.log('\nCity Results:');
  for (const city of results.cities) {
    const status = city.approved ? '✓' : '⚠';
    console.log(`  ${status} ${city.city}, ${city.state}: score ${city.score?.toFixed(1) || 'N/A'}`);
  }
}

main().catch(console.error);
