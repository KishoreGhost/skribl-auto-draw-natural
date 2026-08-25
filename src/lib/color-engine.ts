/**
 * Color Engine
 *
 * Assigns colors to drawings using Skribbl.io's 22-color palette.
 *
 * Two strategies:
 *  1. Explicit per-word mapping (WORD_COLOR_MAP) — e.g. tree → green/brown
 *  2. Semantic guesser — fallback based on word keywords (sky→blue, fire→red…)
 *
 * The QuickDraw dataset has no color info, so we assign colors by stroke
 * order: first strokes = main outline (primary), middle = details (secondary),
 * last = accents (accent). The result is one hex color per stroke, ready to
 * hand to the scheduler / injected color selector.
 */

import { SKRIBBL_PALETTE } from '../types/index';

// ─── Palette helpers ──────────────────────────────────────────────────────────

/** Normalize a hex string to lowercase #rrggbb form (or null if invalid). */
export function normalizeHex(input: string): string | null {
  let h = input.trim().toLowerCase();
  if (h.startsWith('#')) {
    if (h.length === 4) {
      // #abc → #aabbcc
      h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }
    if (/^#[0-9a-f]{6}$/.test(h)) return h;
  }
  return null;
}

/** Convert an "rgb(r, g, b)" / "rgba(...)" string to lowercase #rrggbb, or null. */
export function rgbToHex(input: string): string | null {
  const m = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) return null;
  const toHex = (n: string) => parseInt(n, 10).toString(16).padStart(2, '0');
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}

/** Parse any CSS color string (hex or rgb) into normalized #rrggbb, or null. */
export function parseColor(input: string): string | null {
  return normalizeHex(input) ?? rgbToHex(input);
}

/** Return the palette entry closest (by Euclidean distance) to the requested hex. */
export function nearestPaletteColor(hex: string): string {
  const normalized = normalizeHex(hex);
  if (normalized && SKRIBBL_PALETTE.includes(normalized)) return normalized;

  const target = normalized ?? '#000000';
  const tr = parseInt(target.slice(1, 3), 16);
  const tg = parseInt(target.slice(3, 5), 16);
  const tb = parseInt(target.slice(5, 7), 16);

  let best = SKRIBBL_PALETTE[0];
  let bestDist = Infinity;
  for (const c of SKRIBBL_PALETTE) {
    const r = parseInt(c.slice(1, 3), 16);
    const g = parseInt(c.slice(3, 5), 16);
    const b = parseInt(c.slice(5, 7), 16);
    const dist = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = c;
    }
  }
  return best;
}

// ─── Explicit word → color mappings ───────────────────────────────────────────
//
// Each entry lists up to three colors: [primary, secondary?, accent?].
// Primary = main outline/body, secondary = details, accent = final flourishes.

export const WORD_COLOR_MAP: Record<string, string[]> = {
  // Nature
  tree: ['#005510', '#00cc00', '#63300d'],
  'palm tree': ['#005510', '#00cc00', '#a0522d'],
  'house plant': ['#005510', '#00cc00', '#63300d'],
  leaf: ['#005510', '#00cc00'],
  grass: ['#005510', '#00cc00'],
  bush: ['#005510', '#00cc00'],
  flower: ['#ef130b', '#00cc00', '#ffe400'],
  sun: ['#ffe400', '#ff7100', '#ef130b'],
  'rainbow': ['#ef130b', '#ff7100', '#ffe400', '#00cc00', '#231fd3', '#a300ba'],
  cloud: ['#c1c1c1', '#ffffff'],
  'lightning': ['#ffe400', '#0e0865'],
  'fire hydrant': ['#ef130b', '#740b07'],
  'fireplace': ['#ef130b', '#ff7100', '#63300d'],
  'firetruck': ['#ef130b', '#740b07'],
  'campfire': ['#ff7100', '#ef130b', '#63300d'],
  'hourglass': ['#c1c1c1', '#e8a200'],
  'snowman': ['#ffffff', '#c1c1c1'],
  'snowflake': ['#00b2ff', '#c1c1c1'],
  'ocean': ['#00569e', '#00b2ff'],
  'river': ['#00569e', '#00b2ff'],
  'mountain': ['#005510', '#63300d'],
  'volcano': ['#ef130b', '#740b07', '#63300d'],

  // Animals
  cat: ['#ff7100', '#000000'],
  'teddy-bear': ['#a0522d', '#000000'],
  dog: ['#a0522d', '#000000'],
  'lion': ['#e8a200', '#ff7100'],
  'tiger': ['#e8a200', '#000000'],
  'rabbit': ['#c1c1c1', '#ffffff'],
  'bear': ['#63300d', '#000000'],
  'panda': ['#000000', '#ffffff'],
  'horse': ['#a0522d', '#000000'],
  'cow': ['#ffffff', '#000000'],
  'pig': ['#a75574', '#d37caa'],
  'elephant': ['#c1c1c1', '#4c4c4c'],
  'zebra': ['#ffffff', '#000000'],
  'giraffe': ['#e8a200', '#a0522d'],
  'monkey': ['#a0522d', '#000000'],
  'snake': ['#00cc00', '#005510'],
  'fish': ['#00b2ff', '#00569e'],
  'shark': ['#4c4c4c', '#c1c1c1'],
  'whale': ['#0e0865', '#00569e'],
  'dolphin': ['#00569e', '#00b2ff'],
  'penguin': ['#000000', '#ffffff', '#ffe400'],
  'flamingo': ['#d37caa', '#a75574'],
  'octopus': ['#a300ba', '#550069'],
  'crab': ['#ef130b', '#740b07'],
  'lobster': ['#ef130b', '#740b07'],
  'spider': ['#000000', '#4c4c4c'],
  'bee': ['#ffe400', '#000000'],
  'butterfly': ['#a300ba', '#ef130b', '#231fd3'],
  'bird': ['#00b2ff', '#005510'],
  'duck': ['#ffe400', '#a0522d'],
  'owl': ['#63300d', '#a0522d'],
  'chicken': ['#ffffff', '#ef130b'],
  'frog': ['#00cc00', '#005510'],
  'snail': ['#a0522d', '#c1c1c1'],
  'mouse': ['#c1c1c1', '#4c4c4c'],
  'squirrel': ['#a0522d', '#63300d'],

  // Food
  'apple': ['#ef130b', '#005510'],
  'banana': ['#ffe400', '#e8a200'],
  'watermelon': ['#00cc00', '#ef130b', '#005510'],
  'strawberry': ['#ef130b', '#005510'],
  'pineapple': ['#e8a200', '#00cc00'],
  'pizza': ['#ef130b', '#e8a200', '#005510'],
  'hamburger': ['#a0522d', '#740b07', '#00cc00'],
  'hot dog': ['#ef130b', '#a0522d'],
  'ice cream': ['#d37caa', '#a75574', '#ffe400'],
  'cake': ['#d37caa', '#a75574'],
  'birthday cake': ['#d37caa', '#a75574', '#ef130b'],
  'donut': ['#a75574', '#d37caa'],
  'cookie': ['#a0522d', '#63300d'],
  'broccoli': ['#005510', '#00cc00'],
  'carrot': ['#ff7100', '#005510'],
  'grapes': ['#550069', '#a300ba'],
  'mushroom': ['#ef130b', '#c1c1c1'],
  'pear': ['#00cc00', '#005510'],
  'cherry': ['#ef130b', '#740b07'],

  // Sky / space
  'moon': ['#ffe400', '#e8a200'],
  'star': ['#ffe400', '#e8a200'],
  'rain': ['#00569e', '#00b2ff'],
  'light bulb': ['#ffe400', '#e8a200'],

  // Objects
  'house': ['#a0522d', '#740b07', '#005510'],
  'car': ['#ef130b', '#000000'],
  'truck': ['#ef130b', '#000000'],
  'bus': ['#ffe400', '#ef130b'],
  'airplane': ['#c1c1c1', '#00b2ff'],
  'helicopter': ['#00b2ff', '#c1c1c1'],
  'boat': ['#a0522d', '#00569e'],
  'sailboat': ['#ffffff', '#ef130b', '#00569e'],
  'bicycle': ['#000000', '#ef130b'],
  'motorbike': ['#000000', '#ef130b'],
  'train': ['#ef130b', '#000000'],
  'fire': ['#ef130b', '#ff7100', '#ffe400'],
  'flower': ['#ef130b', '#00cc00'],
  'book': ['#740b07', '#ef130b'],
  'pencil': ['#ffe400', '#ef130b', '#a0522d'],
  'umbrella': ['#ef130b', '#00b2ff'],
  'balloon': ['#ef130b', '#00b2ff', '#00cc00'],
  'hot air balloon': ['#ef130b', '#ff7100', '#00b2ff'],
  'kite': ['#ef130b', '#00b2ff', '#ffe400'],
  'gift': ['#a300ba', '#d37caa'],
};

// ─── Semantic fallback guesser ────────────────────────────────────────────────

interface SemanticRule {
  test: RegExp;
  colors: string[];
}

const SEMANTIC_RULES: SemanticRule[] = [
  { test: /\b(sky|cloud|water|ocean|sea|river|lake|rain|snow|ice|winter|blue)\b/, colors: ['#00569e', '#00b2ff'] },
  { test: /\b(fire|flame|hot|sun|lava|volcano|heat)\b/, colors: ['#ef130b', '#ff7100', '#ffe400'] },
  { test: /\b(grass|leaf|tree|plant|flower|green|nature|garden|forest|frog)\b/, colors: ['#005510', '#00cc00'] },
  { test: /\b(animal|cat|dog|lion|tiger|bear|horse|cow|pig|wolf|fox|pet|fur)\b/, colors: ['#a0522d', '#ff7100', '#000000'] },
  { test: /\b(meat|steak|blood|red|heart|love)\b/, colors: ['#ef130b', '#740b07'] },
  { test: /\b(night|dark|space|moon|star|purple|magic)\b/, colors: ['#0e0865', '#550069', '#a300ba'] },
  { test: /\b(yellow|gold|banana|cheese|sunflower)\b/, colors: ['#ffe400', '#e8a200'] },
  { test: /\b(wood|brown|tree trunk|branch|chocolate)\b/, colors: ['#63300d', '#a0522d'] },
  { test: /\b(pink|rose|flower|love)\b/, colors: ['#d37caa', '#a75574'] },
  { test: /\b(white|snow|cloud|paper|milk)\b/, colors: ['#ffffff', '#c1c1c1'] },
  { test: /\b(black|grey|gray|metal|stone|rock)\b/, colors: ['#000000', '#4c4c4c'] },
];

/**
 * Guess a color set for a word using keyword semantics.
 * Returns an empty array if nothing matches (caller falls back to black).
 */
export function guessColorBySemantics(word: string): string[] {
  const lower = word.toLowerCase();
  for (const rule of SEMANTIC_RULES) {
    if (rule.test.test(lower)) return rule.colors;
  }
  return [];
}

// ─── Public color assignment ─────────────────────────────────────────────────

/**
 * Resolve the best color set for a given word.
 * Order: explicit map → semantic guess → default black.
 */
export function getColorSetForWord(word: string): string[] {
  const lower = word.toLowerCase().trim();

  if (WORD_COLOR_MAP[lower]) return WORD_COLOR_MAP[lower];

  // Try whole-word tokens against the map (e.g. "birthday cake" already keyed,
  // but a compound like "blue flower" should fall through to semantic)
  const semantic = guessColorBySemantics(lower);
  if (semantic.length > 0) return semantic;

  return ['#000000'];
}

/**
 * Build a per-stroke color array for a drawing.
 *
 * Stroke-order heuristic:
 *  - First strokes  → primary (outline / body)
 *  - Middle strokes → secondary (details)
 *  - Last strokes   → accent (flourishes)
 *
 * @returns Array of length `strokeCount`, each a palette-matched hex string.
 */
export function getStrokeColors(word: string, strokeCount: number): string[] {
  const colors = getColorSetForWord(word);
  const result: string[] = [];

  if (strokeCount <= 0) return result;

  const primary = nearestPaletteColor(colors[0] ?? '#000000');
  const secondary = colors[1] ? nearestPaletteColor(colors[1]) : primary;
  const accent = colors[2] ? nearestPaletteColor(colors[2]) : secondary;

  for (let i = 0; i < strokeCount; i++) {
    const position = i / strokeCount;

    let chosen: string;
    if (colors.length >= 3) {
      if (position < 0.6) chosen = primary;
      else if (position < 0.85) chosen = secondary;
      else chosen = accent;
    } else if (colors.length === 2) {
      chosen = position < 0.7 ? primary : secondary;
    } else {
      chosen = primary;
    }

    result.push(chosen);
  }

  return result;
}
