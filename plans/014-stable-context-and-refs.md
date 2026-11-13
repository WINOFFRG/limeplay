# Plan 014: The provider context value and two store-writing refs are stable across renders

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/ui/media-provider.tsx apps/www/registry/default/ui/root-container.tsx apps/www/registry/default/ui/captions.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The project rule is "never introduce unnecessary re-renders". Two patterns
defeat the per-field store selectors the library is built around:

1. `MediaProvider` passes a new object literal as its context value on every
   render, so any re-render of the provider's parent re-renders every component
   that uses any Limeplay hook.
2. `RootContainer` and `CaptionsContainer` build a new ref callback on every
   render with `composeRefs(…)`. React treats a new ref callback as a change:
   it calls the old one with `null` and the new one with the node. Both
   callbacks write to the store, so every render of these components performs
   two store writes (`null`, then the element) and wakes every subscriber. For
   captions it also re-runs `player.setVideoContainer(…)`.

## Current state

- `apps/www/registry/default/ui/media-provider.tsx:287-323` (inside the
  `MediaProvider` component created by `createMediaKit`):

  ```tsx
      const runtimeRef = React.useRef<null | {
        events: MediaEvents<RuntimeEvents>
        store: ImmerStoreApi<RuntimeStore>
      }>(null)
      const featureKeysRef = React.useRef(
        new Set<string>(features.map((feature) => feature.key))
      )
      …
      const runtime = runtimeRef.current
      …
      return (
        <MediaRuntimeContext.Provider
          value={{
            events: runtime.events as unknown as MediaEvents<AnyEvents>,
            featureKeys: featureKeysRef.current,
            store: runtime.store as ImmerStoreApi<AnyMediaStore>,
          }}
        >
  ```

  `runtime` and `featureKeysRef.current` never change after the first render.
- `apps/www/registry/default/ui/root-container.tsx`
  - line 3: `import { composeRefs } from "@radix-ui/react-compose-refs"`
  - line 57: `const setPlayerContainerRef = usePlayerStore((state) => state.setContainerRef)`
  - line 78: `ref={composeRefs(forwardedRef, setPlayerContainerRef)}`
  - The component re-renders on every idle and status change (it selects
    `idle`, `forceIdle`, `status`, `debug` on lines 52–55).
- `apps/www/registry/default/ui/captions.tsx`
  - line 3: `import { composeRefs } from "@radix-ui/react-compose-refs"`
  - line 124: `ref={composeRefs(ref, setContainerElement)}`
- The exemplar already in the repo — `apps/www/registry/default/ui/media.tsx:3,27`:

  ```tsx
  import { useComposedRefs } from "@radix-ui/react-compose-refs"
  …
      const composedRef = useComposedRefs(forwardedRef, setMediaElement)
  ```

  `useComposedRefs` memoises the composed callback. Match it.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |
| Tests (if plan 004 applied) | `cd apps/www && bun test` | all pass |

## Scope

**In scope**:
- `apps/www/registry/default/ui/media-provider.tsx` (the Provider `value` only)
- `apps/www/registry/default/ui/root-container.tsx` (import and `ref` only)
- `apps/www/registry/default/ui/captions.tsx` (import and the `CaptionsContainer` `ref` only)

**Out of scope**:
- Components that subscribe to more state than they use (`useCaptions()`,
  `useAsset()`, `usePlaylist()` in block components) — a separate cleanup.
- `apps/www/registry/pro/**` (the pro components have the same inline
  `composeRefs`, but their refs do not write to the store; see plan 016).
- Registry metadata — the `@radix-ui/react-compose-refs` dependency is unchanged.

## Git workflow

- Branch: `fix/stable-context-and-refs`. Commit: `fix: stabilise provider context value and composed refs`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Memoise the context value

In `media-provider.tsx`, before the `return`, add:

```tsx
    const contextValue = React.useMemo(
      () => ({
        events: runtime.events as unknown as MediaEvents<AnyEvents>,
        featureKeys: featureKeysRef.current,
        store: runtime.store as ImmerStoreApi<AnyMediaStore>,
      }),
      [runtime]
    )
```

and change the provider to `<MediaRuntimeContext.Provider value={contextValue}>`.
Place the `useMemo` after `const runtime = runtimeRef.current` and before any
early return (there is none today), so hook order stays fixed.

**Verify**: `grep -n "value={{" apps/www/registry/default/ui/media-provider.tsx` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors
(if the `react-hooks/exhaustive-deps` rule complains about `featureKeysRef`,
leave the dependency list as `[runtime]` — a ref object is stable — and report
the warning rather than disabling the rule).

### Step 2: Stable composed refs

In `root-container.tsx`: change the import to `useComposedRefs`, add
`const composedRef = useComposedRefs(forwardedRef, setPlayerContainerRef)` next
to the other hooks (before `const Component = …`), and use `ref={composedRef}`.

In `captions.tsx`: same change in the component that contains line 124
(`useComposedRefs(ref, setContainerElement)`); the hook call must be at the top
level of that component, above its `return`.

**Verify**: `grep -rn "composeRefs(" apps/www/registry/default/ui/root-container.tsx apps/www/registry/default/ui/captions.tsx` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

## Test plan

No automated test (needs a DOM renderer). Manual check in Maintenance notes.

## Done criteria

- [ ] `grep -n "value={{" apps/www/registry/default/ui/media-provider.tsx` → no output
- [ ] `grep -rn "composeRefs(" apps/www/registry/default/ui/root-container.tsx apps/www/registry/default/ui/captions.tsx` → no output
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only the three in-scope files are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `captions.tsx` still uses the non-hook `composeRefs` somewhere else in the
  file for a legitimate non-render use (then keep both imports).
- The provider excerpt does not match (for example the value already comes from a ref).

## Maintenance notes

- Manual check for the reviewer: with React DevTools "Highlight updates" on the
  video-player block, moving the mouse (idle toggles) should no longer flash
  the playlist button or the captions control.
- `useComposedRefs` still produces a new callback if `forwardedRef` itself
  changes identity between renders; callers passing inline ref callbacks will
  still see the null/node cycle. That is standard React behaviour.
