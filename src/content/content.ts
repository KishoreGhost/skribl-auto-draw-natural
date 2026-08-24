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
import { getSketch, hasWord, normalizeWord } from '../data/dictionary';

console.log('[SkribblAutoDraw] content script loaded');

// ─── State ────────────────────────────────────────────────────────────────────

let _injected = false;
let _currentWord: string | null = null;
let _currentSketch: QuickDrawSketch | null = null;
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
  const normalized = normalizeWord(word);

  console.log(`[SkribblAutoDraw] Drawing turn detected. Word: "${word}"`);

  // Notify background
  chrome.runtime.sendMessage({ type: 'WORD_DETECTED', word });

  if (!hasWord(word)) {
    console.log(`[SkribblAutoDraw] Word "${word}" not found in dictionary.`);
    return;
  }

  // Load sketch
  _currentSketch = getSketch(word, settings.variantIndex);
  if (!_currentSketch) return;

  // Ensure injected script is loaded
  injectMainWorldScript();

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
