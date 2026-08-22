# Manual Testing Guide: Skribbl.io Natural AutoDraw Extension

**Date**: 2026-08-22  
**Version**: 1.0.0

---

## Setup

```bash
npm install
npm run build
```

Load `dist/` folder in Chrome: `chrome://extensions/` → Developer mode → Load unpacked → select `dist/`

---

## Scenario 1: Word Detection ✓

**Goal**: Extension detects drawing word within 500ms.

**Steps**:
1. Navigate to `https://skribbl.io`, create private room, start solo game.
2. Choose a word (pick one from the dictionary, e.g. "cat").
3. Open DevTools → Console.

**Expected**:
```
[SkribblAutoDraw] content script loaded
[SkribblAutoDraw] injected script ready
[SkribblAutoDraw] Drawing turn detected. Word: "cat"
```
- "Draw for me" ✏️ button appears bottom-right within ~1s.
- Status in popup: `Word detected "cat"`.

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 2: Natural Drawing Execution ✓

**Goal**: Drawing looks smooth and human-like.

**Steps**:
1. With drawing turn active and overlay button visible, click "✏️ Draw for me".
2. Observe canvas closely.

**Expected**:
- Drawing begins within 1–2 seconds.
- Strokes are **smooth curves** (not jagged straight lines).
- Speed **varies**: slower at curve peaks, faster on straight runs.
- Slight **hand-tremor jitter** visible on close inspection.
- Pen **lifts between strokes** with brief pause (100–400ms).
- Popup status shows: `Drawing… "cat"` with animated dot.
- Console: `[SkribblAutoDraw] Drawing complete: "cat" in 5432ms`

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 3: Speed Presets ✓

**Goal**: Three speed modes produce noticeably different drawing speeds.

**Steps**:
1. Open popup, set speed → **Slow**. Start round, click draw. Time completion.
2. Repeat with **Medium**.
3. Repeat with **Fast**.

**Expected timing** (5-stroke sketch):
| Speed | Approximate Duration |
|-------|---------------------|
| Slow  | 10–20 seconds       |
| Medium| 4–8 seconds         |
| Fast  | 1–3 seconds         |

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 4: Cancel Mid-Draw ✓

**Goal**: User can cancel drawing mid-stroke cleanly.

**Steps**:
1. Start drawing (medium speed, multi-stroke word like "cat").
2. While actively drawing (strokes in progress), open popup, click **✕ Cancel Drawing**.

**Expected**:
- Drawing **immediately stops** — no further pointer events dispatched.
- Canvas retains strokes drawn so far.
- Popup status changes to: `Cancelled`.
- No console errors.
- No "ghost" pen-down state left (canvas usable normally).

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 5: Unknown Word Graceful Fallback ✓

**Goal**: Extension silently does nothing for words not in dictionary.

**Steps**:
1. In Skribbl.io, ensure you pick a word NOT in the dictionary (e.g., "skateboard", "ambulance").
2. Observe.

**Expected**:
- NO "Draw for me" button appears.
- Console logs: `[SkribblAutoDraw] Word "skateboard" not found in dictionary.`
- Popup status stays: `Idle`.
- No errors in console.

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 6: Auto-Start Mode ✓

**Goal**: Drawing begins automatically without button click.

**Steps**:
1. Open popup → enable **🚀 Auto-Start** toggle.
2. Start a drawing round with a dictionary word.

**Expected**:
- Drawing begins automatically within ~1 second of word detection.
- No "Draw for me" button appears.
- Console: `[SkribblAutoDraw] Drawing turn detected. Word: "cat"` immediately followed by drawing progress.

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Scenario 7: Settings Persistence ✓

**Goal**: Settings survive extension/browser reload.

**Steps**:
1. Open popup → set: Speed = **Fast**, Auto-Start = **ON**, Tremor = **0.5**.
2. Close Chrome completely.
3. Reopen Chrome, navigate to `skribbl.io`, open popup.

**Expected**:
- Speed button **Fast** is highlighted.
- Auto-Start toggle is **ON**.
- Tremor slider shows **0.5**.
- All settings exactly match what was configured.

**Pass**: [ ] | **Fail**: [ ] | **Notes**: ___

---

## Known Limitations (v1.0)

| Limitation | Impact |
|-----------|--------|
| ~35 word dictionary | Words outside list show no button |
| Canvas selector hardcoded | May break if Skribbl.io updates DOM |
| Drawing color always black | No color matching |
| No multi-variant selection UI | Uses random variant by default |

---

## Checklist Summary

| Scenario | Status |
|----------|--------|
| 1. Word Detection | [ ] |
| 2. Natural Drawing | [ ] |
| 3. Speed Presets | [ ] |
| 4. Cancel Mid-Draw | [ ] |
| 5. Unknown Word | [ ] |
| 6. Auto-Start | [ ] |
| 7. Settings Persistence | [ ] |
