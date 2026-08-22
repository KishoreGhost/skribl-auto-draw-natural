/**
 * Catmull-Rom spline interpolation
 *
 * Converts raw polyline points into smooth, naturally-curved paths.
 * Uses centripetal (alpha=0.5) parameterization to avoid cusps and
 * produce the most visually natural curves.
 *
 * Reference: Catmull & Rom (1974), centripetal variant per Barry & Goldman (1988).
 */

import type { Point } from '../types/index';

// ─── Configuration ────────────────────────────────────────────────────────────

/** Number of interpolated points to generate between each pair of control points */
const POINTS_PER_SEGMENT = 10;

/** Centripetal parameterization exponent (0=uniform, 0.5=centripetal, 1=chordal) */
const ALPHA = 0.5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute the Catmull-Rom tj parameter (time increment between control points).
 * Using alpha=0.5 gives centripetal parameterization.
 */
function tjCatmullRom(ti: number, p0: Point, p1: Point, alpha: number): number {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const distSquared = dx * dx + dy * dy;
  // t_{i+1} = t_i + dist^alpha
  const dist = Math.pow(distSquared, alpha / 2);
  // Guard against zero-length segments (duplicate points)
  return dist < 1e-8 ? ti + 1e-4 : ti + dist;
}

/**
 * Evaluate a point on a Catmull-Rom segment defined by four control points.
 * Uses the Barry-Goldman algorithm for centripetal parameterization.
 */
function catmullRomPoint(
  p0: Point, p1: Point, p2: Point, p3: Point,
  t: number,
  t0: number, t1: number, t2: number, t3: number
): Point {
  // Level 1
  const l01 = t1 - t0 < 1e-8 ? 0 : (t - t0) / (t1 - t0);
  const l12 = t2 - t1 < 1e-8 ? 0 : (t - t1) / (t2 - t1);
  const l23 = t3 - t2 < 1e-8 ? 0 : (t - t2) / (t3 - t2);

  const a1: Point = {
    x: (1 - l01) * p0.x + l01 * p1.x,
    y: (1 - l01) * p0.y + l01 * p1.y,
  };
  const a2: Point = {
    x: (1 - l12) * p1.x + l12 * p2.x,
    y: (1 - l12) * p1.y + l12 * p2.y,
  };
  const a3: Point = {
    x: (1 - l23) * p2.x + l23 * p3.x,
    y: (1 - l23) * p2.y + l23 * p3.y,
  };

  // Level 2
  const l012 = t2 - t0 < 1e-8 ? 0 : (t - t0) / (t2 - t0);
  const l123 = t3 - t1 < 1e-8 ? 0 : (t - t1) / (t3 - t1);

  const b1: Point = {
    x: (1 - l012) * a1.x + l012 * a2.x,
    y: (1 - l012) * a1.y + l012 * a2.y,
  };
  const b2: Point = {
    x: (1 - l123) * a2.x + l123 * a3.x,
    y: (1 - l123) * a2.y + l123 * a3.y,
  };

  // Level 3
  const l0123 = t2 - t1 < 1e-8 ? 0 : (t - t1) / (t2 - t1);

  return {
    x: (1 - l0123) * b1.x + l0123 * b2.x,
    y: (1 - l0123) * b1.y + l0123 * b2.y,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compute a smooth Catmull-Rom spline through the given control points.
 *
 * For N input points, generates approximately N × pointsPerSegment output points.
 * If there are fewer than 2 input points, returns the input unchanged.
 *
 * @param points - Array of raw control points (stroke coordinates)
 * @param pointsPerSegment - How many interpolated points to insert per segment
 * @param alpha - Parameterization: 0=uniform, 0.5=centripetal, 1=chordal
 * @returns Smoothed array of interpolated points
 */
export function catmullRomSpline(
  points: Point[],
  pointsPerSegment: number = POINTS_PER_SEGMENT,
  alpha: number = ALPHA
): Point[] {
  if (points.length < 2) return [...points];
  if (points.length === 2) {
    // Linear interpolation for 2-point strokes
    const result: Point[] = [];
    for (let i = 0; i <= pointsPerSegment; i++) {
      const t = i / pointsPerSegment;
      result.push({
        x: points[0].x + t * (points[1].x - points[0].x),
        y: points[0].y + t * (points[1].y - points[0].y),
      });
    }
    return result;
  }

  // Extend the point array with phantom endpoints for boundary tangents
  // Mirror the first and last segments
  const extended: Point[] = [
    {
      x: 2 * points[0].x - points[1].x,
      y: 2 * points[0].y - points[1].y,
    },
    ...points,
    {
      x: 2 * points[points.length - 1].x - points[points.length - 2].x,
      y: 2 * points[points.length - 1].y - points[points.length - 2].y,
    },
  ];

  // Precompute t-parameters for all extended points
  const ts: number[] = new Array(extended.length);
  ts[0] = 0;
  for (let i = 1; i < extended.length; i++) {
    ts[i] = tjCatmullRom(ts[i - 1], extended[i - 1], extended[i], alpha);
  }

  const result: Point[] = [];

  // Iterate over each segment in the original points (indices 1..N-2 in extended)
  for (let i = 1; i < extended.length - 2; i++) {
    const p0 = extended[i - 1];
    const p1 = extended[i];
    const p2 = extended[i + 1];
    const p3 = extended[i + 2];

    const t0 = ts[i - 1];
    const t1 = ts[i];
    const t2 = ts[i + 1];
    const t3 = ts[i + 2];

    // Include the start point of the first segment only
    const startIndex = i === 1 ? 0 : 1;
    const endIndex = pointsPerSegment;

    for (let j = startIndex; j <= endIndex; j++) {
      const t = t1 + (j / pointsPerSegment) * (t2 - t1);
      result.push(catmullRomPoint(p0, p1, p2, p3, t, t0, t1, t2, t3));
    }
  }

  return result;
}

/**
 * Compute local curvature magnitude at each point in an array.
 * Uses the cross-product of consecutive difference vectors.
 * Returns values in [0, 1] range where 1 = sharpest curve.
 */
export function computeCurvature(points: Point[]): number[] {
  if (points.length < 3) return points.map(() => 0);

  const curvatures: number[] = new Array(points.length).fill(0);

  for (let i = 1; i < points.length - 1; i++) {
    const dx1 = points[i].x - points[i - 1].x;
    const dy1 = points[i].y - points[i - 1].y;
    const dx2 = points[i + 1].x - points[i].x;
    const dy2 = points[i + 1].y - points[i].y;

    // Cross product magnitude = |v1 × v2| = |dx1*dy2 - dy1*dx2|
    const cross = Math.abs(dx1 * dy2 - dy1 * dx2);
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1) + 1e-8;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) + 1e-8;

    // Normalize: sin(angle between segments) ∈ [0, 1]
    curvatures[i] = Math.min(1, cross / (len1 * len2));
  }

  // Propagate to endpoints
  curvatures[0] = curvatures[1];
  curvatures[curvatures.length - 1] = curvatures[curvatures.length - 2];

  return curvatures;
}
