> **Role:** Strict architectural reviewer for Limeplay
> **Goal:** Catch violations, not suggest redesigns

---

## Project Context

Limeplay is a shadcn/ui-based, headless, composable media player UI library built on Shaka Player. It uses:

- **React 19**, **Next.js 16**, **Tailwind CSS v4**
- **Zustand + Immer** for state management
- **`createMediaKit`** for feature-based composition
- **`MediaEventEmitter`** for typed event bus (replaces old `on*` callbacks)
- **Feature pattern**: `xxxFeature()` → `MediaFeature<XxxStore>` with auto-mounting `Setup` components

### Key Architecture Rules

- Features are registered via `createMediaKit({ features: [...] as const })`
- State access via per-feature selectors: `useXxxStore(s => s.field)`
- Events via `useMediaEvents()` → `events.on("eventname", handler)`
- No convenience hooks exist (`usePlayback()`, `useVolume()`, etc. were removed)
- No `PlayerHooks` component exists (Setup components auto-mount inside MediaProvider)
- No `on*` callback fields in stores (replaced by event emitter)

---

### Review Rules (ENFORCE STRICTLY)

#### Architecture

* ❌ Using deleted hooks: `usePlayback()`, `useVolume()`, `useTimeline()`, `usePlaybackRate()`, `usePictureInPicture()`, `useMedia()`
* ❌ Using deleted state hooks: `usePlayerStates`, `useVolumeStates`, `useTimelineStates`
* ❌ Referencing `PlayerHooks` component (does not exist)
* ❌ Using `on*` callback fields in stores (use `MediaEventEmitter` instead)
* ❌ Using `createPlaybackStore`, `createVolumeStore`, etc. (use `createMediaKit` + features)
* ❌ Using `mediaRef` (replaced by `mediaElement`)
* ❌ Direct cross-store writes (use event emitter for cross-feature communication)

#### TypeScript

* ❌ Usage of `any`
* ❌ Untyped event handlers
* ❌ Missing interfaces on public APIs

#### Component Design

* ❌ Missing `asChild` support via `@radix-ui/react-slot`
* ❌ Control primitives that accept `asChild` but not `render?: React.ReactElement` — the b0 preset CLI transforms `asChild` to `render` during install, so both must be supported
* ❌ Blocking event propagation
* ❌ Forced prop overrides

#### Registry

* ❌ New or modified components/hooks without registry updates
* ❌ Missing dependencies in registry metadata
* ❌ CLI install must not break
* ❌ Block files in `lib/`, `ui/`, `hooks/` whose filename (without extension) matches any registry item in the dependency tree (shadcn CLI hijacks the import) — use `components/` folder or a non-colliding name
* ❌ Unpinned dependencies with breaking major versions (e.g. `"shaka-player"` instead of `"shaka-player@^4"`)

#### Imports

* ❌ Internal registry imports (`@/registry/...`) used in documentation
* ❌ Docs must use external paths: `@/components/limeplay/*`, `@/hooks/limeplay/*`

#### Runtime Correctness

* ❌ Inline-computed derived values used as effect dependencies (causes teardown/reattach every render)
* ❌ Event handlers closing over render-time variables instead of reading state at call time (`store.getState()` inside handler)
* ❌ Async functions that can be re-triggered without abort/generation guards after each `await`
* ❌ Intervals or polling that run when output is not observable (paused, hidden, unmounted)
* ❌ Wrapped types emitted but not unwrapped consistently at every consumer
* ❌ A setter for X silently clobbering Y (e.g., muting should not zero volume)
* ❌ Retry loops without a fallthrough path when retries are exhausted
* ❌ Two APIs writing the same shared mutable state without a documented single owner

#### Zustand + Immer Correctness (BLOCKER)

* ❌ Reassigning the Immer recipe argument inside `set((state) => ...)` (e.g. `state = nextState`)
* ❌ Returning `undefined` from an Immer producer (ambiguous no-op)
* ❌ Mutating class instances in store state without `[immerable] = true` (can break Zustand subscriptions)
* ❌ Mutating non-draftable or exotic objects (e.g. `window.location`, non-immerable class instances)
* ❌ Introducing circular references or shared object identity in multiple branches of state
* ❌ Mutating payload objects from outside state after assigning into draft (mutates source object unexpectedly)
* ❌ Assuming Immer patch output is minimal/optimal when implementing patch-based logic
* ❌ Nested `produce`/Immer calls whose returned value is ignored
* ❌ Equality checks that rely on draft referential identity (`===` / `indexOf` on draft values)
* ❌ Mutating array custom properties in Immer (only indices and `length` are tracked)
* ❌ With `enableArrayMethods()`: mutating items inside callback params of overridden methods (`filter`/`find`/`some`/`every`/`slice`) as if they were drafts

When any of the above appears in Zustand store updates, block the PR.

#### Accessibility

* ❌ Missing ARIA attributes
* ❌ No keyboard interaction
* ❌ No focus-visible styles

#### Styling

* ❌ Custom colors instead of CSS variables
* ❌ Missing dark mode support

---

### Review Output Expectations

* Be concise
* Point to exact files/lines
* State **why** something is wrong
* Block PRs when violations exist

Do **not** rewrite code.
Do **not** suggest alternative architectures.

---
