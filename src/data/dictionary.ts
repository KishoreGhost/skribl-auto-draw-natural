/**
 * Dictionary — Dynamic word lookup with QuickDraw fetcher
 *
 * Replaces the old static dictionary with an async system that:
 * 1. Checks if a word is in the 345 supported categories
 * 2. Fetches real human drawing data from Google Cloud Storage (via the
 *    background service worker, which holds the host permission and is not
 *    subject to CORS — content-script fetches would be blocked by GCS)
 * 3. Caches results for fast subsequent lookups
 */

import type { QuickDrawSketch } from '../types/index';
import {
  QUICKDRAW_CATEGORIES,
  getCategoryCount,
  isSupportedCategory,
} from './categories';

// ─── Normalization ────────────────────────────────────────────────────────────

/**
 * Normalize a word for dictionary lookup:
 * - Lowercase
 * - Trim whitespace
 * - Collapse multiple spaces to single
 * - Strip unusual punctuation (keep hyphens for words like "t-shirt")
 */
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 -]/g, '');
}

// ─── Aggressive matching (synonyms + fuzzy) ─────────────────────────────────────

/**
 * Common aliases → QuickDraw category (all lowercased). Catches semantic
 * variants that fuzzy matching alone would miss (e.g. plane → airplane).
 */
const SYNONYM_MAP: Record<string, string> = {
  // aircraft / vehicles
  plane: 'airplane',
  planes: 'airplane',
  aeroplane: 'airplane',
  jet: 'airplane',
  helicopter: 'helicopter',
  ship: 'boat',
  boat: 'boat',
  motorcycle: 'motorbike',
  motorbike: 'motorbike',
  // electronics
  tv: 'television',
  telly: 'television',
  t: 'television',
  phone: 'cell phone',
  mobile: 'cell phone',
  smartphone: 'cell phone',
  cellphone: 'cell phone',
  laptop: 'laptop',
  computer: 'computer',
  pc: 'computer',
  // animals (diminutives)
  kitty: 'cat',
  kitten: 'cat',
  doggy: 'dog',
  doggo: 'dog',
  puppy: 'dog',
  bunny: 'rabbit',
  rabbit: 'rabbit',
  piggy: 'pig',
  fishy: 'fish',
  horsie: 'horse',
  horsy: 'horse',
  // objects
  sofa: 'couch',
  couch: 'couch',
  // generic
  flower: 'flower',
  tree: 'tree',
};

/**
 * Classic Levenshtein edit distance (no dependencies).
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = new Array<number>(n + 1);
  let cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    const tmp = prev;
    prev = cur;
    cur = tmp;
  }
  return prev[n];
}

/**
 * Resolve a word to the best matching QuickDraw category, or null if no
 * reasonable match exists (caller should fall back to text rendering).
 *
 * Order: exact → synonym → singular-strip → fuzzy (edit distance).
 * Deliberately avoids the old loose "contains" match to prevent false
 * positives like "carbon" → "car".
 */
export function matchCategory(word: string): string | null {
  const w = normalizeWord(word);
  if (!w) return null;

  // 1. Exact
  if (isSupportedCategory(w)) return w;

  // 2. Synonym
  const syn = SYNONYM_MAP[w];
  if (syn && isSupportedCategory(syn)) return syn;

  // 3. Singular strip (e.g. "cats" → "cat")
  if (w.length > 3 && w.endsWith('s')) {
    const singular = w.slice(0, -1);
    if (isSupportedCategory(singular)) return singular;
  }

  // 4. Fuzzy: best Levenshtein over category names and their tokens
  let best: string | null = null;
  let bestDist = Infinity;
  const threshold = Math.max(2, Math.floor(w.length / 3));

  for (const cat of QUICKDRAW_CATEGORIES) {
    const c = cat.toLowerCase();
    let d = levenshtein(w, c);
    for (const token of c.split(' ')) {
      const dt = levenshtein(w, token);
      if (dt < d) d = dt;
    }
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }

  return best && bestDist <= threshold ? best : null;
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

/**
 * Check if a word can be resolved to a QuickDraw category (real sketch data).
 */
export function hasWord(word: string): boolean {
  return matchCategory(word) !== null;
}

/**
 * Request drawing data for a category from the background service worker.
 *
 * The actual network fetch happens in the background (which has the GCS
 * host_permissions and is exempt from CORS). Returns the cached-or-fetched
 * list of sketch variants, or an empty array on any error.
 */
function requestDrawingsViaBackground(category: string): Promise<QuickDrawSketch[]> {
  return new Promise(resolve => {
    console.log(`[SkribblAutoDraw] → requesting drawings for "${category}" via background`);
    try {
      chrome.runtime.sendMessage(
        { type: 'FETCH_DRAWINGS', category },
        (response: unknown) => {
          if (chrome.runtime.lastError) {
            console.error(
              '[SkribblAutoDraw] Fetch relay error (background unreachable?):',
              chrome.runtime.lastError.message
            );
            resolve([]);
            return;
          }
          if (Array.isArray(response)) {
            console.log(
              `[SkribblAutoDraw] ← received ${response.length} sketches for "${category}" from background`
            );
            resolve(response);
            return;
          }
          // Non-array response (e.g. stale SW returning {ok:false,error:...})
          console.error(
            '[SkribblAutoDraw] Background returned unexpected response for',
            category,
            '—',
            response
          );
          resolve([]);
        }
      );
    } catch (err) {
      console.error('[SkribblAutoDraw] Failed to relay fetch to background:', err);
      resolve([]);
    }
  });
}

/**
 * Look up sketches for a given word (async — may fetch from network via the
 * background service worker). Returns the array of variants (possibly empty if
 * not found or fetch fails).
 *
 * @param word - Raw word text (will be normalized internally)
 * @returns Array of QuickDrawSketch variants, or empty array if not found
 */
export async function lookupWord(word: string): Promise<QuickDrawSketch[]> {
  // Resolve to the best QuickDraw category (exact / synonym / fuzzy)
  const category = matchCategory(word);
  if (!category) {
    return [];
  }

  // Fetch drawings via background (with caching)
  return requestDrawingsViaBackground(category);
}

/**
 * Get a specific sketch variant by index, or a random one.
 * Async — fetches from network if not cached.
 *
 * @param word - Raw word text
 * @param variantIndex - Specific index or 'random'
 * @returns The selected QuickDrawSketch, or null if not found
 */
export async function getSketch(
  word: string,
  variantIndex: number | 'random' = 'random'
): Promise<QuickDrawSketch | null> {
  const variants = await lookupWord(word);

  if (variants.length === 0) {
    return null;
  }

  if (variantIndex === 'random') {
    // Pick random from top 5 for variety
    const topN = Math.min(5, variants.length);
    const idx = Math.floor(Math.random() * topN);
    return variants[idx];
  }

  // Clamp index to valid range
  const clampedIdx = Math.max(0, Math.min(variantIndex, variants.length - 1));
  return variants[clampedIdx];
}

/**
 * Get the total number of supported word categories.
 */
export function getDictionarySize(): number {
  return getCategoryCount();
}
