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
} from '../types/index';
import { DEFAULT_SETTINGS } from '../types/index';

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

        // Check auto-start setting and relay TRIGGER_DRAW if enabled
        getSettings().then(settings => {
          if (settings.autoStart && settings.enabled && sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
              type: 'TRIGGER_DRAW',
              word: message.word,
            }).catch(() => { /* tab may not be ready */ });
          }
        });

        sendResponse({ ok: true });
        return true; // async (getSettings is async)
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
