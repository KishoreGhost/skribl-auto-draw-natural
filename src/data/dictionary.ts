/**
 * Dictionary loader & lookup for QuickDraw sketch data
 *
 * Provides normalized word lookup, random/indexed variant selection,
 * and the WordDictionary interface backed by pre-bundled offline data.
 */

import type { QuickDrawSketch, WordDictionary } from '../types/index';
import { QUICKDRAW_DATA } from './quickdraw-data';

// ─── Module-level cached dictionary ──────────────────────────────────────────

let _dictionary: WordDictionary | null = null;

/**
 * Load (and cache) the word dictionary from the bundled QuickDraw data.
 * Subsequent calls return the same cached instance.
 */
export function loadDictionary(): WordDictionary {
  if (_dictionary) return _dictionary;

  const categories = Object.keys(QUICKDRAW_DATA).sort();

  _dictionary = {
    version: '1.0.0',
    words: QUICKDRAW_DATA,
    categories,
  };

  return _dictionary;
}

// ─── Normalization ────────────────────────────────────────────────────────────

/**
 * Normalize a word for dictionary lookup:
 * - Lowercase
 * - Trim whitespace
 * - Collapse multiple spaces to single
 * - Strip common punctuation
 */
export function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '');
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

/**
 * Look up sketches for a given word.
 * Returns the array of variants (possibly empty if not found).
 *
 * @param word - Raw word text (will be normalized internally)
 * @returns Array of QuickDrawSketch variants, or empty array if not found
 */
export function lookupWord(word: string): QuickDrawSketch[] {
  const dict = loadDictionary();
  const key = normalizeWord(word);

  // Direct match
  if (dict.words[key]) {
    return dict.words[key];
  }

  // Try without spaces (e.g., "ice cream" → "icecream")
  const noSpace = key.replace(/ /g, '');
  if (dict.words[noSpace]) {
    return dict.words[noSpace];
  }

  // Try first word only (e.g., "hot dog" → "dog")
  const parts = key.split(' ');
  for (const part of parts) {
    if (dict.words[part] && dict.words[part].length > 0) {
      return dict.words[part];
    }
  }

  return [];
}

/**
 * Check if a word has a matching sketch in the dictionary.
 */
export function hasWord(word: string): boolean {
  return lookupWord(word).length > 0;
}

/**
 * Get a specific sketch variant by index, or a random one.
 *
 * @param word - Raw word text
 * @param variantIndex - Specific index or 'random'
 * @returns The selected QuickDrawSketch, or null if not found
 */
export function getSketch(
  word: string,
  variantIndex: number | 'random' = 'random'
): QuickDrawSketch | null {
  const variants = lookupWord(word);

  if (variants.length === 0) {
    return null;
  }

  if (variantIndex === 'random') {
    const idx = Math.floor(Math.random() * variants.length);
    return variants[idx];
  }

  // Clamp index to valid range
  const clampedIdx = Math.max(0, Math.min(variantIndex, variants.length - 1));
  return variants[clampedIdx];
}

/**
 * Get all supported word categories (sorted alphabetically).
 */
export function getCategories(): string[] {
  return loadDictionary().categories;
}

/**
 * Get the total number of words in the dictionary.
 */
export function getDictionarySize(): number {
  return getCategories().length;
}
