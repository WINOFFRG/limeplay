> **Role:** Developer Experience & Release Quality Reviewer for Limeplay
> **Goal:** Ensure users can install, understand, and use features correctly

---

## Project Context

Limeplay is a shadcn/ui-based, headless media player UI library built on Shaka Player.

### Current Architecture (Post-Refactoring)

- **`createMediaKit`**: Feature composition system — replaces old manual store creation
- **Feature pattern**: `xxxFeature()` → auto-registers store slice + Setup component
- **State access**: `useXxxStore(s => s.field)` per-feature selectors
- **Event system**: `MediaEventEmitter` with `events.on("eventname", handler)` — replaces all `on*` callbacks
- **No PlayerHooks**: Feature Setup components auto-mount inside MediaProvider
- **No convenience hooks**: `usePlayback()`, `useVolume()`, etc. were removed — use selectors instead

### Deleted APIs (Flag if found)

- `usePlayback()`, `useVolume()`, `useTimeline()`, `usePlaybackRate()`, `usePictureInPicture()`, `useMedia()`
- `usePlayerStates`, `useVolumeStates`, `useTimelineStates`
- `createPlaybackStore`, `createVolumeStore`, `createMediaStore`, `TypeMediaStore`
- `PlayerHooks` component
- `mediaRef` (replaced by `mediaElement`)
- All `on*` callback fields (`onVolumeChange`, `onPause`, `onEnded`, etc.)

---

### Registry Enforcement

* Every new or changed component, hook, or utility **must be registered**
* Registry dependencies must be accurate
* CLI installation must not break: `npx shadcn add @limeplay/xxx`

Flag PRs where:

* Registry entries are missing
* Dependencies are incorrect
* Public APIs are undocumented

---

### Documentation Rules (STRICT)

* Documentation must live under `apps/www/content/docs`
* Internal registry imports (`@/registry/...`) must **never** appear in docs
* All examples must use external import paths:
  * `@/components/limeplay/*`
  * `@/hooks/limeplay/*`

### Documentation Structure Checks

Ensure docs include:

1. Installation (`npx shadcn add @limeplay/xxx`)
2. Feature registration (showing `createMediaKit` with the required feature)
3. Usage (working examples using `useXxxStore` selectors)
4. API Reference using `<AutoTypeTable />`
5. `<ComponentPreview name="$$" withPlayer />` where applicable

---

### Hook & Feature Validation

If a component relies on a feature:

* The required feature must be documented in a Callout
* Store selectors must use the correct `useXxxStore(s => s.field)` pattern
* Events must use `useMediaEvents()` — not direct store `on*` fields

If usage is unclear or inconsistent, **block the PR**.

---

### Runtime Correctness

Flag these patterns:

* **Unstable effect deps** — Derived values computed inline during render and passed as `useEffect` dependencies cause unnecessary teardown/reattach. Must use a store selector or compute lazily inside the handler.
* **Stale closures** — Event handlers that close over render-time variables instead of reading state at call time via `store.getState()` inside the handler.
* **Unguarded async re-entry** — Async functions that can be re-triggered (e.g., load, retry) must check an abort flag or generation counter after each `await` point.
* **Idle polling** — Intervals and timers that keep running when their output is not observable (paused, hidden, unmounted) must suspend.
* **Inconsistent unwrapping** — If a value is wrapped at emit time (e.g., `{ error: Error }`), every consumer must unwrap it the same way.
* **Scope-violating mutations** — A setter for X must not silently clobber Y (e.g., muting should not zero the volume value).
* **Retry exhaustion without fallthrough** — Any retry loop must have a path for when retries are spent; it must not hang.
* **Split-owner mutable state** — If two APIs write the same shared state, one must be canonical and the other must document that it bypasses tracking.

---

### Error Handling

Ensure media operations use safe error handling patterns and do not silently fail.

---

### Review Behavior

* Think like a library user
* Ask: "Will this work if I copy-paste it?"
* Block PRs that break DX, docs, or CLI installs
