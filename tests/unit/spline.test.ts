/**
 * Unit tests for Catmull-Rom spline interpolation
 */

import { describe, it, expect } from 'vitest';
import { catmullRomSpline, computeCurvature } from '../../src/lib/spline';
import type { Point } from '../../src/types/index';

describe('catmullRomSpline', () => {

  it('returns empty array for 0 input points', () => {
    expect(catmullRomSpline([])).toEqual([]);
  });

  it('returns single point for 1 input point', () => {
    const pts: Point[] = [{ x: 10, y: 20 }];
    expect(catmullRomSpline(pts)).toEqual([{ x: 10, y: 20 }]);
  });

  it('produces linear interpolation for 2 input points', () => {
    const pts: Point[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
    const result = catmullRomSpline(pts, 10);
    expect(result.length).toBe(11); // 0..10 inclusive

    // Check endpoints
    expect(result[0].x).toBeCloseTo(0, 2);
    expect(result[result.length - 1].x).toBeCloseTo(100, 2);

    // Check monotonicity (x should increase)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].x).toBeGreaterThanOrEqual(result[i - 1].x);
    }
  });

  it('produces more output points than input points for N ≥ 3', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 0 }
    ];
    const result = catmullRomSpline(pts, 10);
    expect(result.length).toBeGreaterThan(pts.length);
  });

  it('starts and ends near the first and last control points', () => {
    const pts: Point[] = [
      { x: 10, y: 10 }, { x: 50, y: 80 }, { x: 90, y: 30 }, { x: 130, y: 60 }
    ];
    const result = catmullRomSpline(pts, 10);

    expect(result[0].x).toBeCloseTo(pts[0].x, 0);
    expect(result[0].y).toBeCloseTo(pts[0].y, 0);
    expect(result[result.length - 1].x).toBeCloseTo(pts[pts.length - 1].x, 0);
    expect(result[result.length - 1].y).toBeCloseTo(pts[pts.length - 1].y, 0);
  });

  it('interpolation continuity: no large jumps between consecutive points', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 0 },
      { x: 150, y: 100 }, { x: 200, y: 0 }
    ];
    const result = catmullRomSpline(pts, 10);

    const MAX_STEP = 25; // No jump > 25 units between consecutive spline pts
    for (let i = 1; i < result.length; i++) {
      const dx = result[i].x - result[i - 1].x;
      const dy = result[i].y - result[i - 1].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      expect(dist).toBeLessThan(MAX_STEP);
    }
  });

  it('respects pointsPerSegment parameter', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 }
    ];
    const result5 = catmullRomSpline(pts, 5);
    const result20 = catmullRomSpline(pts, 20);
    expect(result20.length).toBeGreaterThan(result5.length);
  });

  it('handles collinear points without producing NaN values', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }, { x: 150, y: 0 }
    ];
    const result = catmullRomSpline(pts, 10);
    for (const pt of result) {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
    }
  });

  it('handles duplicate points without producing NaN values', () => {
    const pts: Point[] = [
      { x: 50, y: 50 }, { x: 50, y: 50 }, { x: 100, y: 100 }
    ];
    const result = catmullRomSpline(pts, 5);
    for (const pt of result) {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
    }
  });

  it('does not mutate the input points array', () => {
    const pts: Point[] = [
      { x: 10, y: 20 }, { x: 50, y: 80 }, { x: 90, y: 30 }
    ];
    const original = pts.map(p => ({ ...p }));
    catmullRomSpline(pts, 10);
    expect(pts).toEqual(original);
  });
});

describe('computeCurvature', () => {

  it('returns all zeros for fewer than 3 points', () => {
    expect(computeCurvature([])).toEqual([]);
    expect(computeCurvature([{ x: 0, y: 0 }])).toEqual([0]);
    expect(computeCurvature([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toEqual([0, 0]);
  });

  it('returns near-zero curvature for collinear points', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }
    ];
    const curvatures = computeCurvature(pts);
    expect(curvatures[1]).toBeCloseTo(0, 5);
  });

  it('returns high curvature for a 90-degree turn', () => {
    // A sharp right-angle turn: left → right → up
    const pts: Point[] = [
      { x: 0, y: 50 }, { x: 50, y: 50 }, { x: 50, y: 0 }
    ];
    const curvatures = computeCurvature(pts);
    // Middle point should have high curvature
    expect(curvatures[1]).toBeGreaterThan(0.5);
  });

  it('returns values in [0, 1] range', () => {
    const pts: Point[] = [
      { x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 0 },
      { x: 150, y: 100 }, { x: 200, y: 0 }
    ];
    const curvatures = computeCurvature(pts);
    for (const c of curvatures) {
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThanOrEqual(1);
    }
  });

  it('returns array of same length as input', () => {
    const pts: Point[] = Array.from({ length: 15 }, (_, i) => ({
      x: i * 10,
      y: Math.sin(i) * 20,
    }));
    expect(computeCurvature(pts)).toHaveLength(pts.length);
  });
});
