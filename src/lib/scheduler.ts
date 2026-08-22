/**
 * RAF-based async event scheduler (AnimationScheduler)
 *
 * Dispatches PointerEvents on the Skribbl.io canvas in a non-blocking
 * requestAnimationFrame loop. Computes per-point delays based on local
 * curvature (tight curves → slower, straight sections → faster).
 *
 * Each stroke follows the sequence:
 *   pointerdown → pointermove × N → pointerup
 *
 * Between strokes, the pen lifts with a human-like pause (100–400ms).
 */

import type { Point, AnimatedStroke, AnimatedPoint, ExtensionSettings } from '../types/index';
import { SPEED_PRESETS } from '../types/index';
import { catmullRomSpline, computeCurvature } from './spline';
import { applyJitter } from './jitter';
import { scaleStroke, getCanvasRect } from './scaler';
import type { BoundingBox } from '../types/index';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SchedulerCallbacks {
  onProgress?: (strokeIndex: number, totalStrokes: number, progress: number) => void;
  onComplete?: (durationMs: number) => void;
  onError?: (code: string, message: string) => void;
  onCancel?: () => void;
}

// ─── AnimationScheduler Class ─────────────────────────────────────────────────

export class AnimationScheduler {
  private _canvas: HTMLCanvasElement | null = null;
  private _cancelled = false;
  private _rafHandle: ReturnType<typeof requestAnimationFrame> | null = null;
  private _startTime: number | null = null;

  /**
   * Find the Skribbl.io drawing canvas in the DOM.
   * Returns null if not found.
   */
  static findCanvas(): HTMLCanvasElement | null {
    // Try common Skribbl.io canvas selectors
    const selectors = [
      '#game-canvas canvas',
      '#sketchfield canvas',
      'canvas#sketchpad',
      'canvas.sketchCanvas',
      'canvas',
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el instanceof HTMLCanvasElement) {
        return el;
      }
    }
    return null;
  }

  /**
   * Build the AnimatedStroke sequence from raw sketch strokes.
   * Applies: scaler → spline → jitter → timing
   */
  static buildAnimatedStrokes(
    strokes: Array<{ points: Point[]; duration: number }>,
    sketchBounds: BoundingBox,
    canvas: HTMLCanvasElement,
    settings: Pick<ExtensionSettings, 'speedMode' | 'jitterAmount'>
  ): AnimatedStroke[] {
    const canvasRect = getCanvasRect(canvas);
    const speedPreset = SPEED_PRESETS[settings.speedMode];
    const baseDelay = (speedPreset.min + speedPreset.max) / 2;
    const jitterRange = speedPreset.max - speedPreset.min;

    return strokes.map((stroke, strokeIndex) => {
      if (stroke.points.length === 0) {
        return { points: [], strokeIndex };
      }

      // Step 1: Scale to canvas coordinates
      const scaled = scaleStroke(stroke.points, sketchBounds, canvasRect);

      // Step 2: Smooth with Catmull-Rom spline
      const smoothed = catmullRomSpline(scaled, 10);

      // Step 3: Apply jitter (tremor simulation)
      const jittered = applyJitter(smoothed, settings.jitterAmount, 0.5);

      // Step 4: Compute curvature for speed modulation
      const curvatures = computeCurvature(jittered);

      // Step 5: Build AnimatedPoint sequence
      const animatedPoints: AnimatedPoint[] = jittered.map((pt, i) => {
        let eventType: 'pointerdown' | 'pointermove' | 'pointerup';
        if (i === 0) {
          eventType = 'pointerdown';
        } else if (i === jittered.length - 1) {
          eventType = 'pointerup';
        } else {
          eventType = 'pointermove';
        }

        // Curvature-based delay: straight → baseDelay, tight curve → baseDelay × 2.5
        const curvatureFactor = 1 + curvatures[i] * 1.5;
        const delay = i === 0
          ? 0
          : Math.max(1, baseDelay * curvatureFactor + Math.random() * jitterRange);

        return {
          clientX: pt.x,
          clientY: pt.y,
          delay,
          eventType,
        };
      });

      return { points: animatedPoints, strokeIndex };
    });
  }

  /**
   * Dispatch a single PointerEvent on the canvas.
   */
  private _dispatchPointerEvent(
    canvas: HTMLCanvasElement,
    point: AnimatedPoint
  ): void {
    const event = new PointerEvent(point.eventType, {
      clientX: point.clientX,
      clientY: point.clientY,
      pointerId: 1,
      isPrimary: true,
      bubbles: true,
      cancelable: true,
      composed: true,
      pressure: point.eventType === 'pointerup' ? 0 : 0.5,
      pointerType: 'mouse',
    });
    canvas.dispatchEvent(event);
  }

  /**
   * Async delay using requestAnimationFrame + setTimeout hybrid.
   * Ensures we yield to the browser between every point dispatch.
   */
  private _wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      if (ms <= 0) {
        this._rafHandle = requestAnimationFrame(() => resolve());
      } else {
        setTimeout(() => {
          this._rafHandle = requestAnimationFrame(() => resolve());
        }, ms);
      }
    });
  }

  /**
   * Random stroke-lift pause between strokes (100–400ms).
   */
  private _strokeLiftPause(): number {
    return 100 + Math.random() * 300;
  }

  /**
   * Cancel a running drawing session.
   * The running loop will stop at the next check point.
   */
  cancel(): void {
    this._cancelled = true;
    if (this._rafHandle !== null) {
      cancelAnimationFrame(this._rafHandle);
      this._rafHandle = null;
    }
  }

  /**
   * Run the drawing animation.
   *
   * @param strokes - Pre-built list of raw strokes from the sketch
   * @param sketchBounds - Bounding box of the sketch
   * @param settings - Extension settings (speed, jitter)
   * @param callbacks - Progress/completion/error callbacks
   */
  async run(
    strokes: Array<{ points: Point[]; duration: number }>,
    sketchBounds: BoundingBox,
    settings: Pick<ExtensionSettings, 'speedMode' | 'jitterAmount'>,
    callbacks: SchedulerCallbacks = {}
  ): Promise<void> {
    this._cancelled = false;
    this._startTime = performance.now();

    // Find canvas
    const canvas = AnimationScheduler.findCanvas();
    if (!canvas) {
      callbacks.onError?.('CANVAS_NOT_FOUND', 'Could not locate the drawing canvas');
      return;
    }
    this._canvas = canvas;

    // Build animated strokes
    const animatedStrokes = AnimationScheduler.buildAnimatedStrokes(
      strokes,
      sketchBounds,
      canvas,
      settings
    );

    const totalStrokes = animatedStrokes.length;

    // Dispatch each stroke
    for (let si = 0; si < animatedStrokes.length; si++) {
      if (this._cancelled) {
        callbacks.onCancel?.();
        return;
      }

      const stroke = animatedStrokes[si];
      if (stroke.points.length === 0) continue;

      // Report progress
      const progress = si / totalStrokes;
      callbacks.onProgress?.(si, totalStrokes, progress);

      // Dispatch each point in the stroke
      for (const point of stroke.points) {
        if (this._cancelled) {
          // Fire a pointerup to clean up any dangling pen-down state
          try {
            this._dispatchPointerEvent(canvas, { ...point, eventType: 'pointerup', delay: 0 });
          } catch { /* ignore */ }
          callbacks.onCancel?.();
          return;
        }

        await this._wait(point.delay);

        if (this._cancelled) {
          callbacks.onCancel?.();
          return;
        }

        this._dispatchPointerEvent(canvas, point);
      }

      // Stroke-lift pause between strokes
      if (si < animatedStrokes.length - 1) {
        await this._wait(this._strokeLiftPause());
      }
    }

    // Complete
    const durationMs = performance.now() - this._startTime;
    callbacks.onComplete?.(durationMs);
  }
}
