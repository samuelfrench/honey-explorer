import 'dotenv/config';
import { fal } from '@fal-ai/client';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration - using fal.ai (faster, no zombie prediction issues)
const CONFIG = {
  model: 'fal-ai/flux/schnell',
  delayBetweenRequests: 1000, // ms - fal.ai has better rate limits
  maxRetries: 3,
  retryDelay: 5000, // ms
};

// Initialize fal.ai client
fal.config({
  credentials: process.env.FAL_KEY,
});

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Prompt templates
const prompts = {
  honeyProduct: (name, floralSource, origin) => {
    const floral = floralSource.toLowerCase().replace(/_/g, ' ');
    const originName = origin.replace(/_/g, ' ');
    return `Professional product photography of a glass honey jar filled with golden ${floral} honey from ${originName}, elegant label, natural wood honey dipper resting on side, soft diffused studio lighting, warm amber tones, pure white seamless background, 85mm lens, commercial quality, photorealistic, 8k resolution`;
  },

  localSource: (name, sourceType) => {
    const descriptions = {
      BEEKEEPER: 'rustic apiary with white beehive boxes in meadow setting',
      FARM: 'pastoral honey farm with production building and bee gardens',
      FARMERS_MARKET: 'vibrant farmers market booth with honey jars display',
      STORE: 'artisanal honey shop storefront with warm lighting',
      APIARY: 'professional apiary with multiple hive colonies',
      COOPERATIVE: 'beekeeping cooperative facility with signage',
    };
    return `Professional photography of a ${descriptions[sourceType] || descriptions.BEEKEEPER}, warm natural sunlight, inviting rural atmosphere, commercial quality, 8k`;
  },

  heroFloralSource: (floralSource) => {
    const floral = floralSource.toLowerCase().replace(/_/g, ' ');
    return `Editorial hero image of ${floral} honey flowing from wooden dipper into glass jar, dramatic golden light, visible texture and viscosity, honeycomb in soft focus background, warm color palette, magazine quality, 8k`;
  },

  heroOriginRegion: (origin) => {
    const regionDescriptions = {
      USA: 'American countryside with rolling hills and wildflower meadows',
      NEW_ZEALAND: 'New Zealand countryside with native manuka trees and green hills',
      AUSTRALIA: 'Australian outback with eucalyptus trees and golden light',
      ARGENTINA: 'Argentine pampas with wild grasslands and distant mountains',
      MEXICO: 'Mexican highland landscape with agave and flowering desert plants',
      CANADA: 'Canadian prairie with clover fields and blue sky',
      BRAZIL: 'Brazilian tropical forest edge with flowering trees',
      GREECE: 'Greek hillside with thyme and oregano flowers overlooking the sea',
      TURKEY: 'Turkish mountain meadow with pine forests and wildflowers',
      SPAIN: 'Spanish countryside with orange groves and lavender fields',
      FRANCE: 'French Provence landscape with lavender and sunflowers',
      ITALY: 'Italian Tuscan hills with chestnut and acacia trees',
      HUNGARY: 'Hungarian plains with acacia tree groves in bloom',
      GERMANY: 'German forest edge with linden trees and meadow flowers',
      UK: 'Scottish highlands with heather-covered moorland',
      OTHER: 'Idyllic pastoral beekeeping scene with diverse flowering plants',
    };
    return `Editorial hero image of artisanal honey production in ${regionDescriptions[origin] || regionDescriptions.OTHER}, traditional wooden beehives visible, golden sunset lighting, warm color palette, travel magazine quality, 8k`;
  },
};

// Floral sources and origins from enums
const FLORAL_SOURCES = [
  'CLOVER', 'WILDFLOWER', 'MANUKA', 'ORANGE_BLOSSOM', 'BUCKWHEAT',
  'ACACIA', 'LAVENDER', 'TUPELO', 'SAGE', 'SOURWOOD',
  'EUCALYPTUS', 'BLUEBERRY', 'AVOCADO', 'LINDEN', 'CHESTNUT',
  'HEATHER', 'OTHER'
];

const HONEY_ORIGINS = [
  'USA', 'NEW_ZEALAND', 'AUSTRALIA', 'ARGENTINA', 'MEXICO',
  'CANADA', 'BRAZIL', 'GREECE', 'TURKEY', 'SPAIN',
  'FRANCE', 'ITALY', 'HUNGARY', 'GERMANY', 'UK', 'OTHER'
];

// Utility functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkImageExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

// Map aspect ratios to fal.ai image_size values
function getImageSize(aspectRatio) {
  const sizeMap = {
    '4:5': 'portrait_4_3',   // closest to 4:5
    '16:9': 'landscape_16_9',
    '1:1': 'square',
  };
  return sizeMap[aspectRatio] || 'square';
}

async function generateImage(prompt, aspectRatio = '4:5') {
  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      const result = await fal.subscribe(CONFIG.model, {
        input: {
          prompt,
          image_size: getImageSize(aspectRatio),
          num_inference_steps: 4,
          num_images: 1,
          enable_safety_checker: false,
        },
      });

      if (result.data?.images?.length > 0) {
        const imageUrl = result.data.images[0].url;
        // Download the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.status}`);
        }
        return Buffer.from(await response.arrayBuffer());
      }

      throw new Error('No image in response');
    } catch (error) {
      console.error(`  Attempt ${attempt}/${CONFIG.maxRetries} failed: ${error.message}`);
      if (attempt < CONFIG.maxRetries) {
        await sleep(CONFIG.retryDelay * attempt);
      } else {
        throw error;
      }
    }
  }
}

async function uploadToR2(buffer, key) {
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/webp',
  }));
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

// Main workflow
async function main() {
  console.log('=== Honey Explorer Image Generation (fal.ai) ===\n');

  // Validate environment
  const requiredEnvVars = ['FAL_KEY', 'R2_ACCOUNT_ID', 'R2_ACCESS_KEY', 'R2_SECRET_KEY', 'R2_BUCKET_NAME', 'R2_PUBLIC_URL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      process.exit(1);
    }
  }

  // Load seed data
  const honeysPath = join(__dirname, '../backend/src/main/resources/seed-data/honeys.json');
  const sourcesPath = join(__dirname, '../backend/src/main/resources/seed-data/local-sources.json');

  const honeys = JSON.parse(await readFile(honeysPath, 'utf-8'));
  const sources = JSON.parse(await readFile(sourcesPath, 'utf-8'));

  console.log(`Loaded ${honeys.length} honeys and ${sources.length} local sources\n`);

  let generated = 0;
  let skipped = 0;
  const errors = [];

  // 1. Generate hero images for each FloralSource (17 images)
  console.log('--- Generating Floral Source Hero Images ---');
  for (let i = 0; i < FLORAL_SOURCES.length; i++) {
    const floralSource = FLORAL_SOURCES[i];
    const key = `honeys/heroes/floral/${floralSource}.webp`;

    console.log(`[${i + 1}/${FLORAL_SOURCES.length}] ${floralSource}...`);

    // Check if already exists
    if (await checkImageExists(key)) {
      console.log(`  Skipped (already exists)`);
      skipped++;
      continue;
    }

    try {
      const prompt = prompts.heroFloralSource(floralSource);
      const imageBuffer = await generateImage(prompt, '16:9');
      const url = await uploadToR2(imageBuffer, key);
      console.log(`  Uploaded: ${url}`);
      generated++;
      await sleep(CONFIG.delayBetweenRequests);
    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errors.push({ type: 'floral-hero', name: floralSource, error: error.message });
    }
  }

  // 2. Generate hero images for each HoneyOrigin (16 images)
  console.log('\n--- Generating Origin Hero Images ---');
  for (let i = 0; i < HONEY_ORIGINS.length; i++) {
    const origin = HONEY_ORIGINS[i];
    const key = `honeys/heroes/origin/${origin}.webp`;

    console.log(`[${i + 1}/${HONEY_ORIGINS.length}] ${origin}...`);

    // Check if already exists
    if (await checkImageExists(key)) {
      console.log(`  Skipped (already exists)`);
      skipped++;
      continue;
    }

    try {
      const prompt = prompts.heroOriginRegion(origin);
      const imageBuffer = await generateImage(prompt, '16:9');
      const url = await uploadToR2(imageBuffer, key);
      console.log(`  Uploaded: ${url}`);
      generated++;
      await sleep(CONFIG.delayBetweenRequests);
    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errors.push({ type: 'origin-hero', name: origin, error: error.message });
    }
  }

  // 3. Generate honey product images
  console.log('\n--- Generating Honey Product Images ---');
  for (let i = 0; i < honeys.length; i++) {
    const honey = honeys[i];
    const imageKey = `honeys/${honey.slug}.webp`;
    const thumbnailKey = `honeys/thumbnails/${honey.slug}.webp`;

    console.log(`[${i + 1}/${honeys.length}] ${honey.name}...`);

    // Check if already exists
    if (await checkImageExists(imageKey)) {
      // Update URLs in JSON to match R2 pattern
      honey.imageUrl = `${process.env.R2_PUBLIC_URL}/${imageKey}`;
      honey.thumbnailUrl = `${process.env.R2_PUBLIC_URL}/${thumbnailKey}`;
      console.log(`  Skipped (already exists)`);
      skipped++;
      continue;
    }

    try {
      const prompt = prompts.honeyProduct(honey.name, honey.floralSource, honey.origin);
      const imageBuffer = await generateImage(prompt, '4:5');

      // Upload main image
      const imageUrl = await uploadToR2(imageBuffer, imageKey);
      console.log(`  Uploaded: ${imageUrl}`);

      // Use same image for thumbnail (different path)
      const thumbnailUrl = await uploadToR2(imageBuffer, thumbnailKey);

      // Update JSON
      honey.imageUrl = imageUrl;
      honey.thumbnailUrl = thumbnailUrl;

      generated++;
      await sleep(CONFIG.delayBetweenRequests);
    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errors.push({ type: 'honey', name: honey.name, error: error.message });
    }
  }

  // 4. Generate local source images
  console.log('\n--- Generating Local Source Images ---');
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    // Create slug from name if not present
    const slug = source.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const imageKey = `sources/${slug}.webp`;
    const thumbnailKey = `sources/thumbnails/${slug}.webp`;

    console.log(`[${i + 1}/${sources.length}] ${source.name}...`);

    // Check if already exists
    if (await checkImageExists(imageKey)) {
      // Update URLs in JSON to match R2 pattern
      source.heroImageUrl = `${process.env.R2_PUBLIC_URL}/${imageKey}`;
      source.thumbnailUrl = `${process.env.R2_PUBLIC_URL}/${thumbnailKey}`;
      console.log(`  Skipped (already exists)`);
      skipped++;
      continue;
    }

    try {
      const prompt = prompts.localSource(source.name, source.sourceType);
      const imageBuffer = await generateImage(prompt, '4:5');

      // Upload main image
      const heroImageUrl = await uploadToR2(imageBuffer, imageKey);
      console.log(`  Uploaded: ${heroImageUrl}`);

      // Use same image for thumbnail (different path)
      const thumbnailUrl = await uploadToR2(imageBuffer, thumbnailKey);

      // Update JSON
      source.heroImageUrl = heroImageUrl;
      source.thumbnailUrl = thumbnailUrl;

      generated++;
      await sleep(CONFIG.delayBetweenRequests);
    } catch (error) {
      console.error(`  ERROR: ${error.message}`);
      errors.push({ type: 'source', name: source.name, error: error.message });
    }
  }

  // 5. Write updated JSON files
  console.log('\n--- Saving Updated JSON Files ---');
  await writeFile(honeysPath, JSON.stringify(honeys, null, 2));
  console.log(`Updated: ${honeysPath}`);
  await writeFile(sourcesPath, JSON.stringify(sources, null, 2));
  console.log(`Updated: ${sourcesPath}`);

  // Summary
  console.log('\n=== Generation Complete ===');
  console.log(`Generated: ${generated} images`);
  console.log(`Skipped (existing): ${skipped} images`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const err of errors) {
      console.log(`  - [${err.type}] ${err.name}: ${err.error}`);
    }
  }

  // Estimated cost (fal.ai FLUX schnell is ~$0.003/image)
  const estimatedCost = (generated * 0.003).toFixed(2);
  console.log(`\nEstimated cost: $${estimatedCost}`);
}

main().catch(console.error);
