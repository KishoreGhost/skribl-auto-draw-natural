/**
 * Content Script (Isolated World)
 *
 * Responsibilities:
 * 1. Observe the DOM for drawing-turn detection via MutationObserver
 * 2. Read #currentWord when drawing turn is detected
 * 3. Inject the injected.js main-world script once
 * 4. Bridge postMessages (injected ↔ content) and chrome.runtime (content ↔ background)
 * 5. Inject / remove the "Draw for me" overlay button
 */

import type {
  ExtensionSettings,
  QuickDrawSketch,
} from '../types/index';
import { getSketch } from '../data/dictionary';
import { getStrokeColors } from '../lib/color-engine';
import { textToStrokes } from '../lib/text-to-strokes';
import { fetchIconSketch } from '../lib/icon-strokes';

console.log('[SkribblAutoDraw] content script loaded');

// ─── State ────────────────────────────────────────────────────────────────────

let _injected = false;
let _currentWord: string | null = null;
let _currentSketch: QuickDrawSketch | null = null;
let _currentColors: string[] | null = null;
let _isDrawingTurn = false;
let _overlayButton: HTMLButtonElement | null = null;
let _settings: ExtensionSettings | null = null;
let _observer: MutationObserver | null = null;

// ─── Settings fetch ───────────────────────────────────────────────────────────

async function fetchSettings(): Promise<ExtensionSettings> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, response => {
      _settings = response;
      resolve(response);
    });
  });
}

// ─── Injected script injection ────────────────────────────────────────────────

function injectMainWorldScript(): void {
  if (_injected) return;
  _injected = true;

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected/injected.js');
  script.type = 'module';
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

  console.log('[SkribblAutoDraw] injected script loaded');
}

// ─── Transient toast (explains why a word didn't draw) ─────────────────────────

function showToast(message: string, kind: 'error' | 'info' = 'error'): void {
  const el = document.createElement('div');
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '99999',
    padding: '10px 16px',
    background: kind === 'error' ? 'rgba(220, 38, 38, 0.95)' : 'rgba(40, 40, 60, 0.95)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'default',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    userSelect: 'none',
    maxWidth: '80vw',
    textAlign: 'center',
  } as CSSStyleDeclaration);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// ─── Overlay button ───────────────────────────────────────────────────────────

function createOverlayButton(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = 'skribbl-autodraw-btn';
  btn.textContent = '✏️ Draw for me';
  btn.title = 'SkribblAutoDraw: Click to auto-draw this word';

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: '99999',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: 'system-ui, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.5)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    userSelect: 'none',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px)';
    btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.7)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.5)';
  });

  btn.addEventListener('click', () => {
    triggerDraw();
  });

  return btn;
}

function showOverlayButton(): void {
  if (_overlayButton) return;
  _overlayButton = createOverlayButton();
  document.body.appendChild(_overlayButton);
}

function removeOverlayButton(): void {
  if (_overlayButton) {
    _overlayButton.remove();
    _overlayButton = null;
  }
}

// ─── Drawing trigger ──────────────────────────────────────────────────────────

function triggerDraw(): void {
  if (!_currentSketch || !_settings) return;

  removeOverlayButton();

  // Send SKRIBBL_AUTODRAW_START to injected script via window.postMessage
  window.postMessage(
    {
      type: 'SKRIBBL_AUTODRAW_START',
      sketch: _currentSketch,
      settings: {
        speedMode: _settings.speedMode,
        jitterAmount: _settings.jitterAmount,
      },
      colors: _currentColors ?? undefined,
    },
    '*'
  );

  // Notify background of status
  chrome.runtime.sendMessage({
    type: 'DRAW_STATUS_UPDATE',
    status: 'animating',
    progress: 0,
  });
}

// ─── Drawing turn detection ───────────────────────────────────────────────────

function isCurrentlyDrawingTurn(): boolean {
  // Skribbl.io sets #game-word .description to "DRAW THIS" when it's your turn to draw
  const descEl = document.querySelector('#game-word .description');
  if (!descEl) return false;
  return descEl.textContent?.trim().toUpperCase() === 'DRAW THIS';
}

function getCurrentWord(): string | null {
  // The full word is shown in #game-word .word only when you are the drawer
  const wordEl = document.querySelector('#game-word .word');
  return wordEl?.textContent?.trim() ?? null;
}

async function onDrawingTurnStart(): Promise<void> {
  const settings = await fetchSettings();
  if (!settings.enabled) return;

  const word = getCurrentWord();
  if (!word) return;

  _currentWord = word;

  console.log(`[SkribblAutoDraw] Drawing turn detected. Word: "${word}"`);

  // Notify background
  chrome.runtime.sendMessage({ type: 'WORD_DETECTED', word });

  // Report "fetching" status while we resolve drawing data (may hit network)
  chrome.runtime.sendMessage({
    type: 'DRAW_STATUS_UPDATE',
    status: 'word_detected',
    progress: 0,
  });

  // Try a real QuickDraw sketch; if none is available, fall back to writing
  // the word itself as text so we never refuse to draw.
  let sketch = await getSketch(word, settings.variantIndex);
  let colors: string[] | undefined;

  if (sketch) {
    _currentSketch = sketch;
    _currentColors = getStrokeColors(word, sketch.strokes.length);
  } else {
    // No QuickDraw data — try to draw a real image of the word via the Iconify
    // API, then fall back to writing the word as text only if that fails.
    console.log(`[SkribblAutoDraw] No sketch data for "${word}" — trying icon API...`);
    let iconSketch: QuickDrawSketch | null = null;
    try {
      iconSketch = await fetchIconSketch(word);
    } catch (err) {
      console.error('[SkribblAutoDraw] Icon fallback failed:', err);
    }

    if (iconSketch && iconSketch.strokes.length > 0) {
      sketch = iconSketch;
      _currentSketch = sketch;
      _currentColors = undefined; // icons are single-color; use current pen
      showToast(`Drawing "${word}" from icon`, 'info');
    } else {
      console.log(`[SkribblAutoDraw] No icon found for "${word}" — writing as text.`);
      sketch = textToStrokes(word);
      _currentSketch = sketch;
      _currentColors = undefined;
      showToast(`Drawing "${word}" as text (no image found)`, 'info');
    }
  }

  // Ensure injected script is loaded
  injectMainWorldScript();

  // Report sketch ready
  chrome.runtime.sendMessage({
    type: 'DRAW_STATUS_UPDATE',
    status: 'sketch_loaded',
    progress: 0,
  });

  if (settings.autoStart) {
    // Short delay to let injected script initialize
    setTimeout(() => triggerDraw(), 500);
  } else {
    showOverlayButton();
  }
}

function onDrawingTurnEnd(): void {
  _isDrawingTurn = false;
  _currentWord = null;
  _currentSketch = null;
  removeOverlayButton();

  window.postMessage({ type: 'SKRIBBL_AUTODRAW_CANCEL' }, '*');

  chrome.runtime.sendMessage({
    type: 'DRAW_STATUS_UPDATE',
    status: 'idle',
    progress: 0,
  });
}

// ─── MutationObserver setup ───────────────────────────────────────────────────

function setupObserver(): void {
  // Observe #game-word specifically — this is what changes when turn state updates
  const wordContainer = document.getElementById('game-word');
  const target = wordContainer ?? document.getElementById('game-wrapper') ?? document.body;

  _observer = new MutationObserver(() => {
    const nowDrawing = isCurrentlyDrawingTurn();

    if (nowDrawing && !_isDrawingTurn) {
      _isDrawingTurn = true;
      onDrawingTurnStart();
    } else if (!nowDrawing && _isDrawingTurn) {
      onDrawingTurnEnd();
    }
  });

  _observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  // Do an immediate check in case we loaded mid-turn
  if (isCurrentlyDrawingTurn() && !_isDrawingTurn) {
    _isDrawingTurn = true;
    onDrawingTurnStart();
  }
}

// ─── Listen for messages from injected script ─────────────────────────────────

window.addEventListener('message', event => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg?.type?.startsWith('SKRIBBL_AUTODRAW_')) return;

  switch (msg.type) {
    case 'SKRIBBL_AUTODRAW_STATUS':
      chrome.runtime.sendMessage({
        type: 'DRAW_STATUS_UPDATE',
        status: 'animating',
        progress: msg.progress,
      });
      break;

    case 'SKRIBBL_AUTODRAW_COMPLETE':
      chrome.runtime.sendMessage({
        type: 'DRAW_STATUS_UPDATE',
        status: 'complete',
        progress: 1,
      });
      break;

    case 'SKRIBBL_AUTODRAW_ERROR':
      chrome.runtime.sendMessage({
        type: 'DRAW_STATUS_UPDATE',
        status: 'error',
        progress: 0,
      });
      console.error(`[SkribblAutoDraw] Error from injected: ${msg.code} — ${msg.message}`);
      break;
  }
});

// ─── Listen for messages from background ─────────────────────────────────────

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
    case 'TRIGGER_DRAW':
      triggerDraw();
      break;
    case 'TRIGGER_CANCEL':
      window.postMessage({ type: 'SKRIBBL_AUTODRAW_CANCEL' }, '*');
      break;
  }
});

// ─── Initialize ───────────────────────────────────────────────────────────────

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupObserver);
} else {
  setupObserver();
}
