/**
 * Weekly Event Discovery Script
 *
 * Uses Claude AI + web search to discover honey/beekeeping events,
 * adds them to the PostgreSQL database, and sends an email report.
 *
 * Security measures:
 * - No public endpoints (runs via GitHub Actions only)
 * - All secrets stored in GitHub Secrets
 * - Input validation on all AI-generated data
 * - Parameterized SQL queries
 * - HTTPS-only event links
 * - Allowlisted email recipient
 */

import Anthropic from '@anthropic-ai/sdk';
import pg from 'pg';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuration
const RECIPIENT_EMAIL = 'samfrench@gmail.com'; // Allowlisted recipient only
const SENDER_EMAIL = 'sam@mycoffeeexplorer.com'; // Gmail/Google Workspace sender
const MAX_EVENTS_PER_QUERY = 10;
const SEARCH_DELAY_MS = 2000; // Rate limiting between searches

// Valid enum values (must match backend)
const VALID_EVENT_TYPES = new Set(['FESTIVAL', 'MARKET', 'CLASS', 'TASTING', 'TOUR', 'FAIR', 'EXPO', 'CONFERENCE']);

const US_STATES = new Set([
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia'
]);

// Search queries for different event types
const SEARCH_QUERIES = [
  'honey festival 2026 United States upcoming event',
  'beekeeping workshop class 2026 USA apiary',
  'honey tasting event 2026 United States',
  'beekeeper tour apiary visit 2026 USA',
  'honey farmers market fair 2026 United States'
];

/**
 * Generate URL-safe slug from event name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Escape HTML entities for email content
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate a single event object
 * Returns { valid: boolean, errors: string[], event: object }
 */
function validateEvent(event) {
  const errors = [];

  // Name: required, max 255 chars
  if (!event.name || typeof event.name !== 'string') {
    errors.push('Missing or invalid name');
  } else if (event.name.length > 255) {
    event.name = event.name.substring(0, 252) + '...';
  }

  // EventType: must be valid enum
  if (!event.eventType || !VALID_EVENT_TYPES.has(event.eventType)) {
    errors.push(`Invalid eventType: ${event.eventType}`);
  }

  // StartDate: required, must be valid date in future
  if (!event.startDate) {
    errors.push('Missing startDate');
  } else {
    const startDate = new Date(event.startDate);
    if (isNaN(startDate.getTime())) {
      errors.push('Invalid startDate format');
    } else if (startDate < new Date()) {
      errors.push('Event has already started');
    }
  }

  // EndDate: optional but must be valid if present
  if (event.endDate) {
    const endDate = new Date(event.endDate);
    if (isNaN(endDate.getTime())) {
      event.endDate = null; // Clear invalid end date
    }
  }

  // Address: required
  if (!event.address || typeof event.address !== 'string') {
    errors.push('Missing address');
  } else if (event.address.length > 255) {
    event.address = event.address.substring(0, 252) + '...';
  }

  // City: optional but validate length
  if (event.city && event.city.length > 100) {
    event.city = event.city.substring(0, 97) + '...';
  }

  // State: must be valid US state if present
  if (event.state && !US_STATES.has(event.state)) {
    // Try to match partial state names
    const matchedState = [...US_STATES].find(s =>
      s.toLowerCase() === event.state.toLowerCase() ||
      s.toLowerCase().includes(event.state.toLowerCase())
    );
    if (matchedState) {
      event.state = matchedState;
    } else {
      errors.push(`Invalid state: ${event.state}`);
    }
  }

  // Link: must be valid HTTPS URL if present
  if (event.link) {
    try {
      const url = new URL(event.link);
      if (url.protocol !== 'https:') {
        errors.push('Link must be HTTPS');
      }
    } catch {
      errors.push('Invalid link URL');
    }
  }

  // Description: sanitize and truncate
  if (event.description) {
    if (event.description.length > 2000) {
      event.description = event.description.substring(0, 1997) + '...';
    }
  }

  return { valid: errors.length === 0, errors, event };
}

/**
 * Parse events from Claude's response
 */
function parseEventsFromResponse(response) {
  const events = [];

  for (const block of response.content) {
    if (block.type === 'text') {
      // Try to extract JSON from the text
      const text = block.text;

      // Look for JSON array in the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed)) {
            events.push(...parsed);
          }
        } catch (e) {
          console.error('Failed to parse JSON from response:', e.message);
        }
      }
    }
  }

  return events;
}

/**
 * Use Claude with web search to discover events
 */
async function discoverEvents(anthropic, searchQuery) {
  console.log(`Searching: "${searchQuery}"`);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4096,
    tools: [{
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 5
    }],
    messages: [{
      role: 'user',
      content: `Search for honey and beekeeping events matching: "${searchQuery}"

Return ONLY a JSON array of events found. Each event must have these exact fields:
{
  "name": "Event Name",
  "description": "Brief description (max 500 chars)",
  "eventType": "FESTIVAL|MARKET|CLASS|TASTING|TOUR|FAIR|EXPO|CONFERENCE",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD or null if single day",
  "address": "Full street address or venue name",
  "city": "City name",
  "state": "Full US state name (e.g., 'California' not 'CA')",
  "link": "https://event-official-website.com"
}

Only include events that:
- Are in the United States
- Start after today (${new Date().toISOString().split('T')[0]})
- Are specifically about honey, beekeeping, or apiaries
- Have verifiable information from official sources

Return up to ${MAX_EVENTS_PER_QUERY} events maximum. If no events found, return an empty array [].
Only return the JSON array, no other text.`
    }]
  });

  return parseEventsFromResponse(response);
}

/**
 * Check if an event already exists in the database
 */
async function isDuplicate(client, event) {
  const slug = generateSlug(event.name);

  // Check by slug
  const slugResult = await client.query(
    'SELECT id FROM events WHERE slug = $1',
    [slug]
  );
  if (slugResult.rows.length > 0) return true;

  // Check by similar name and date
  const similarResult = await client.query(
    'SELECT id FROM events WHERE LOWER(name) = LOWER($1) AND start_date = $2',
    [event.name, event.startDate]
  );
  if (similarResult.rows.length > 0) return true;

  // Check by same link
  if (event.link) {
    const linkResult = await client.query(
      'SELECT id FROM events WHERE link = $1',
      [event.link]
    );
    if (linkResult.rows.length > 0) return true;
  }

  return false;
}

/**
 * Insert a new event into the database
 */
async function insertEvent(client, event) {
  const id = crypto.randomUUID();
  const slug = generateSlug(event.name);
  const now = new Date().toISOString();

  await client.query(`
    INSERT INTO events (
      id, name, description, event_type,
      start_date, end_date, address, city, state,
      latitude, longitude, image_url, thumbnail_url,
      link, slug, is_active, created_at, updated_at,
      last_verified_at, verification_source, is_verified
    ) VALUES (
      $1, $2, $3, $4,
      $5, $6, $7, $8, $9,
      $10, $11, $12, $13,
      $14, $15, $16, $17, $18,
      $19, $20, $21
    )
  `, [
    id, event.name, event.description || null, event.eventType,
    event.startDate, event.endDate || null, event.address, event.city || null, event.state || null,
    null, null, null, null, // No coordinates or images initially
    event.link || null, slug, true, now, now,
    now, 'AI Discovery (Claude)', false // Not verified until human review
  ]);

  return { id, slug };
}

/**
 * Generate HTML email report
 */
function generateEmailReport(newEvents, skippedDuplicates, validationErrors, systemErrors) {
  const totalErrors = validationErrors.length + systemErrors.length;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1c1917; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #b45309; margin-bottom: 8px; }
    h2 { color: #78350f; margin-top: 24px; }
    .subtitle { color: #78716c; margin-bottom: 20px; }
    .event-card {
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
      background: #fffbeb;
    }
    .event-name { font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 4px; }
    .event-type {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .event-meta { color: #78716c; font-size: 14px; margin: 8px 0; }
    .event-link {
      display: inline-block;
      color: #b45309;
      text-decoration: none;
      margin-top: 8px;
      font-weight: 500;
    }
    .event-link:hover { text-decoration: underline; }
    .stats {
      background: #f5f5f4;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .stat-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .stat-label { color: #78716c; }
    .stat-value { font-weight: 600; }
    .stat-value.success { color: #16a34a; }
    .stat-value.warning { color: #ca8a04; }
    .stat-value.error { color: #dc2626; }
    .error-item {
      background: #fef2f2;
      border-left: 3px solid #dc2626;
      padding: 8px 12px;
      margin: 8px 0;
      font-size: 14px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e7e5e4;
      color: #a8a29e;
      font-size: 12px;
    }
    .no-events {
      text-align: center;
      padding: 32px;
      color: #78716c;
      background: #fafaf9;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Raw Honey Guide Event Discovery</h1>
    <p class="subtitle">Weekly Report - ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

    <div class="stats">
      <div class="stat-row">
        <span class="stat-label">New events added</span>
        <span class="stat-value ${newEvents.length > 0 ? 'success' : ''}">${newEvents.length}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Duplicates skipped</span>
        <span class="stat-value ${skippedDuplicates > 0 ? 'warning' : ''}">${skippedDuplicates}</span>
      </div>
      <div class="stat-row">
        <span class="stat-label">Validation errors</span>
        <span class="stat-value ${validationErrors.length > 0 ? 'error' : ''}">${validationErrors.length}</span>
      </div>
      ${systemErrors.length > 0 ? `
      <div class="stat-row">
        <span class="stat-label">System errors</span>
        <span class="stat-value error">${systemErrors.length}</span>
      </div>
      ` : ''}
    </div>

    <h2>New Events</h2>
    ${newEvents.length === 0 ? `
      <div class="no-events">No new events discovered this week.</div>
    ` : newEvents.map(event => `
      <div class="event-card">
        <div class="event-name">${escapeHtml(event.name)}</div>
        <span class="event-type">${escapeHtml(event.eventType)}</span>
        <div class="event-meta">
          <strong>${escapeHtml(event.city || '')}${event.city && event.state ? ', ' : ''}${escapeHtml(event.state || '')}</strong><br>
          ${escapeHtml(event.startDate)}${event.endDate ? ` - ${escapeHtml(event.endDate)}` : ''}
        </div>
        <p style="margin: 8px 0;">${escapeHtml(event.description || 'No description available.')}</p>
        ${event.link ? `<a href="${escapeHtml(event.link)}" class="event-link">View Event Details &rarr;</a>` : ''}
      </div>
    `).join('')}

    ${validationErrors.length > 0 ? `
      <h2>Validation Errors</h2>
      ${validationErrors.map(err => `<div class="error-item">${escapeHtml(err)}</div>`).join('')}
    ` : ''}

    ${systemErrors.length > 0 ? `
      <h2>System Errors</h2>
      ${systemErrors.map(err => `<div class="error-item">${escapeHtml(err)}</div>`).join('')}
    ` : ''}

    <div class="footer">
      <p>This is an automated report from Raw Honey Guide event discovery.</p>
      <p>Events added via AI discovery require manual verification before being marked as verified.</p>
      <p>View all events: <a href="https://rawhoneyguide.com/events">rawhoneyguide.com/events</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send email report via Gmail SMTP
 */
async function sendReport(transporter, html, newCount, errorCount) {
  const subject = errorCount > 0
    ? `[Raw Honey Guide] Event Discovery: ${newCount} new, ${errorCount} errors`
    : newCount > 0
      ? `[Raw Honey Guide] Event Discovery: ${newCount} new events found`
      : `[Raw Honey Guide] Event Discovery: No new events this week`;

  await transporter.sendMail({
    from: `Raw Honey Guide <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject,
    html
  });

  console.log(`Email sent to ${RECIPIENT_EMAIL}`);
}

/**
 * Create Gmail SMTP transporter
 */
function createMailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('Starting event discovery...');
  console.log(`Date: ${new Date().toISOString()}`);

  const systemErrors = [];
  const validationErrors = [];
  const newEvents = [];
  let skippedDuplicates = 0;
  let client;

  try {
    // Validate environment
    const requiredEnv = ['ANTHROPIC_API_KEY', 'DATABASE_URL', 'GMAIL_APP_PASSWORD'];
    for (const key of requiredEnv) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    // Initialize clients
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const mailTransporter = createMailTransporter();

    // Connect to database
    client = new pg.Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
    await client.connect();
    console.log('Connected to database');

    // Run search queries
    const allDiscoveredEvents = [];

    for (const query of SEARCH_QUERIES) {
      try {
        const events = await discoverEvents(anthropic, query);
        console.log(`  Found ${events.length} potential events`);
        allDiscoveredEvents.push(...events);

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY_MS));
      } catch (error) {
        console.error(`  Error searching "${query}":`, error.message);
        systemErrors.push(`Search error for "${query}": ${error.message}`);
      }
    }

    console.log(`Total discovered: ${allDiscoveredEvents.length} events`);

    // Process each event
    for (const rawEvent of allDiscoveredEvents) {
      try {
        // Validate
        const { valid, errors, event } = validateEvent(rawEvent);

        if (!valid) {
          validationErrors.push(`${rawEvent.name || 'Unknown'}: ${errors.join(', ')}`);
          continue;
        }

        // Check for duplicates
        if (await isDuplicate(client, event)) {
          console.log(`  Skipping duplicate: ${event.name}`);
          skippedDuplicates++;
          continue;
        }

        // Insert new event
        const { id, slug } = await insertEvent(client, event);
        console.log(`  Added: ${event.name} (${slug})`);
        newEvents.push(event);

      } catch (error) {
        console.error(`  Error processing event:`, error.message);
        systemErrors.push(`Processing error: ${error.message}`);
      }
    }

    console.log(`\nResults: ${newEvents.length} new, ${skippedDuplicates} duplicates, ${validationErrors.length} invalid`);

    // Generate and send report
    const html = generateEmailReport(newEvents, skippedDuplicates, validationErrors, systemErrors);
    await sendReport(mailTransporter, html, newEvents.length, validationErrors.length + systemErrors.length);

    console.log('Event discovery completed successfully');

  } catch (error) {
    console.error('Fatal error:', error);
    systemErrors.push(`Fatal error: ${error.message}`);

    // Try to send error report
    try {
      const errorTransporter = createMailTransporter();
      const html = generateEmailReport([], 0, validationErrors, systemErrors);
      await sendReport(errorTransporter, html, 0, systemErrors.length);
    } catch (emailError) {
      console.error('Failed to send error report:', emailError.message);
    }

    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('Database connection closed');
    }
  }
}

// Run
main();
