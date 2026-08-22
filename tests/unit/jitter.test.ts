/**
 * Unit tests for Gaussian jitter / hand-tremor simulation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { applyJitter, jitterPoint, gaussianRandom, resetJitterState } from '../../src/lib/jitter';
import type { Point } from '../../src/types/index';

describe('gaussianRandom', () => {

  it('produces values in a reasonable range (|value| < 5 with high probability)', () => {
    // For standard Gaussian, P(|X| < 5) ≈ 99.9999%
    for (let i = 0; i < 1000; i++) {
      const val = gaussianRandom();
      expect(Math.abs(val)).toBeLessThan(8); // Allow up to 8 sigma for very high safety
    }
  });

  it('has approximate zero mean over many samples', () => {
    const N = 10000;
    let sum = 0;
    for (let i = 0; i < N; i++) sum += gaussianRandom();
    const mean = sum / N;
    // Mean should be close to 0 (within 0.1 for N=10000)
    expect(Math.abs(mean)).toBeLessThan(0.1);
  });
});

describe('jitterPoint', () => {

  beforeEach(() => {
    resetJitterState();
  });

  it('returns identical point when jitterAmount is 0', () => {
    const pt: Point = { x: 100, y: 150 };
    const result = jitterPoint(pt, 0);
    expect(result).toEqual(pt);
    expect(result).not.toBe(pt); // should be a copy
  });

  it('returns a new object (does not mutate input)', () => {
    const pt: Point = { x: 50, y: 75 };
    const result = jitterPoint(pt, 1.0);
    expect(result).not.toBe(pt);
    expect(pt.x).toBe(50);
    expect(pt.y).toBe(75);
  });

  it('adds small offsets for jitterAmount=1.0', () => {
    const pt: Point = { x: 128, y: 128 };
    // Run many times; offset should be bounded
    for (let i = 0; i < 100; i++) {
      const result = jitterPoint(pt, 1.0);
      expect(Math.abs(result.x - pt.x)).toBeLessThan(10);
      expect(Math.abs(result.y - pt.y)).toBeLessThan(10);
    }
  });

  it('larger jitterAmount produces larger offsets on average', () => {
    const pt: Point = { x: 128, y: 128 };
    const N = 500;

    let sumLow = 0, sumHigh = 0;
    for (let i = 0; i < N; i++) {
      const low = jitterPoint(pt, 0.5);
      const high = jitterPoint(pt, 3.0);
      sumLow += Math.abs(low.x - pt.x) + Math.abs(low.y - pt.y);
      sumHigh += Math.abs(high.x - pt.x) + Math.abs(high.y - pt.y);
    }

    expect(sumHigh / N).toBeGreaterThan(sumLow / N);
  });
});

describe('applyJitter', () => {

  beforeEach(() => {
    resetJitterState();
  });

  it('returns empty array for empty input', () => {
    expect(applyJitter([], 1.0)).toEqual([]);
  });

  it('returns copies of points when jitterAmount is 0', () => {
    const pts: Point[] = [
      { x: 10, y: 20 }, { x: 30, y: 40 }, { x: 50, y: 60 }
    ];
    const result = applyJitter(pts, 0);
    expect(result).toEqual(pts);
    expect(result).not.toBe(pts);
    expect(result[0]).not.toBe(pts[0]); // should be new objects
  });

  it('returns array of same length as input', () => {
    const pts: Point[] = Array.from({ length: 20 }, (_, i) => ({ x: i * 5, y: i * 3 }));
    const result = applyJitter(pts, 1.0);
    expect(result).toHaveLength(pts.length);
  });

  it('does not mutate the input array', () => {
    const pts: Point[] = [{ x: 10, y: 20 }, { x: 30, y: 40 }];
    const origX0 = pts[0].x;
    applyJitter(pts, 2.0);
    expect(pts[0].x).toBe(origX0);
  });

  it('jitterAmount=0 produces no noise', () => {
    const pts: Point[] = [
      { x: 100, y: 100 }, { x: 150, y: 150 }, { x: 200, y: 100 }
    ];
    const result = applyJitter(pts, 0);
    for (let i = 0; i < pts.length; i++) {
      expect(result[i].x).toBe(pts[i].x);
      expect(result[i].y).toBe(pts[i].y);
    }
  });

  it('jitterAmount=3.0 produces bounded output (not flying off screen)', () => {
    const pts: Point[] = Array.from({ length: 50 }, () => ({ x: 128, y: 128 }));
    const result = applyJitter(pts, 3.0, 0.8);

    // Even with max jitter, points should stay within reasonable bounds
    for (const pt of result) {
      expect(Math.abs(pt.x - 128)).toBeLessThan(30); // 3.0 * 0.8 * ~6σ ≈ 14px max
      expect(Math.abs(pt.y - 128)).toBeLessThan(30);
    }
  });

  it('all output coordinates are finite numbers', () => {
    const pts: Point[] = Array.from({ length: 30 }, (_, i) => ({
      x: Math.sin(i) * 50 + 128,
      y: Math.cos(i) * 50 + 128,
    }));
    const result = applyJitter(pts, 1.5);
    for (const pt of result) {
      expect(Number.isFinite(pt.x)).toBe(true);
      expect(Number.isFinite(pt.y)).toBe(true);
    }
  });
});
