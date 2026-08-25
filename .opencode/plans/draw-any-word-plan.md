# Draw Any Word — Implementation Plan

## Goal
Remove the 345-word restriction. Every chosen word is drawn:
- If a good match exists in Google's QuickDraw 345 categories → use real human sketch data (with colors).
- Otherwise → render the word itself as **text strokes** on the Skribbl canvas, so the extension never says "can't draw".

## Reality constraint
Real human sketch data only exists for Google's 345 QuickDraw categories. The "draw everything" requirement is met by (1) aggressively resolving near-matches to those 345, and (2) a text fallback for the long tail.

---

## T1 — Aggressive word matching (`src/data/dictionary.ts`)
- Import `QUICKDRAW_CATEGORIES` from `./categories`.
- Add `SYNONYM_MAP: Record<string,string>` (alias → category, lowercased): e.g.
  `plane/planes/aeroplane/jet → airplane`, `tv/telly → television`,
  `phone/mobile/smartphone → cell phone`, `kitty/kitten → cat`,
  `doggy/puppy/doggo → dog`, `bunny → rabbit`, `piggy → pig`,
  `sofa → couch`, `ship → boat`, `motorcycle → motorbike`, `pc → computer`.
- Add a `levenshtein(a,b)` helper (no deps).
- Add `matchCategory(word): string | null`:
  1. exact normalized match (`isSupportedCategory`),
  2. synonym lookup,
  3. singular strip (`word` ending in `s`) + exact check,
  4. fuzzy: min Levenshtein over all 345 category names AND their tokens; accept best if
     `distance <= max(2, floor(len/3))`.
  This intentionally drops the loose "contains" match from the old `findCategory` to avoid false positives (e.g. "carbon" → "car").
- Change `lookupWord`/`hasWord` to use `matchCategory` instead of `findCategory`.
- `getSketch` unchanged in signature (still returns `QuickDrawSketch | null`), now routes through `matchCategory`.

## T2 — Text→strokes fallback (new `src/lib/text-to-strokes.ts`)
- `textToStrokes(text: string): QuickDrawSketch`:
  - Offscreen `<canvas>` (e.g. 400×200). Fill black, draw `text` white, bold sans-serif,
    `textAlign:'center'`, `textBaseline:'middle'`, auto-shrink font to fit 90% width.
  - `getImageData`, treat white pixels (r>128) as "on".
  - Baseline method: per horizontal row, emit one `Stroke` per contiguous run of "on"
    pixels (a 2-point line). Vertical step ~4px to bound stroke count (~40–80 strokes).
  - Compute `BoundingBox` from on-pixel extents; return object shaped exactly like
    `QuickDrawSketch` (`word`, `strokes`, `boundingBox`, `variantIndex:0`) so it flows
    through the existing scheduler/injected pipeline untouched.
  - (Enhancement, optional: Moore-neighbor contour tracing for outlined letters instead of fill.)
- Runs in the content script (DOM/canvas available).

## T3 — Wire into content script (`src/content/content.ts`)
- Remove the `hasWord` rejection gate and the "not in 345 supported words" error toast.
- `onDrawingTurnStart`:
  ```
  const sketch = await getSketch(word, settings.variantIndex);
  let colors: string[] | undefined;
  if (sketch) {
    colors = getStrokeColors(word, sketch.strokes.length);
  } else {
    sketch = textToStrokes(word);          // always returns a sketch
    colors = undefined;                    // draw in Skribbl's current pen color
    showToast(`Drawing "${word}" as text (no sketch data)`, 'info');
  }
  if (!sketch) { showToast(`Couldn't draw "${word}"`, 'error'); return; }
  ```
- `triggerDraw` already passes `colors` (optional) — no change.
- Keep the existing "Fetching…" / "Couldn't load" diagnostics toasts.

## T4 — Pipeline verification (`src/injected/injected.ts`, `src/lib/scheduler.ts`)
- No functional change required: `AnimationScheduler.run(strokes, boundingBox, settings, cb, colors?, selectColor?)`
  already skips color-switching when `colors` is undefined (keeps current pen color).
- Verify text sketches (generic strokes + boundingBox) animate correctly via the same
  `SKRIBBL_AUTODRAW_START` message (`sketch` is `QuickDrawSketch`-shaped).

## T5 — Popup copy (`src/popup/popup.ts`, `src/popup/popup.html`)
- `renderDictSize`: change to e.g. `"Any word · 345 real sketches"` (keep `getDictionarySize()` count available).
- Update `data-source` note to: `"Draws any word — 345 have real sketches, rest drawn as text"`.

## T6 — Tests + build
- Add unit tests (`tests/unit/dictionary.test.ts`): `levenshtein` correctness, `matchCategory`
  synonyms (`plane`→`airplane`, `tv`→`television`) and fuzzy (`cats`→`cat`, `kitty`→`cat`),
  and that an unknown word (`freedom`) returns `null`.
- `npm test` and `npm run build` must pass. (Do NOT add a DOM-dependent unit test for
  `textToStrokes` in the node test env; it is exercised at runtime.)

## Files touched
- `src/data/dictionary.ts` (modify)
- `src/lib/text-to-strokes.ts` (new)
- `src/content/content.ts` (modify)
- `src/popup/popup.ts` (modify)
- `src/popup/popup.html` (modify)
- `tests/unit/dictionary.test.ts` (new)

## Behavior after
- Listed/near words → real colored sketches (as before).
- Any other word → the word is written on the canvas as text (no error, no rejection).
- Works offline for cached categories; never blocks on "unsupported".
