/**
 * Sketch → canvas coordinate scaler
 *
 * Maps QuickDraw sketch coordinates (typically 0–255) into
 * Skribbl.io canvas client coordinates, preserving aspect ratio
 * and adding configurable padding.
 */

import type { Point, BoundingBox } from '../types/index';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Fraction of canvas to leave as padding on each side */
const DEFAULT_PADDING_FRACTION = 0.08;

// ─── Canvas Rect ──────────────────────────────────────────────────────────────

/** A canvas rectangle in client/screen coordinates */
export interface CanvasRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// ─── Bounding Box Computation ─────────────────────────────────────────────────

/**
 * Compute the axis-aligned bounding box of a set of points.
 * Returns a bounding box with 1px expansion on all sides if points have zero extent.
 */
export function computeBoundingBox(points: Point[]): BoundingBox {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 255, maxY: 255 };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  // Guard against degenerate bounding boxes (all points identical)
  if (maxX - minX < 1) { maxX = minX + 1; }
  if (maxY - minY < 1) { maxY = minY + 1; }

  return { minX, minY, maxX, maxY };
}

// ─── Scaling ──────────────────────────────────────────────────────────────────

/**
 * Scale a single point from sketch space to canvas client coordinates.
 *
 * Preserves aspect ratio by fitting the sketch's bounding box inside the
 * canvas rect with uniform scaling (uses the smaller scale factor).
 * Centers the result in the canvas.
 *
 * @param point - Point in sketch coordinate space
 * @param sketchBounds - The bounding box of the entire sketch
 * @param canvasRect - The canvas element's bounding rect in client coordinates
 * @param paddingFraction - Fraction of canvas width/height to use as padding (each side)
 * @returns Point in canvas client coordinates
 */
export function scalePoint(
  point: Point,
  sketchBounds: BoundingBox,
  canvasRect: CanvasRect,
  paddingFraction: number = DEFAULT_PADDING_FRACTION
): Point {
  const padX = canvasRect.width * paddingFraction;
  const padY = canvasRect.height * paddingFraction;

  const availableWidth = canvasRect.width - 2 * padX;
  const availableHeight = canvasRect.height - 2 * padY;

  const sketchWidth = sketchBounds.maxX - sketchBounds.minX;
  const sketchHeight = sketchBounds.maxY - sketchBounds.minY;

  // Uniform scale: fit the sketch inside available area, preserving aspect ratio
  const scaleX = availableWidth / sketchWidth;
  const scaleY = availableHeight / sketchHeight;
  const scale = Math.min(scaleX, scaleY);

  // Compute the offset to center the scaled sketch in the canvas
  const scaledWidth = sketchWidth * scale;
  const scaledHeight = sketchHeight * scale;
  const offsetX = canvasRect.left + padX + (availableWidth - scaledWidth) / 2;
  const offsetY = canvasRect.top + padY + (availableHeight - scaledHeight) / 2;

  return {
    x: offsetX + (point.x - sketchBounds.minX) * scale,
    y: offsetY + (point.y - sketchBounds.minY) * scale,
  };
}

/**
 * Scale an entire stroke from sketch space to canvas client coordinates.
 *
 * @param points - Array of points in sketch coordinate space
 * @param sketchBounds - The bounding box of the entire sketch
 * @param canvasRect - The canvas element's bounding rect in client coordinates
 * @param paddingFraction - Fraction of canvas width/height to use as padding (each side)
 * @returns Array of points in canvas client coordinates
 */
export function scaleStroke(
  points: Point[],
  sketchBounds: BoundingBox,
  canvasRect: CanvasRect,
  paddingFraction: number = DEFAULT_PADDING_FRACTION
): Point[] {
  return points.map(p => scalePoint(p, sketchBounds, canvasRect, paddingFraction));
}

/**
 * Get a CanvasRect from a DOM element's bounding rect.
 * Convenience wrapper around getBoundingClientRect().
 */
export function getCanvasRect(element: Element): CanvasRect {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}
