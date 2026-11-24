import express from 'express';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Enable Gzip/Deflate compression for fast loading and reduced transfer sizes
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6
}));

// CDN and Browser Caching Headers Middleware
app.use((req, res, next) => {
  const normalizedPath = req.path.replace(/\/+$/, '') || '/';
  // Service worker & manifest must always revalidate cleanly for offline update safety
  if (
    normalizedPath === '/sw.js' ||
    normalizedPath === '/dev-sw.js' ||
    normalizedPath === '/registerSW.js' ||
    normalizedPath.startsWith('/workbox-') ||
    normalizedPath === '/manifest.webmanifest'
  ) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else if (normalizedPath.startsWith('/assets/') || normalizedPath.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (normalizedPath === '/sitemap.xml' || normalizedPath === '/robots.txt') {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  } else {
    // HTML pages must never be cached with long max-age to ensure users see newly published updates immediately!
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Support large base64 image uploads from mobile and high-res cameras
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const DEFAULT_SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://agrovisionai.ai.studio/</loc>
    <lastmod>2026-11-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://agrovisionai.ai.studio/sitemap.xml
`;

function resolveStaticSeoFile(filename: string): string | null {
  const candidates = [
    path.resolve(__dirname, 'public', filename),
    path.resolve(__dirname, 'dist', filename),
    path.resolve(__dirname, 'docs', filename)
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, 'utf8');
    }
  }
  return null;
}

// Dedicated SEO Routes for Sitemap & Robots (always pure XML/text, never falls through to SPA HTML)
app.get(['/sitemap.xml', '/sitemap.xml/'], (_req, res) => {
  const xml = resolveStaticSeoFile('sitemap.xml') ?? DEFAULT_SITEMAP_XML;
  res.status(200);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

app.get(['/robots.txt', '/robots.txt/'], (_req, res) => {
  const txt = resolveStaticSeoFile('robots.txt') ?? DEFAULT_ROBOTS_TXT;
  res.status(200);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(txt);
});

// Self-unregistering cleanup routes so devices that previously installed the PWA automatically purge caches & SW
app.get(['/sw.js', '/dev-sw.js'], (_req, res) => {
  res.status(200);
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send(`
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch {}
    try {
      await self.registration.unregister();
    } catch {}
    try {
      const windowClients = await self.clients.matchAll({ type: 'window' });
      windowClients.forEach((client) => {
        try { client.navigate(client.url); } catch {}
      });
    } catch {}
  })());
});
`);
});

app.get('/manifest.webmanifest', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(410).end();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

/**
 * Real Gemini 3.8 Flash Multimodal Vision AI Endpoint:
 * Performs strict, multi-stage leaf pathology inspection:
 * 1. Gatekeeper: Is this a plant leaf? (Strictly rejects humans, clothing, rooms, animals)
 * 2. Species Verification: Is this a tomato leaf (Solanum lycopersicum) vs mango/neem/other?
 * 3. Pathology Analysis: Accurate tomato disease classification with symptoms and organic treatments.
 */
app.post('/api/analyze-leaf', async (req, res) => {
  try {
    const { imageBase64, sensorContext } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image data is required in base64 format.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallbackRequired: true
      });
    }

    // Build optional sanitized virtual sensor context string
    const sensorLines: string[] = [];
    if (sensorContext && typeof sensorContext === 'object') {
      if (sensorContext.moistureEnabled && typeof sensorContext.moisturePercent === 'number') {
        const clampedMoisture = Math.min(100, Math.max(0, Math.round(sensorContext.moisturePercent)));
        sensorLines.push(`- Virtual Soil Moisture Sensor: ${clampedMoisture}% volumetric water content (optimal tomato range: 45-68%)`);
      }
      if (sensorContext.phEnabled && typeof sensorContext.soilPh === 'number') {
        const clampedPh = Math.min(10, Math.max(3, Number(sensorContext.soilPh.toFixed(1))));
        sensorLines.push(`- Virtual Soil pH Sensor: ${clampedPh} pH (optimal tomato range: 6.0-6.8 pH)`);
      }
    }

    const sensorContextPrompt =
      sensorLines.length > 0
        ? `\n\n4. OPTIONAL ROOT-ZONE SENSOR TELEMETRY CONTEXT:\n${sensorLines.join('\n')}\nFactor these root-zone readings ONLY into Stage 2 (once confirmed as a tomato leaf): correlate high moisture (>75%) with elevated fungal/bacterial blight susceptibility, drought (<35%) with water stress, low pH (<5.8) with calcium deficiency/blight susceptibility, or high pH (>7.3) with iron chlorosis mimicking viral yellowing. Include a root-zone cultural tip in cultural_prevention. Never bypass Stage 1 rejection rules based on sensor values.`
        : '';

    // Extract raw base64 data and mime type
    let mimeType = 'image/jpeg';
    let cleanBase64 = imageBase64;

    const matches = imageBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
    }

    const ai = new GoogleGenAI();

    const prompt = `You are the lead botanical computer-vision pathologist for AgroVision AI.
Analyze this image with extreme scientific precision. Follow these strict rules:

1. FIRST GATEKEEPER - LEAF VERIFICATION:
Determine if this image actually contains a botanical plant leaf.
If the image shows a human person, clothing (e.g. white shirt, fabric), skin, facial features, a room, furniture, an animal, or a non-plant object, you MUST immediately declare:
- is_plant_leaf: false
- non_plant_reason: Clearly describe what you see (e.g. "Human skin and white clothing", "Indoor furniture", "Non-botanical object").
- is_tomato_leaf: false
- disease_id: "none"
- disease_name: "Non-Plant Detected"
NEVER diagnose a human, clothing, or non-plant object with plant diseases like Late Blight or Early Blight.

2. SECOND GATEKEEPER - SPECIES IDENTIFICATION:
If it IS a plant leaf, identify if it belongs to a tomato plant (Solanum lycopersicum).
- If it is Mango (Mangifera indica): set is_tomato_leaf: false, plant_species: "Mango Leaf", species_scientific: "Mangifera indica".
- If it is Neem (Azadirachta indica): set is_tomato_leaf: false, plant_species: "Neem Leaf", species_scientific: "Azadirachta indica".
- If it is another non-tomato plant: set is_tomato_leaf: false, plant_species: name of plant.
- If it IS a Tomato leaf: set is_tomato_leaf: true, plant_species: "Tomato Leaf", species_scientific: "Solanum lycopersicum".

3. THIRD STAGE - PATHOLOGY CLASSIFICATION (Only if is_tomato_leaf is true):
Classify into one of these tomato conditions:
- "healthy" (Vigorous, emerald green foliage, optimal cellular turgor)
- "early_blight" (Alternaria solani - concentric dark brown target rings with yellow halo)
- "late_blight" (Phytophthora infestans - large water-soaked dark greenish-gray to brown necrosis)
- "bacterial_spot" (Xanthomonas - small angular dark brown scabs, shot-hole tears)
- "septoria_leaf_spot" (Septoria lycopersici - small circular spots with ash-gray center & dark border)
- "yellow_leaf_curl" (TYLCV virus - upward cup-shaped leaf curling, bright yellow interveinal chlorosis)
- "leaf_mold" (Passalora fulva - yellow patches above, velvety olive-green mold below)
- "mosaic_virus" (ToMV - mottled dark and light green mosaic distortion)${sensorContextPrompt}

Return ONLY valid JSON matching this exact structure:
{
  "is_plant_leaf": boolean,
  "non_plant_reason": string or null,
  "is_tomato_leaf": boolean,
  "plant_species": string,
  "species_scientific": string,
  "disease_id": "healthy" | "early_blight" | "late_blight" | "bacterial_spot" | "septoria_leaf_spot" | "yellow_leaf_curl" | "leaf_mold" | "mosaic_virus" | "none",
  "disease_name": string,
  "pathogen_type": "Fungal" | "Bacterial" | "Viral" | "Healthy" | "None",
  "confidence": number between 75 and 99,
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "lesion_coverage_percent": number,
  "primary_symptoms": string[],
  "organic_treatment": string[],
  "chemical_treatment": string[],
  "cultural_prevention": string[],
  "lesion_boxes": [
    { "x": number, "y": number, "width": number, "height": number, "label": string, "confidence": number }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Clean up markdown block wrapping if present
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
      source: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Error during Gemini leaf analysis:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process leaf with Gemini vision model',
      fallbackRequired: true
    });
  }
});

// In-memory audio cache for instant sub-millisecond replay
const audioTtsCache = new Map<string, string>();

/**
 * Real Native Spoken Urdu TTS Audio Endpoint:
 * Synthesizes clear native Urdu spoken speech audio for rural farmers and students.
 * Uses Gemini 3.8 Flash Lite TTS ('gemini-3.8-flash-lite-tts') to return clean 24kHz audio/wav.
 */
app.post('/api/tts-urdu', async (req, res) => {
  try {
    const { text, diseaseId, isUrdu = true } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required for audio synthesis.' });
    }

    const cacheKey = `${diseaseId || 'custom'}_${isUrdu ? 'ur' : 'en'}_${text.slice(0, 40)}`;
    if (audioTtsCache.has(cacheKey)) {
      return res.json({
        success: true,
        audioBase64: audioTtsCache.get(cacheKey),
        format: 'audio/wav',
        cached: true,
        source: 'cache'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
        fallbackRequired: true
      });
    }

    const ai = new GoogleGenAI();

    // Use gemini-3.8-flash-lite-tts as specified in gemini_api skill
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: isUrdu
                  ? 'Clear, caring agricultural extension officer speaking fluent native Urdu with proper pronunciation'
                  : 'Clear, encouraging agricultural advisor'
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(502).json({
        error: 'Model did not return audio data.',
        fallbackRequired: true
      });
    }

    // Save in memory cache
    audioTtsCache.set(cacheKey, base64Audio);

    return res.json({
      success: true,
      audioBase64: base64Audio,
      format: 'audio/wav',
      cached: false,
      source: 'gemini-3.8-flash-lite-tts'
    });
  } catch (error: any) {
    console.error('Error in /api/tts-urdu audio synthesis:', error);
    return res.status(500).json({
      error: error.message || 'Failed to synthesize Urdu speech audio.',
      fallbackRequired: true
    });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.resolve(__dirname, 'dist', 'index.html'))
      ? path.resolve(__dirname, 'dist')
      : path.resolve(__dirname, 'docs');

    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 AgroVision AI server active at http://0.0.0.0:${PORT} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting AgroVision server:', err);
  process.exit(1);
});
