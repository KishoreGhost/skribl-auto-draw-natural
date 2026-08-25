/**
 * Background Service Worker
 *
 * Handles:
 * - GET_SETTINGS / UPDATE_SETTINGS via chrome.storage.sync
 * - GET_STATUS / CANCEL_DRAW
 * - WORD_DETECTED from content script
 * - DRAW_STATUS_UPDATE from content script
 * - TRIGGER_DRAW relay to content tab (for auto-start)
 */

import type {
  ExtensionSettings,
  DrawingStatus,
  StatusResponse,
  QuickDrawSketch,
} from '../types/index';
import { DEFAULT_SETTINGS } from '../types/index';
import { fetchDrawings } from '../data/quickdraw-fetcher';

// ─── Iconify (fallback image) fetch ───────────────────────────────────────────
// Used when a word has no QuickDraw sketch: fetch a real line-art icon for the
// word and convert its SVG paths into strokes. Runs here (with host_permissions)
// so it is exempt from CORS.

interface IconifyIcon {
  body: string;
}

async function fetchIcon(query: string): Promise<IconifyIcon | null> {
  if (!query) return null;
  const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(
    query
  )}&limit=1`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return null;
  const search = (await searchRes.json()) as { icons?: string[] };
  const icons = search.icons ?? [];
  if (icons.length === 0) return null;

  const iconId = icons[0]; // e.g. "mdi:cat"
  // The Iconify *data* (.json) endpoint is unreliable (returns 404 for valid
  // icons in many environments), but the *SVG* endpoint is stable. The search
  // id uses a ":" separator that must be converted to "/" for the SVG URL:
  //   "mdi:cat" -> "https://api.iconify.design/mdi/cat.svg"
  const [prefix, name] = iconId.split(':');
  if (!prefix || !name) return null;
  const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg`;
  const dataRes = await fetch(svgUrl);
  if (!dataRes.ok) return null;
  const svg = await dataRes.text();
  if (!svg || !svg.includes('<')) return null;
  return { body: svg };
}

// ─── In-memory state ──────────────────────────────────────────────────────────

let _currentStatus: DrawingStatus = 'idle';
let _currentWord: string | null = null;
let _currentProgress = 0;
let _activeTabId: number | null = null;

// ─── Settings helpers ─────────────────────────────────────────────────────────

async function getSettings(): Promise<ExtensionSettings> {
  const stored = await chrome.storage.sync.get(null);
  return {
    enabled: stored.enabled ?? DEFAULT_SETTINGS.enabled,
    speedMode: stored.speedMode ?? DEFAULT_SETTINGS.speedMode,
    autoStart: stored.autoStart ?? DEFAULT_SETTINGS.autoStart,
    jitterAmount: stored.jitterAmount ?? DEFAULT_SETTINGS.jitterAmount,
    variantIndex: stored.variantIndex ?? DEFAULT_SETTINGS.variantIndex,
  };
}

async function saveSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.sync.set(settings);
}

// ─── Message handler ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    // Identify the sending tab (content script messages)
    if (sender.tab?.id) {
      _activeTabId = sender.tab.id;
    }

    switch (message.type) {

      // ── Popup: GET_SETTINGS ──
      case 'GET_SETTINGS': {
        getSettings().then(settings => sendResponse(settings));
        return true; // async
      }

      // ── Popup: UPDATE_SETTINGS ──
      case 'UPDATE_SETTINGS': {
        saveSettings(message.settings as ExtensionSettings)
          .then(() => sendResponse({ ok: true }))
          .catch(err => sendResponse({ ok: false, error: String(err) }));
        return true; // async
      }

      // ── Popup: GET_STATUS ──
      case 'GET_STATUS': {
        const response: StatusResponse = {
          status: _currentStatus,
          word: _currentWord ?? undefined,
          progress: _currentProgress,
        };
        sendResponse(response);
        return false;
      }

      // ── Popup: CANCEL_DRAW ──
      case 'CANCEL_DRAW': {
        _currentStatus = 'cancelled';
        if (_activeTabId !== null) {
          chrome.tabs.sendMessage(_activeTabId, { type: 'TRIGGER_CANCEL' })
            .catch(() => { /* tab may not be ready */ });
        }
        sendResponse({ ok: true });
        return false;
      }

      // ── Content: WORD_DETECTED ──
      case 'WORD_DETECTED': {
        _currentWord = message.word as string;
        _currentStatus = 'word_detected';
        _currentProgress = 0;

        // Auto-start is handled directly by the content script (it must await
        // the async QuickDraw fetch before drawing), so no relay is needed here.
        sendResponse({ ok: true });
        return false;
      }

      // ── Content: FETCH_DRAWINGS ──
      // The real network fetch is done here in the service worker because it
      // holds the `storage.googleapis.com` host permission and is exempt from
      // CORS (a content-script fetch would be blocked by GCS).
      case 'FETCH_DRAWINGS': {
        const category = message.category as string;
        fetchDrawings(category)
          .then((sketches: QuickDrawSketch[]) => sendResponse(sketches))
          .catch((err: unknown) => {
            console.error('[SkribblAutoDraw] Fetch failed in background:', err);
            sendResponse([]);
          });
        return true; // async
      }

      // ── Content: FETCH_ICON ──
      // Fallback image source: fetch a real line-art icon for an unknown word
      // from Iconify (CORS-exempt here) and return its SVG path body.
      case 'FETCH_ICON': {
        const query = String(message.query ?? '');
        fetchIcon(query)
          .then((icon: IconifyIcon | null) => sendResponse(icon))
          .catch((err: unknown) => {
            console.error('[SkribblAutoDraw] Icon fetch failed in background:', err);
            sendResponse(null);
          });
        return true; // async
      }

      // ── Content: DRAW_STATUS_UPDATE ──
      case 'DRAW_STATUS_UPDATE': {
        _currentStatus = message.status as DrawingStatus;
        _currentProgress = message.progress as number;
        if (message.status === 'complete' || message.status === 'cancelled' || message.status === 'error') {
          // Reset after a short delay so popup can read the final status
          setTimeout(() => {
            _currentStatus = 'idle';
            _currentProgress = 0;
            _currentWord = null;
          }, 3000);
        }
        sendResponse({ ok: true });
        return false;
      }

      default:
        sendResponse({ ok: false, error: 'Unknown message type' });
        return false;
    }
  }
);

// ─── Install handler ──────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(async () => {
  // Initialize default settings if not already set
  const existing = await chrome.storage.sync.get(null);
  if (Object.keys(existing).length === 0) {
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
  }
  console.log('[SkribblAutoDraw] Service worker installed');
});

console.log('[SkribblAutoDraw] Service worker loaded');
