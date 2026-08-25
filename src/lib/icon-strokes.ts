/**
 * Icon → Strokes (image fallback)
 *
 * When a word has no QuickDraw sketch data, we fetch a *real* line-art icon for
 * the word from the Iconify API (via the background service worker, which holds
 * the host permission and is exempt from CORS), then convert the icon's SVG
 * <path> elements into drawable strokes using the page's SVG geometry API.
 *
 * The result is shaped exactly like a `QuickDrawSketch` (strokes + boundingBox)
 * so it flows through the existing scheduler / injected PointerEvent pipeline.
 */

import type { QuickDrawSketch, Stroke, BoundingBox, Point } from '../types/index';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Convert an Iconify SVG (full `<svg>` document or an inner fragment of
 * `<path>` elements) into strokes. Uses the browser's SVG geometry API
 * (getTotalLength / getPointAtLength) to sample each path into a polyline.
 *
 * The Iconify SVG endpoint returns a complete `<svg viewBox="0 0 24 24">…</svg>`
 * document. We parse it (or wrap a bare fragment) and read its own viewBox so
 * coordinates stay in the icon's native space.
 */
export function svgBodyToStrokes(body: string): {
  strokes: Stroke[];
  boundingBox: BoundingBox;
} {
  const isFullSvg = body.trimStart().startsWith('<svg');
  const wrapped = isFullSvg
    ? body
    : `<svg xmlns="${SVG_NS}" viewBox="0 0 24 24">${body}</svg>`;

  const doc = new DOMParser().parseFromString(wrapped, 'image/svg+xml');
  const svgEl = doc.documentElement as SVGElement;
  const imported = document.importNode(svgEl, true);
  document.body.appendChild(imported);

  const paths = Array.from(imported.querySelectorAll('path'));
  const strokes: Stroke[] = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of paths) {
    const path = el as SVGPathElement;
    let len = 0;
    try {
      len = path.getTotalLength();
    } catch {
      continue;
    }
    if (!len || !isFinite(len)) continue;

    const steps = Math.max(2, Math.min(600, Math.floor(len / 1.5)));
    const pts: Point[] = [];
    for (let i = 0; i <= steps; i++) {
      const pt = path.getPointAtLength((len * i) / steps);
      pts.push({ x: pt.x, y: pt.y });
    }
    if (pts.length < 2) continue;

    for (const pt of pts) {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    }
    strokes.push({ points: pts, duration: Math.max(100, pts.length * 20) });
  }

  imported.remove();

  let boundingBox: BoundingBox;
  if (!isFinite(minX)) {
    boundingBox = { minX: 0, minY: 0, maxX: 24, maxY: 24 };
  } else {
    if (maxX - minX < 1) maxX = minX + 1;
    if (maxY - minY < 1) maxY = minY + 1;
    boundingBox = { minX, minY, maxX, maxY };
  }

  return { strokes, boundingBox };
}

/**
 * Fetch an icon for `word` via the background service worker and convert it to a
 * QuickDrawSketch-compatible stroke set. Returns null if no icon is found or the
 * conversion fails.
 */
export async function fetchIconSketch(word: string): Promise<QuickDrawSketch | null> {
  const query = word.trim();
  if (!query) return null;

  return new Promise(resolve => {
    try {
      chrome.runtime.sendMessage(
        { type: 'FETCH_ICON', query },
        (response: unknown) => {
          if (chrome.runtime.lastError) {
            console.error(
              '[SkribblAutoDraw] Icon relay error:',
              chrome.runtime.lastError.message
            );
            resolve(null);
            return;
          }
          const icon = response as { body?: string } | null;
          if (!icon || typeof icon.body !== 'string') {
            resolve(null);
            return;
          }
          const { strokes, boundingBox } = svgBodyToStrokes(icon.body);
          if (strokes.length === 0) {
            resolve(null);
            return;
          }
          resolve({
            word: query,
            strokes,
            boundingBox,
            variantIndex: 0,
          });
        }
      );
    } catch (err) {
      console.error('[SkribblAutoDraw] Failed to relay icon fetch:', err);
      resolve(null);
    }
  });
}
