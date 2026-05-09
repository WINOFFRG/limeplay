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
* Block files in `lib/`, `ui/`, `hooks/` folders have filenames matching any registry item in the dependency tree — the shadcn CLI rewrites those imports to the registry item's target path instead of the block's file. Use `components/` folder (always block-scoped) or a non-colliding filename.
* Dependencies with breaking major versions are unpinned (e.g. `"shaka-player"` instead of `"shaka-player@^4"`)
* Control primitives support `asChild` but not `render?: React.ReactElement` — the b0 shadcn preset transforms `asChild` to `render` at install time, so primitives must accept both

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

### Zustand + Immer Middleware Safety

Flag and block these patterns in Zustand stores that use Immer middleware:

* Reassigning the producer argument (e.g. `state = nextState`) instead of mutating draft or returning new state.
* Returning `undefined` from a producer.
* Mutating class instances without `[immerable] = true`.
* Mutating exotic/non-draftable objects in draft updates.
* Creating non-tree state (circular refs or one object referenced in multiple branches).
* Mutating external payload objects after assigning them into draft state.
* Assuming Immer-generated patches are minimal/optimal in patch-sensitive logic.
* Nested `produce` calls where the inner result is not used.
* Equality logic that depends on draft referential identity (`===`, `indexOf` against draft values).
* Array mutations outside numeric indices or `length`.
* With `enableArrayMethods()`, mutating callback parameters of overridden methods (`filter`, `find`, `some`, `every`, `slice`) as if they were drafts.

If these are present, mark as correctness risk because Zustand subscriptions can be skipped or state can be mutated outside tracking.

---

### Error Handling

Ensure media operations use safe error handling patterns and do not silently fail.

---

### Review Behavior

* Think like a library user
* Ask: "Will this work if I copy-paste it?"
* Block PRs that break DX, docs, or CLI installs
