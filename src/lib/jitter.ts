/**
 * Gaussian jitter / hand-tremor simulation
 *
 * Applies stochastic noise to drawing points to mimic natural hand tremor.
 * Uses the Box-Muller transform to generate Gaussian-distributed offsets.
 *
 * Sigma is scaled by jitterAmount setting (0.0 = no jitter, 3.0 = heavy tremor).
 * Base sigma ≈ 0.8px in 255-unit sketch space; scaled to canvas coords externally.
 */

import type { Point } from '../types/index';

// ─── Box-Muller Transform ─────────────────────────────────────────────────────

/**
 * Generate a Gaussian random number with mean 0 and standard deviation 1
 * using the Box-Muller transform.
 *
 * This is called frequently (per drawing point), so we cache the second
 * value from each pair using the "spare" technique.
 */
let _boxMullerSpare: number | null = null;
let _boxMullerHasSpare = false;

export function gaussianRandom(): number {
  if (_boxMullerHasSpare) {
    _boxMullerHasSpare = false;
    return _boxMullerSpare!;
  }

  let u: number, v: number, s: number;
  do {
    u = Math.random() * 2 - 1; // uniform in (-1, 1)
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);

  const mul = Math.sqrt(-2 * Math.log(s) / s);
  _boxMullerSpare = v * mul;
  _boxMullerHasSpare = true;

  return u * mul;
}

/**
 * Reset the Box-Muller internal state.
 * Useful before starting a new drawing session for reproducibility in tests.
 */
export function resetJitterState(): void {
  _boxMullerHasSpare = false;
  _boxMullerSpare = null;
}

// ─── Jitter Application ───────────────────────────────────────────────────────

/**
 * Base sigma in QuickDraw coordinate space (0–255).
 * Corresponds to ~0.8px tremor on a standard human hand.
 */
const BASE_SIGMA = 0.8;

/**
 * Apply Gaussian jitter noise to a single point.
 *
 * @param point - The point to jitter
 * @param jitterAmount - Multiplier on tremor noise (0.0–3.0 from settings)
 * @param sigma - Base sigma in coordinate units (default BASE_SIGMA)
 * @returns A new point with noise applied
 */
export function jitterPoint(
  point: Point,
  jitterAmount: number,
  sigma: number = BASE_SIGMA
): Point {
  if (jitterAmount <= 0) return { ...point };

  const effectiveSigma = sigma * jitterAmount;
  return {
    x: point.x + gaussianRandom() * effectiveSigma,
    y: point.y + gaussianRandom() * effectiveSigma,
  };
}

/**
 * Apply Gaussian jitter to an array of points.
 *
 * The jitter is spatially correlated — consecutive points share a "drift"
 * component so the noise looks like continuous hand tremor rather than
 * random pixel scatter. Drift decays with a time constant of ~5 points.
 *
 * @param points - Array of points to jitter (not mutated)
 * @param jitterAmount - Multiplier on tremor noise (0.0–3.0)
 * @param sigma - Base sigma in coordinate units
 * @returns New array of jittered points
 */
export function applyJitter(
  points: Point[],
  jitterAmount: number,
  sigma: number = BASE_SIGMA
): Point[] {
  if (jitterAmount <= 0 || points.length === 0) {
    return points.map(p => ({ ...p }));
  }

  const effectiveSigma = sigma * jitterAmount;
  const DRIFT_DECAY = 0.85; // exponential decay factor for correlated drift

  let driftX = gaussianRandom() * effectiveSigma * 0.5;
  let driftY = gaussianRandom() * effectiveSigma * 0.5;

  return points.map(point => {
    // Apply tremor: new Gaussian offset + decayed drift
    const noiseX = gaussianRandom() * effectiveSigma * 0.6;
    const noiseY = gaussianRandom() * effectiveSigma * 0.6;

    driftX = driftX * DRIFT_DECAY + noiseX * (1 - DRIFT_DECAY);
    driftY = driftY * DRIFT_DECAY + noiseY * (1 - DRIFT_DECAY);

    return {
      x: point.x + driftX + noiseX,
      y: point.y + driftY + noiseY,
    };
  });
}
