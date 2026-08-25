/**
 * Text → Strokes Fallback
 *
 * For words that have no QuickDraw sketch data, we still draw *something*:
 * the word itself, rendered as text strokes on the Skribbl.io canvas.
 *
 * We rasterize the word onto an offscreen canvas, then emit one `Stroke` per
 * horizontal run of "on" pixels. The result is shaped exactly like a
 * `QuickDrawSketch` (strokes + boundingBox) so it flows through the existing
 * scheduler / injected PointerEvent pipeline untouched.
 */

import type { QuickDrawSketch, Stroke, BoundingBox, Point } from '../types/index';

/**
 * Render `text` and convert it into a QuickDrawSketch-compatible stroke set.
 * Returns a sketch with the word's outline filled by horizontal line strokes.
 */
export function textToStrokes(text: string): QuickDrawSketch {
  const W = 512;
  const H = 256;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const empty: QuickDrawSketch = {
    word: text,
    strokes: [],
    boundingBox: { minX: 0, minY: 0, maxX: W, maxY: H },
    variantIndex: 0,
  };

  if (!ctx) return empty;

  // Background black, text white (we sample white pixels as "on")
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const setFont = (size: number) => {
    ctx!.font = `bold ${size}px Arial, sans-serif`;
  };

  let fontSize = 180;
  setFont(fontSize);
  const maxTextWidth = W * 0.92;
  const measured = ctx.measureText(text);
  if (measured.width > maxTextWidth) {
    fontSize = Math.max(24, Math.floor((fontSize * maxTextWidth) / measured.width));
    setFont(fontSize);
  }

  ctx.fillText(text, W / 2, H / 2);

  const data = ctx.getImageData(0, 0, W, H).data;

  // Vertical step bounds the number of strokes (fewer rows → faster draw)
  const stepY = 4;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const strokes: Stroke[] = [];

  for (let y = 0; y < H; y += stepY) {
    let runStart = -1;
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const on = data[idx] > 128; // red channel of white text
      if (on && runStart < 0) {
        runStart = x;
      } else if (!on && runStart >= 0) {
        addRun(strokes, runStart, x - 1, y, (bx, by) => {
          if (bx < minX) minX = bx;
          if (bx > maxX) maxX = bx;
          if (by < minY) minY = by;
          if (by > maxY) maxY = by;
        });
        runStart = -1;
      }
    }
    if (runStart >= 0) {
      addRun(strokes, runStart, W - 1, y, (bx, by) => {
        if (bx < minX) minX = bx;
        if (bx > maxX) maxX = bx;
        if (by < minY) minY = by;
        if (by > maxY) maxY = by;
      });
    }
  }

  let boundingBox: BoundingBox;
  if (!isFinite(minX)) {
    boundingBox = { minX: 0, minY: 0, maxX: W, maxY: H };
  } else {
    if (maxX - minX < 1) maxX = minX + 1;
    if (maxY - minY < 1) maxY = minY + 1;
    boundingBox = { minX, minY, maxX, maxY };
  }

  return {
    word: text,
    strokes,
    boundingBox,
    variantIndex: 0,
  };
}

/**
 * Append a horizontal line stroke for the run [x0, x1] at row `y`, invoking
 * `track` with each point so the caller can accumulate the bounding box.
 */
function addRun(
  strokes: Stroke[],
  x0: number,
  x1: number,
  y: number,
  track: (x: number, y: number) => void
): void {
  const points: Point[] = [
    { x: x0, y },
    { x: x1, y },
  ];
  for (const p of points) track(p.x, p.y);
  strokes.push({
    points,
    duration: Math.max(100, points.length * 25),
  });
}
