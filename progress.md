Here's a comprehensive summary of everything we've done across this refactoring effort:

---

## 1. Immer Freeze Fix (`mediaRef` → `mediaElement`)

**Problem:** Zustand's Immer middleware calls `setAutoFreeze(false)` globally, which is a hack. The root cause was storing a `React.RefObject` (`mediaRef`) in the store — Immer tried to freeze the DOM element inside the ref, which fails.

**Fix:** Replaced `mediaRef: React.RefObject<HTMLMediaElement>` with `mediaElement: HTMLMediaElement | null` as a plain value. This let us remove the `setAutoFreeze(false)` call entirely. Immer can now freeze the store normally since it skips non-plain objects like DOM elements.

**Files changed:** `use-media.ts`, media-provider.tsx, and all consumers that read `mediaRef.current` → `mediaElement`.

---

## 2. Cleaned Up `any` Types in use-asset.ts

Removed loose `any` casts in the asset hook and replaced them with proper typed narrowing (e.g., `as unknown as PlayerStore` where cross-store access was needed).

---

## 3. Removed Redundant Helper Hooks

- **`usePlaylistStoreCurrentItem`** and **`usePlaylistStoreHasNext`** — these were thin wrappers around `usePlaylistStore(s => s.currentItem)` etc. Inlined at call sites.
- **`usePlayerAudioState`** — inlined as a plain `getHasAudio` function inside `VolumeSetup`.

---

## 4. Event Bridge System (Major)

### Problem
Every feature slice had `on*` callback fields (e.g., `onVolumeChange`, `onPause`, `onEnded`, `onPlaylistChange`) — 16 total across 8 hooks. Cross-feature communication was done by one hook directly writing into another hook's store (`api.setState` setting `playback.onEnded = ...`), creating tight coupling and a brittle wiring pattern.

### Solution: `MediaEventEmitter`

Built a centralized, typed event bus shared via React context.

**New types/classes in media-provider.tsx:**

| Symbol | Purpose |
|---|---|
| `MediaEvents<T>` | Interface with `emit`, `on`, `once` methods, all fully typed |
| `MediaEventSlice<T>` | Brand interface — marks a store slice with its event types so they merge via intersection |
| `MediaEventEmitter` | Class implementing `MediaEvents<T>` with `Map<string, Set<listener>>` internally |
| `mediaEventMap` | Private symbol used as the brand key |
| `EventArgs<T>` | Conditional type handling `void` payloads (no args), `any` detection (`0 extends 1 & T`), and normal payloads |
| `EventListener<T>` | `() => void` for void events, `(payload: T) => void` otherwise |
| `EventsFromStore<T>` | Extracts event types from a store via the brand |
| `useMediaEvents<T>()` | Hook to access the typed event emitter from context |

**Key design decisions:**
- `emit`, `on`, `once` are **arrow function class fields** (not prototype methods) so `this` is preserved when passed as bare references (e.g., `events.emit` passed to `emitPlaylistChange`).
- `AnyEvents = {}` (empty object) used as default generic constraint instead of `Record<string, unknown>` because interfaces don't have implicit index signatures.
- `createSlice` now receives `events` as its 4th parameter: `(set, get, store, events) => TSlice`.
- `MediaProvider` creates one `MediaEventEmitter` instance and passes it through context alongside the store.

### All 18 Event Names (lowercase, native format)

| Feature | Events |
|---|---|
| **Playback** | `buffering`, `ended`, `pause`, `play`, `statuschange` |
| **Volume** | `mute`, `volumechange` |
| **Timeline** | `durationchange`, `seek`, `timeupdate` |
| **Player** | `bufferingchange`, `playbackerror`, `playererror`, `playerready` |
| **PlaybackRate** | `ratechange` |
| **PictureInPicture** | `enterpictureinpicture`, `leavepictureinpicture` |
| **Playlist** | `playlistchange` |

### All 16 `on*` Fields Removed

Removed from both the TypeScript interfaces and the `createSlice` initializations:

| Hook | Removed Fields |
|---|---|
| use-playback.ts | `onBuffering`, `onEnded`, `onPause`, `onPlay`, `onStatusChange` |
| use-volume.ts | `onMute`, `onVolumeChange` |
| use-timeline.ts | `onDurationChange`, `onSeek`, `onTimeUpdate` |
| use-player.ts | `onBufferingChange`, `onPlaybackError`, `onPlayerError`, `onPlayerReady` |
| use-playback-rate.ts | `onRateChange` |
| use-picture-in-picture.ts | `onEnterPictureInPicture`, `onLeavePictureInPicture` |
| use-playlist.ts | `onPlaylistChange` |

Each was replaced with `events.emit("eventname", payload)` at the point where the callback was previously invoked.

### Cross-Feature Wiring Replaced (use-asset.ts)

**Before:** `AssetSetup` wrote directly into other stores' `on*` fields:
```ts
api.setState(({ playback }) => { playback.onEnded = () => { ... } })
api.setState(({ player }) => { player.onPlaybackError = (err) => { ... } })
api.setState(({ playlist }) => { playlist.onPlaylistChange = (e) => { ... } })
```

**After:** Uses `events.on()` subscriptions with cleanup:
```ts
const offPlaylistChange = events.on("playlistchange", (event) => { ... })
const offPlaybackError = events.on("playbackerror", (error) => { ... })
const offEnded = events.on("ended", () => { ... })
return () => { offPlaylistChange(); offPlaybackError(); offEnded() }
```

### `emitPlaylistChange` Refactored

The helper function was changed from accessing a store field to accepting an `emit` function as its first parameter:
```ts
function emitPlaylistChange(
  emit: (name: "playlistchange", payload: PlaylistChangeEvent) => void,
  nextIndex, nextItem, previousIndex, previousItem, reason
)
```

---

## 5. Removed "Return Everything" Convenience Hooks

### Problem
Hooks like `useVolume()`, `usePlayback()`, `useTimeline()` returned the entire slice state, defeating granular selectors. Components using them re-rendered on any slice change.

### Fix
Replaced all usages with individual `useXxxStore(s => s.field)` selectors, then deleted the convenience hooks.

**6 hooks removed:**

| Hook | Was In | Replacement Pattern |
|---|---|---|
| `useMedia()` | `use-media.ts` | Dead code (0 usages) — just deleted |
| `useVolume()` | use-volume.ts | `useVolumeStore(s => s.setVolume)`, etc. |
| `usePlayback()` | use-playback.ts | `usePlaybackStore(s => s.togglePaused)` |
| `usePictureInPicture()` | use-picture-in-picture.ts | `usePictureInPictureStore(s => s.toggle)` |
| `usePlaybackRate()` | use-playback-rate.ts | `usePlaybackRateStore(s => s.value)`, etc. |
| `useTimeline()` | use-timeline.ts | `useTimelineStore(s => s.seek)`, etc. + inlined `getTimeFromEvent` |

**Consumer components migrated:**

| Component | Before | After |
|---|---|---|
| volume-control.tsx | `useVolume()` | `useVolumeStore(s => s.setVolume)` |
| `mute-control.tsx` | `useVolume()` | `useVolumeStore(s => s.toggleMute)` |
| `playback-control.tsx` | `usePlayback()` | `usePlaybackStore(s => s.togglePaused)` |
| `picture-in-picture-control.tsx` | `usePictureInPicture()` | `usePictureInPictureStore(s => s.toggle)` |
| `playback-rate.tsx` | `usePlaybackRate()` | 3 individual selectors |
| timeline-control.tsx | `useTimeline()` (×2) | 4 individual selectors + inlined `getTimeFromEvent` as `useCallback` |

**Special case — `getTimeFromEvent`:** This was a derived `useCallback` in `useTimeline()` that depended on `duration`. It was inlined directly into timeline-control.tsx's `Root` component since it's the only consumer.

---

## 6. Event Names → Native Lowercase Format

Renamed all 12 camelCase event name strings to match native HTML media event conventions:

| Before | After |
|---|---|
| `volumeChange` | `volumechange` |
| `statusChange` | `statuschange` |
| `rateChange` | `ratechange` |
| `timeUpdate` | `timeupdate` |
| `durationChange` | `durationchange` |
| `bufferingChange` | `bufferingchange` |
| `playbackError` | `playbackerror` |
| `playerError` | `playererror` |
| `playerReady` | `playerready` |
| `enterPictureInPicture` | `enterpictureinpicture` |
| `leavePictureInPicture` | `leavepictureinpicture` |
| `playlistChange` | `playlistchange` |

Changed in: interface keys, all `events.emit()` calls (24 sites), all `events.on()` calls (3 sites), `emitPlaylistChange` type signature, and JSDoc examples.

---

## Files Modified (Complete List)

| File | Changes |
|---|---|
| media-provider.tsx | Event bridge infra (~100 lines), arrow class fields fix, JSDoc update |
| `use-media.ts` | Removed `useMedia()` |
| use-playback.ts | `PlaybackEvents`, removed 5 `on*` fields, `events.emit()`, removed `usePlayback()` |
| use-volume.ts | `VolumeEvents`, removed 2 `on*` fields, inlined `usePlayerAudioState`, removed `useVolume()` |
| use-timeline.ts | `TimelineEvents`, removed 3 `on*` fields, `createSlice` takes events, removed `useTimeline()`, removed unused `useCallback` import |
| use-player.ts | `PlayerEvents`, removed 4 `on*` fields |
| use-playback-rate.ts | `PlaybackRateEvents`, removed 1 `on*` field, removed `usePlaybackRate()` |
| use-picture-in-picture.ts | `PictureInPictureEvents`, removed 2 `on*` fields, removed `usePictureInPicture()` |
| use-playlist.ts | `PlaylistEvents`, refactored `emitPlaylistChange`, `createSlice` takes events |
| use-asset.ts | Replaced cross-wiring with `events.on()` subscriptions |
| volume-control.tsx | `useVolume()` → selector |
| `mute-control.tsx` | `useVolume()` → selector |
| `playback-control.tsx` | `usePlayback()` → selector |
| `picture-in-picture-control.tsx` | `usePictureInPicture()` → selector |
| `playback-rate.tsx` | `usePlaybackRate()` → selectors |
| timeline-control.tsx | `useTimeline()` → selectors + inlined `getTimeFromEvent` |

---

Regarding updating the shadcn registry schema and docs — I'm currently in **Ask mode** (read-only). To make edits to registry files and documentation, you'd need to switch me to a mode that allows file modifications. Want me to outline what needs updating in the registry schema and docs, or would you like to switch modes first?
