/**
 * Injected Main-World Script
 *
 * Runs in the page's Main World (same context as Skribbl.io's JS).
 * This gives us direct access to the canvas element and can dispatch
 * PointerEvents that Skribbl.io will pick up and send over WebSocket.
 *
 * Communication channel: window.postMessage (SKRIBBL_AUTODRAW_* prefix)
 *
 * Message flow:
 *   Content → Injected: SKRIBBL_AUTODRAW_START, SKRIBBL_AUTODRAW_CANCEL
 *   Injected → Content: SKRIBBL_AUTODRAW_STATUS, SKRIBBL_AUTODRAW_COMPLETE, SKRIBBL_AUTODRAW_ERROR
 */

import type { QuickDrawSketch, ExtensionSettings } from '../types/index';
import { AnimationScheduler } from '../lib/scheduler';
import { parseColor } from '../lib/color-engine';

console.log('[SkribblAutoDraw] injected script ready');

// ─── State ────────────────────────────────────────────────────────────────────

let _activeScheduler: AnimationScheduler | null = null;

// ─── Helper: find canvas ──────────────────────────────────────────────────────

function findCanvas(): HTMLCanvasElement | null {
  return AnimationScheduler.findCanvas();
}

// ─── Helper: select a color in Skribbl.io's palette ───────────────────────────

/**
 * Click the Skribbl.io color palette button matching `hex`.
 * Skribbl.io renders palette swatches as `.color-item` (or similar) divs with a
 * background-color. We find the one whose resolved color matches and click it.
 */
function selectColor(hex: string): void {
  const target = parseColor(hex);
  if (!target) return;

  const candidates = document.querySelectorAll<HTMLElement>(
    '.color-item, .colorItem, [class*="color"], .swatch, [data-color]'
  );

  for (const el of candidates) {
    // Prefer an explicit data attribute
    const dataColor = el.dataset?.color;
    if (dataColor) {
      const c = parseColor(dataColor);
      if (c && c === target) {
        el.click();
        return;
      }
    }

    const bg =
      el.style.backgroundColor ||
      (getComputedStyle(el).backgroundColor) ||
      '';
    const c = parseColor(bg);
    if (c && c === target) {
      el.click();
      return;
    }
  }

  // Fallback: walk elements within the drawing/canvas container only (bounded
  // to avoid scanning the whole document on every stroke).
  const canvas = findCanvas();
  const scope = canvas?.parentElement?.parentElement ?? canvas?.parentElement ?? null;
  if (scope) {
    const allEls = scope.querySelectorAll<HTMLElement>('div, button, span');
    for (const el of allEls) {
      const bg = getComputedStyle(el).backgroundColor;
      const c = parseColor(bg);
      if (c && c === target) {
        el.click();
        return;
      }
    }
  }
}

// ─── Helper: post back to content ─────────────────────────────────────────────

function postToContent(message: unknown): void {
  window.postMessage(message, '*');
}

// ─── Draw handler ─────────────────────────────────────────────────────────────

async function startDrawing(
  sketch: QuickDrawSketch,
  settings: Pick<ExtensionSettings, 'speedMode' | 'jitterAmount'>,
  colors?: string[]
): Promise<void> {
  // Cancel any in-progress drawing
  if (_activeScheduler) {
    _activeScheduler.cancel();
    _activeScheduler = null;
  }

  // Verify canvas is available
  const canvas = findCanvas();
  if (!canvas) {
    postToContent({
      type: 'SKRIBBL_AUTODRAW_ERROR',
      code: 'CANVAS_NOT_FOUND',
      message: 'Could not locate the drawing canvas',
    });
    return;
  }

  const startTime = performance.now();

  _activeScheduler = new AnimationScheduler();

  await _activeScheduler.run(
    sketch.strokes,
    sketch.boundingBox,
    settings,
    {
      onProgress: (strokeIndex, totalStrokes, progress) => {
        postToContent({
          type: 'SKRIBBL_AUTODRAW_STATUS',
          status: 'animating',
          strokeIndex,
          totalStrokes,
          progress,
        });
      },
      onComplete: (durationMs) => {
        _activeScheduler = null;
        postToContent({
          type: 'SKRIBBL_AUTODRAW_COMPLETE',
          word: sketch.word,
          durationMs,
        });
        console.log(`[SkribblAutoDraw] Drawing complete: "${sketch.word}" in ${durationMs.toFixed(0)}ms`);
      },
      onCancel: () => {
        _activeScheduler = null;
        console.log('[SkribblAutoDraw] Drawing cancelled');
      },
      onError: (code, message) => {
        _activeScheduler = null;
        postToContent({
          type: 'SKRIBBL_AUTODRAW_ERROR',
          code,
          message,
        });
        console.error(`[SkribblAutoDraw] Error: ${code} — ${message}`);
      },
    },
    colors,
    selectColor
  );
}

// ─── Message listener ─────────────────────────────────────────────────────────

window.addEventListener('message', event => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg?.type?.startsWith('SKRIBBL_AUTODRAW_')) return;

  switch (msg.type) {
    case 'SKRIBBL_AUTODRAW_START': {
      const sketch = msg.sketch as QuickDrawSketch;
      const settings = msg.settings as Pick<ExtensionSettings, 'speedMode' | 'jitterAmount'>;

      // Validate incoming data
      if (!sketch || !Array.isArray(sketch.strokes)) {
        postToContent({
          type: 'SKRIBBL_AUTODRAW_ERROR',
          code: 'UNKNOWN',
          message: 'Invalid sketch data received',
        });
        return;
      }

      const colors = Array.isArray(msg.colors) ? (msg.colors as string[]) : undefined;
      startDrawing(sketch, settings, colors);
      break;
    }

    case 'SKRIBBL_AUTODRAW_CANCEL': {
      if (_activeScheduler) {
        _activeScheduler.cancel();
        _activeScheduler = null;
        console.log('[SkribblAutoDraw] Drawing cancelled by user');
      }
      break;
    }
  }
});
