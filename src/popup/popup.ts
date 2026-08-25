/**
 * Popup Logic
 *
 * - Loads settings via GET_SETTINGS on startup
 * - Polls drawing status via GET_STATUS every 1s
 * - Sends UPDATE_SETTINGS on any control change
 * - Sends CANCEL_DRAW on cancel button click
 */

import type { ExtensionSettings, DrawingStatus, StatusResponse } from '../types/index';
import { getDictionarySize } from '../data/dictionary';

// ─── DOM references ───────────────────────────────────────────

const toggleEnabled = document.getElementById('toggle-enabled') as HTMLInputElement;
const toggleAutostart = document.getElementById('toggle-autostart') as HTMLInputElement;
const speedButtons = document.querySelectorAll<HTMLButtonElement>('.speed-btn');
const sliderJitter = document.getElementById('slider-jitter') as HTMLInputElement;
const jitterValue = document.getElementById('jitter-value') as HTMLSpanElement;
const statusDot = document.getElementById('status-dot') as HTMLSpanElement;
const statusText = document.getElementById('status-text') as HTMLSpanElement;
const statusWord = document.getElementById('status-word') as HTMLSpanElement;
const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;
const popupBody = document.getElementById('popup-body') as HTMLElement;
const dictSize = document.getElementById('dict-size') as HTMLSpanElement;

// ─── Local state ──────────────────────────────────────────────

let _settings: ExtensionSettings = {
  enabled: true,
  speedMode: 'medium',
  autoStart: false,
  jitterAmount: 1.0,
  variantIndex: 'random',
};
let _statusPollInterval: ReturnType<typeof setInterval> | null = null;

// ─── Messaging ─────────────────────────────────────────────────

function sendMessage<T>(message: unknown): Promise<T> {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(message, resolve);
  });
}

async function loadSettings(): Promise<void> {
  const settings = await sendMessage<ExtensionSettings>({ type: 'GET_SETTINGS' });
  _settings = settings;
  renderSettings();
}

async function saveSettings(): Promise<void> {
  await sendMessage({ type: 'UPDATE_SETTINGS', settings: _settings });
}

async function fetchStatus(): Promise<StatusResponse> {
  return sendMessage<StatusResponse>({ type: 'GET_STATUS' });
}

// ─── Rendering ─────────────────────────────────────────────────

function renderSettings(): void {
  toggleEnabled.checked = _settings.enabled;
  toggleAutostart.checked = _settings.autoStart;
  sliderJitter.value = String(_settings.jitterAmount);
  jitterValue.textContent = _settings.jitterAmount.toFixed(1);

  // Speed buttons
  speedButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.speed === _settings.speedMode);
  });

  // Dim body when disabled
  popupBody.classList.toggle('disabled', !_settings.enabled);
}

const STATUS_LABELS: Record<DrawingStatus, string> = {
  idle: 'Idle',
  word_detected: 'Fetching drawing data…',
  sketch_loaded: 'Sketch ready',
  animating: 'Drawing…',
  complete: 'Complete!',
  cancelled: 'Cancelled',
  error: 'Error',
};

function renderStatus(response: StatusResponse): void {
  const status = response.status ?? 'idle';
  const label = STATUS_LABELS[status] ?? status;

  statusText.textContent = label;
  statusDot.className = 'status-dot ' + status;

  if (response.word && status !== 'idle') {
    statusWord.textContent = `"${response.word}"`;
  } else {
    statusWord.textContent = '';
  }

  // Enable/disable cancel button
  const canCancel = status === 'animating' || status === 'word_detected' || status === 'sketch_loaded';
  btnCancel.disabled = !canCancel;
  btnCancel.classList.toggle('active', canCancel);
}

// ─── Event handlers ────────────────────────────────────────────

toggleEnabled.addEventListener('change', () => {
  _settings.enabled = toggleEnabled.checked;
  popupBody.classList.toggle('disabled', !_settings.enabled);
  saveSettings();
});

toggleAutostart.addEventListener('change', () => {
  _settings.autoStart = toggleAutostart.checked;
  saveSettings();
});

speedButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const speed = btn.dataset.speed as ExtensionSettings['speedMode'];
    if (!speed) return;
    _settings.speedMode = speed;
    speedButtons.forEach(b => b.classList.toggle('active', b === btn));
    saveSettings();
  });
});

sliderJitter.addEventListener('input', () => {
  const val = parseFloat(sliderJitter.value);
  _settings.jitterAmount = val;
  jitterValue.textContent = val.toFixed(1);
  saveSettings();
});

btnCancel.addEventListener('click', async () => {
  await sendMessage({ type: 'CANCEL_DRAW' });
  renderStatus({ status: 'cancelled' });
});

// ─── Status polling ────────────────────────────────────────────

function startStatusPolling(): void {
  // Immediate fetch
  fetchStatus().then(renderStatus).catch(() => { /* ignore */ });

  // Poll every 1s
  _statusPollInterval = setInterval(() => {
    fetchStatus().then(renderStatus).catch(() => { /* ignore */ });
  }, 1000);
}

function stopStatusPolling(): void {
  if (_statusPollInterval) {
    clearInterval(_statusPollInterval);
    _statusPollInterval = null;
  }
}

// Stop polling when popup is closed
window.addEventListener('unload', stopStatusPolling);

// ─── Dictionary size ───────────────────────────────────────────

function renderDictSize(): void {
  const size = getDictionarySize();
  dictSize.textContent = `Any word · ${size} sketches`;
}

// ─── Initialize ───────────────────────────────────────────────

(async () => {
  await loadSettings();
  renderDictSize();
  startStatusPolling();
})();
