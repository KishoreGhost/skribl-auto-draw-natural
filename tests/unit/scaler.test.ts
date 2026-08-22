/**
 * Unit tests for sketch → canvas coordinate scaler
 */

import { describe, it, expect } from 'vitest';
import { scalePoint, scaleStroke, computeBoundingBox, getCanvasRect } from '../../src/lib/scaler';
import type { Point, BoundingBox } from '../../src/types/index';
import type { CanvasRect } from '../../src/lib/scaler';

// ─── Test fixtures ────────────────────────────────────────────

const UNIT_BOUNDS: BoundingBox = { minX: 0, minY: 0, maxX: 255, maxY: 255 };

const SQUARE_CANVAS: CanvasRect = { left: 0, top: 0, width: 800, height: 600 };

// ─── computeBoundingBox ───────────────────────────────────────

describe('computeBoundingBox', () => {

  it('returns fallback bounds for empty input', () => {
    const bb = computeBoundingBox([]);
    expect(bb.minX).toBe(0);
    expect(bb.maxX).toBe(255);
  });

  it('computes correct bounds for a simple set of points', () => {
    const pts: Point[] = [
      { x: 10, y: 20 }, { x: 50, y: 5 }, { x: 30, y: 80 }
    ];
    const bb = computeBoundingBox(pts);
    expect(bb.minX).toBe(10);
    expect(bb.maxX).toBe(50);
    expect(bb.minY).toBe(5);
    expect(bb.maxY).toBe(80);
  });

  it('handles single point without returning zero-area box', () => {
    const bb = computeBoundingBox([{ x: 50, y: 50 }]);
    expect(bb.maxX - bb.minX).toBeGreaterThanOrEqual(1);
    expect(bb.maxY - bb.minY).toBeGreaterThanOrEqual(1);
  });

  it('handles all identical points', () => {
    const pts: Point[] = Array.from({ length: 5 }, () => ({ x: 100, y: 100 }));
    const bb = computeBoundingBox(pts);
    expect(bb.maxX - bb.minX).toBeGreaterThanOrEqual(1);
    expect(bb.maxY - bb.minY).toBeGreaterThanOrEqual(1);
  });
});

// ─── scalePoint ───────────────────────────────────────────────

describe('scalePoint', () => {

  it('maps top-left sketch corner to canvas top-left area', () => {
    const pt: Point = { x: 0, y: 0 };
    const result = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS, 0.0);

    // Uniform scale = min(800/255, 600/255) = 600/255 ≈ 2.353
    // Scaled sketch: 600×600, centered in 800-wide canvas → offsetX = (800-600)/2 = 100
    // So (0,0) maps to (100, 0)
    expect(result.x).toBeCloseTo(100, 0);
    expect(result.y).toBeCloseTo(0, 0);
  });

  it('maps bottom-right sketch corner to canvas bottom-right area', () => {
    const pt: Point = { x: 255, y: 255 };

    // Uniform scale = min(800/255, 600/255) = 600/255 ≈ 2.353
    // Scaled sketch: 600×600, centered in 800 wide → offsetX=100
    // So (255,255) maps to (100+600, 0+600) = (700, 600)
    const result = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS, 0.0);
    expect(result.x).toBeCloseTo(700, 0);
    expect(result.y).toBeCloseTo(600, 0);
  });

  it('maps center of sketch to center of canvas (approximately)', () => {
    const pt: Point = { x: 127.5, y: 127.5 };
    const result = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS, 0.0);

    // Center should be at canvas center horizontally
    expect(result.x).toBeCloseTo(SQUARE_CANVAS.width / 2, 0);
    expect(result.y).toBeCloseTo(SQUARE_CANVAS.height / 2, 0);
  });

  it('applies padding correctly: left edge with 8% padding moves inward', () => {
    const pt: Point = { x: 0, y: 0 };
    const noPad = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS, 0);
    const withPad = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS, 0.08);

    // With padding, the point should be further from canvas edge
    expect(withPad.x).toBeGreaterThanOrEqual(noPad.x);
    expect(withPad.y).toBeGreaterThanOrEqual(noPad.y);
  });

  it('output coordinates are within canvas bounds (with default padding)', () => {
    const testPts: Point[] = [
      { x: 0, y: 0 }, { x: 255, y: 255 }, { x: 127.5, y: 127.5 },
      { x: 10, y: 245 }, { x: 245, y: 10 }
    ];
    for (const pt of testPts) {
      const result = scalePoint(pt, UNIT_BOUNDS, SQUARE_CANVAS);
      expect(result.x).toBeGreaterThanOrEqual(SQUARE_CANVAS.left - 1);
      expect(result.x).toBeLessThanOrEqual(SQUARE_CANVAS.left + SQUARE_CANVAS.width + 1);
      expect(result.y).toBeGreaterThanOrEqual(SQUARE_CANVAS.top - 1);
      expect(result.y).toBeLessThanOrEqual(SQUARE_CANVAS.top + SQUARE_CANVAS.height + 1);
    }
  });

  it('preserves aspect ratio: square sketch on wider canvas leaves horizontal margins', () => {
    // 800×600 canvas, 255×255 sketch → scale = min(800,600)/255 ≈ 2.35
    // Scaled sketch is 600×600, centered in 800 wide → 100px margin each side
    const leftPt = scalePoint({ x: 0, y: 127.5 }, UNIT_BOUNDS, SQUARE_CANVAS, 0);
    const rightPt = scalePoint({ x: 255, y: 127.5 }, UNIT_BOUNDS, SQUARE_CANVAS, 0);

    // Left margin
    expect(leftPt.x).toBeGreaterThan(0);
    // Right margin: right edge of sketch < canvas width
    expect(rightPt.x).toBeLessThan(SQUARE_CANVAS.width);
    // Sketch is centered: left and right margins should be equal
    const leftMargin = leftPt.x - SQUARE_CANVAS.left;
    const rightMargin = SQUARE_CANVAS.left + SQUARE_CANVAS.width - rightPt.x;
    expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(2);
  });

  it('works with non-zero canvas offset (left=50, top=100)', () => {
    const canvasWithOffset: CanvasRect = { left: 50, top: 100, width: 400, height: 300 };
    const pt: Point = { x: 0, y: 0 };
    const result = scalePoint(pt, UNIT_BOUNDS, canvasWithOffset, 0);

    // Top-left sketch point should map to canvas left+horizontal_offset (aspect ratio centering), top
    expect(result.x).toBeGreaterThanOrEqual(50);
    expect(result.y).toBeGreaterThanOrEqual(100);
  });

  it('known expected value: unit box (0-255) → 0-padded 800x600 canvas', () => {
    // Scale = min(800*0.84/255, 600*0.84/255) = min(2.635, 1.976) = 1.976
    // scaled size: 255 * 1.976 = 503.9 wide, 503.9 tall
    // padX = 64, padY = 48, availableW = 672, availableH = 504
    // offset of sketch center in canvas: 64 + (672-504)/2 = 148, 48
    const center: Point = { x: 127.5, y: 127.5 };
    const result = scalePoint(center, UNIT_BOUNDS, SQUARE_CANVAS, 0.08);
    expect(result.x).toBeCloseTo(400, 0); // canvas horizontal center
    expect(result.y).toBeCloseTo(300, 0); // canvas vertical center
  });
});

// ─── scaleStroke ──────────────────────────────────────────────

describe('scaleStroke', () => {

  it('returns empty array for empty input', () => {
    expect(scaleStroke([], UNIT_BOUNDS, SQUARE_CANVAS)).toEqual([]);
  });

  it('returns array of same length as input', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 128, y: 128 }, { x: 255, y: 255 }
    ];
    const result = scaleStroke(pts, UNIT_BOUNDS, SQUARE_CANVAS);
    expect(result).toHaveLength(pts.length);
  });

  it('does not mutate input points', () => {
    const pts: Point[] = [{ x: 50, y: 80 }, { x: 200, y: 100 }];
    const origX = pts[0].x;
    scaleStroke(pts, UNIT_BOUNDS, SQUARE_CANVAS);
    expect(pts[0].x).toBe(origX);
  });

  it('all output coordinates are finite numbers', () => {
    const pts: Point[] = Array.from({ length: 20 }, (_, i) => ({
      x: i * 13,
      y: i * 7,
    }));
    const result = scaleStroke(pts, UNIT_BOUNDS, SQUARE_CANVAS);
    for (const pt of result) {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
    }
  });
});
