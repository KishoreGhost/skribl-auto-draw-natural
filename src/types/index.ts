/**
 * Shared TypeScript types for Skribbl.io Natural AutoDraw Extension
 */

// ─── Core Drawing Primitives ─────────────────────────────────────────────────

/** A 2D canvas coordinate in sketch space */
export interface Point {
  x: number;
  y: number;
}

/** Spatial extent of a sketch — used for scaling strokes to canvas size */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** A single continuous pen stroke (pen-down to pen-up) */
export interface Stroke {
  /** Raw [x, y] coordinate sequence from QuickDraw */
  points: Point[];
  /** Original draw duration in ms from dataset — used for speed scaling */
  duration: number;
}

// ─── QuickDraw Dataset ────────────────────────────────────────────────────────

/** A single hand-drawn sketch from the QuickDraw dataset */
export interface QuickDrawSketch {
  /** The word this sketch represents */
  word: string;
  /** Ordered array of strokes composing the drawing */
  strokes: Stroke[];
  /** Natural min/max extents of the sketch */
  boundingBox: BoundingBox;
  /** Which variant (0–N) among multiple stored sketches */
  variantIndex: number;
}

// ─── Animated Drawing ─────────────────────────────────────────────────────────

/** PointerEvent type for dispatching */
export type PointerEventType = 'pointerdown' | 'pointermove' | 'pointerup';

/** A single point in the animated drawing sequence, ready for PointerEvent dispatch */
export interface AnimatedPoint {
  /** Absolute client coordinate X for PointerEvent */
  clientX: number;
  /** Absolute client coordinate Y for PointerEvent */
  clientY: number;
  /** Time (ms) to wait before dispatching this point */
  delay: number;
  /** Which event to fire */
  eventType: PointerEventType;
}

/** The processed, ready-to-dispatch version of a stroke */
export interface AnimatedStroke {
  /** Smoothed, scaled, jitter-applied points */
  points: AnimatedPoint[];
  /** Which stroke in drawing order */
  strokeIndex: number;
}

// ─── Session & Status ─────────────────────────────────────────────────────────

/** Drawing session lifecycle states */
export type DrawingStatus =
  | 'idle'
  | 'word_detected'
  | 'sketch_loaded'
  | 'animating'
  | 'complete'
  | 'cancelled'
  | 'error';

/** The word chosen by the player for the current round */
export interface DrawingWord {
  /** The word text (e.g., "cat", "house") */
  text: string;
  /** Lowercased, trimmed key for dictionary lookup */
  normalizedKey: string;
  /** Timestamp (ms) when detected */
  detectedAt: number;
  /** Whether a QuickDraw sketch was found */
  hasMatch: boolean;
}

/** Tracks the lifecycle of one auto-drawing attempt within a round */
export interface DrawingSession {
  /** UUID for this session */
  sessionId: string;
  /** The word being drawn */
  word: DrawingWord;
  /** The chosen sketch */
  sketch: QuickDrawSketch;
  /** Current state */
  status: DrawingStatus;
  /** Timestamp when drawing started */
  startedAt: number | null;
  /** Timestamp when drawing finished */
  completedAt: number | null;
  /** Whether user cancelled mid-draw */
  cancelled: boolean;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

/** Drawing speed presets */
export type SpeedMode = 'slow' | 'medium' | 'fast';

/** Speed preset delay ranges (ms per point) */
export const SPEED_PRESETS: Record<SpeedMode, { min: number; max: number }> = {
  slow: { min: 35, max: 70 },
  medium: { min: 15, max: 35 },
  fast: { min: 5, max: 15 },
};

/** User-configurable preferences, persisted via chrome.storage.sync */
export interface ExtensionSettings {
  /** Master on/off switch */
  enabled: boolean;
  /** Drawing speed preset */
  speedMode: SpeedMode;
  /** Auto-begin drawing on word detection */
  autoStart: boolean;
  /** Multiplier on tremor noise (0.0–3.0) */
  jitterAmount: number;
  /** Which sketch variant to use */
  variantIndex: number | 'random';
}

/** Default extension settings */
export const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  speedMode: 'medium',
  autoStart: false,
  jitterAmount: 1.0,
  variantIndex: 'random',
};

// ─── Dictionary ───────────────────────────────────────────────────────────────

/** The bundled offline lookup table mapping words to QuickDraw sketches */
export interface WordDictionary {
  /** Dictionary version string (semver) */
  version: string;
  /** Map from normalized word → array of sketch variants */
  words: Record<string, QuickDrawSketch[]>;
  /** All supported words (for UI display) */
  categories: string[];
}

// ─── Messaging Contracts ──────────────────────────────────────────────────────

// Popup ↔ Background messages
export type PopupToBackgroundMessage =
  | { type: 'GET_SETTINGS' }
  | { type: 'UPDATE_SETTINGS'; settings: ExtensionSettings }
  | { type: 'GET_STATUS' }
  | { type: 'CANCEL_DRAW' };

export interface StatusResponse {
  status: DrawingStatus;
  word?: string;
  progress?: number;
}

// Content ↔ Background messages
export type ContentToBackgroundMessage =
  | { type: 'WORD_DETECTED'; word: string }
  | { type: 'DRAW_STATUS_UPDATE'; status: DrawingStatus; progress: number };

export type BackgroundToContentMessage =
  | { type: 'TRIGGER_DRAW'; word: string };

// Content ↔ Injected messages (window.postMessage)
export type ContentToInjectedMessage =
  | {
      type: 'SKRIBBL_AUTODRAW_START';
      sketch: QuickDrawSketch;
      settings: Pick<ExtensionSettings, 'speedMode' | 'jitterAmount'>;
    }
  | { type: 'SKRIBBL_AUTODRAW_CANCEL' };

export type InjectedToContentMessage =
  | {
      type: 'SKRIBBL_AUTODRAW_STATUS';
      status: string;
      strokeIndex: number;
      totalStrokes: number;
      progress: number;
    }
  | {
      type: 'SKRIBBL_AUTODRAW_COMPLETE';
      word: string;
      durationMs: number;
    }
  | {
      type: 'SKRIBBL_AUTODRAW_ERROR';
      code: 'CANVAS_NOT_FOUND' | 'NOT_YOUR_TURN' | 'DRAW_CANCELLED' | 'UNKNOWN';
      message: string;
    };
