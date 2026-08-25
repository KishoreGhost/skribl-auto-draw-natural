/**
 * QuickDraw Dataset Fetcher
 *
 * Fetches real human-drawn sketch data from Google Cloud Storage
 * (the Google Quick, Draw! dataset) on-demand for any of 345 categories.
 *
 * Data source: https://storage.googleapis.com/quickdraw_dataset/full/simplified/{word}.ndjson
 * Each line is a JSON record with a `drawing` field containing stroke data.
 *
 * Flow: fetch NDJSON → parse lines → filter recognized → score → convert → cache
 */

import type {
  QuickDrawRawDrawing,
  QuickDrawSketch,
  Stroke,
  BoundingBox,
  CachedWordData,
} from '../types/index';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Base URL for Google Quick, Draw! simplified dataset */
const GCS_BASE_URL =
  'https://storage.googleapis.com/quickdraw_dataset/full/simplified/';

/** How many lines to read from the NDJSON (each file has 100K+) */
const MAX_LINES_TO_READ = 80;

/** How many top-scored drawings to keep in cache */
const TOP_DRAWINGS_TO_CACHE = 8;

/** Cache expiry (7 days in ms) */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Score a raw drawing for quality. Higher = better.
 */
function scoreDrawing(raw: QuickDrawRawDrawing): number {
  let score = 0;

  // Recognized by Google's ML = clear, identifiable drawing
  if (raw.recognized) score += 100;
  else return -1; // skip unrecognized

  // More strokes = more detail
  const strokeCount = raw.drawing.length;
  score += strokeCount * 8;

  // Total points across all strokes
  const totalPoints = raw.drawing.reduce((sum, s) => sum + s[0].length, 0);
  score += totalPoints * 0.5;

  // Penalize extremely sparse drawings (too simple)
  if (totalPoints < 15) score -= 60;

  // Penalize extremely complex drawings (too slow to draw)
  if (totalPoints > 400) score -= (totalPoints - 400) * 0.3;

  // Sweet spot: 50-200 points
  if (totalPoints >= 50 && totalPoints <= 200) score += 30;

  return score;
}

// ─── Conversion ───────────────────────────────────────────────────────────────

/**
 * Convert QuickDraw simplified format to our internal Stroke[] format.
 *
 * QuickDraw format: drawing = [[[x0,x1,...],[y0,y1,...]], ...]
 * Our format:       strokes = [{points: [{x,y},...], duration: ms}, ...]
 */
function convertToStrokes(drawing: number[][][]): Stroke[] {
  return drawing.map(stroke => {
    const xs = stroke[0];
    const ys = stroke[1];
    const points = xs.map((x, i) => ({ x, y: ys[i] }));
    // Estimate duration: ~25ms per point (natural drawing speed)
    const duration = Math.max(100, points.length * 25);
    return { points, duration };
  });
}

/**
 * Compute bounding box from converted strokes.
 */
function computeBoundingBox(strokes: Stroke[]): BoundingBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const stroke of strokes) {
    for (const p of stroke.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
  }

  // Guard against degenerate bounding boxes
  if (!isFinite(minX)) return { minX: 0, minY: 0, maxX: 255, maxY: 255 };
  if (maxX - minX < 1) maxX = minX + 1;
  if (maxY - minY < 1) maxY = minY + 1;

  return { minX, minY, maxX, maxY };
}

/**
 * Convert a raw QuickDraw drawing into our QuickDrawSketch format.
 */
function convertRawToSketch(
  raw: QuickDrawRawDrawing,
  variantIndex: number
): QuickDrawSketch {
  const strokes = convertToStrokes(raw.drawing);
  const boundingBox = computeBoundingBox(strokes);
  return {
    word: raw.word,
    strokes,
    boundingBox,
    variantIndex,
  };
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

/**
 * Build the GCS URL for a category.
 */
function buildUrl(category: string): string {
  // URL-encode spaces and special chars
  const encoded = encodeURIComponent(category);
  return `${GCS_BASE_URL}${encoded}.ndjson`;
}

/**
 * Fetch and parse the first N lines of an NDJSON file.
 * Uses streaming to avoid downloading the entire file (which can be 50MB+).
 */
async function fetchNdjsonLines(
  url: string,
  maxLines: number
): Promise<QuickDrawRawDrawing[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No readable stream');

  const decoder = new TextDecoder();
  const results: QuickDrawRawDrawing[] = [];
  let buffer = '';

  try {
    while (results.length < maxLines) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // Process all complete lines (keep last partial line in buffer)
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (results.length >= maxLines) break;
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          results.push(JSON.parse(trimmed) as QuickDrawRawDrawing);
        } catch {
          // Skip malformed lines
        }
      }
    }
  } finally {
    reader.cancel().catch(() => { /* ignore */ });
  }

  return results;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

/**
 * Get cached drawing data from chrome.storage.local.
 */
async function getCached(word: string): Promise<CachedWordData | null> {
  const key = `qdcache_${word}`;
  const data = await chrome.storage.local.get(key);
  const cached = data[key] as CachedWordData | undefined;

  if (!cached) return null;

  // Check if expired
  if (Date.now() - cached.cachedAt > CACHE_TTL_MS) {
    await chrome.storage.local.remove(key);
    return null;
  }

  return cached;
}

/**
 * Store drawing data in chrome.storage.local.
 */
async function setCache(word: string, sketches: QuickDrawSketch[]): Promise<void> {
  const key = `qdcache_${word}`;
  const data: CachedWordData = {
    word,
    sketches,
    cachedAt: Date.now(),
  };
  await chrome.storage.local.set({ [key]: data });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** In-memory cache to avoid repeated chrome.storage lookups within same session */
const _memoryCache = new Map<string, QuickDrawSketch[]>();

/**
 * Fetch drawings for a word from the QuickDraw dataset.
 *
 * Resolution order:
 * 1. In-memory cache (this session)
 * 2. chrome.storage.local cache (across sessions)
 * 3. Network fetch from Google Cloud Storage
 *
 * @returns Array of QuickDrawSketch variants (top N by quality), or empty if not found
 */
export async function fetchDrawings(category: string): Promise<QuickDrawSketch[]> {
  const normalizedCategory = category.toLowerCase().trim();

  // 1. Memory cache
  if (_memoryCache.has(normalizedCategory)) {
    return _memoryCache.get(normalizedCategory)!;
  }

  // 2. Storage cache
  const cached = await getCached(normalizedCategory);
  if (cached && cached.sketches.length > 0) {
    _memoryCache.set(normalizedCategory, cached.sketches);
    return cached.sketches;
  }

  // 3. Network fetch
  console.log(`[SkribblAutoDraw] Fetching drawings for "${normalizedCategory}" from QuickDraw...`);
  const url = buildUrl(normalizedCategory);

  let rawDrawings: QuickDrawRawDrawing[];
  try {
    rawDrawings = await fetchNdjsonLines(url, MAX_LINES_TO_READ);
  } catch (err) {
    console.error(`[SkribblAutoDraw] Failed to fetch drawings for "${normalizedCategory}":`, err);
    return [];
  }

  if (rawDrawings.length === 0) {
    console.warn(`[SkribblAutoDraw] No drawings found for "${normalizedCategory}"`);
    return [];
  }

  // Score and sort
  const scored = rawDrawings
    .map(raw => ({ raw, score: scoreDrawing(raw) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    console.warn(`[SkribblAutoDraw] No quality drawings for "${normalizedCategory}"`);
    return [];
  }

  // Convert top N to our format
  const topSketches = scored
    .slice(0, TOP_DRAWINGS_TO_CACHE)
    .map((item, idx) => convertRawToSketch(item.raw, idx));

  // Cache for future use
  _memoryCache.set(normalizedCategory, topSketches);
  try {
    await setCache(normalizedCategory, topSketches);
  } catch {
    // Storage might be full — that's okay, memory cache still works
  }

  console.log(
    `[SkribblAutoDraw] Fetched ${rawDrawings.length} drawings for "${normalizedCategory}", ` +
    `cached top ${topSketches.length}`
  );

  return topSketches;
}

/**
 * Clear all cached drawing data.
 */
export async function clearCache(): Promise<void> {
  _memoryCache.clear();
  const all = await chrome.storage.local.get(null);
  const cacheKeys = Object.keys(all).filter(k => k.startsWith('qdcache_'));
  if (cacheKeys.length > 0) {
    await chrome.storage.local.remove(cacheKeys);
  }
}
