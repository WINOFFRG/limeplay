# Plan 012: Superseded loads cannot take over the player, and `usePlayer` preload stops throwing

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/hooks/use-asset.ts apps/www/registry/default/hooks/use-player.ts`
> Plans 005 and 006 edit other parts of these files; that is expected. Compare
> the "Current state" excerpts below against the live code; on a mismatch in
> those excerpts, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/004-unit-test-baseline.md; apply after 005 and 006 (same files)
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

Two independent defects in asset loading:

1. **Stale custom loads.** The repo rule is "async load functions: use
   abort/generation guards after each `await`". The path used when a caller
   supplies `loading.loader.load` has no such guard. If the custom loader awaits
   something (say, a token fetch) and the user skips from track A to track B in
   the meantime, A's late call to `loadDefault` still resets the player and
   loads A. The store then says B is current while the player plays A.
2. **`usePlayer` preload always fails.** The low-level `usePlayer` hook mutates
   a `Map` it read from the store. The store uses Immer, which freezes
   everything in the state after the first update — confirmed by running it:
   calling `.set()` on that Map throws
   `[Immer] This object has been frozen and should not be mutated`. So
   `preload()` always ends in its error path, `cancelPreload()` throws, and a
   `load()` that used a preloaded asset reports failure after succeeding.

## Current state

- `apps/www/registry/default/hooks/use-asset.ts:469-503` — inside `loadAsset`:

  ```ts
            const loadDefault = createDefaultLoad({
              asset,
              assetId,
              player,
              preloadManager,
              startTime,
            })

            if (options?.loader?.load) {
              await options.loader.load({
                asset,
                loadDefault,
                media,
                player,
                preloadManager,
                previousError,
                retryCount,
                signal: abortController.signal,
                startTime,
              })
            } else {
              const resolved = await resolveSourceValue(options, { … })

              if (abortController.signal.aborted) {
                return false
              }

              await loadDefault(resolved)
            }
  ```

  The `else` branch checks `abortController.signal.aborted`; the custom-loader
  branch does not, and `loadDefault` itself never looks at the signal.
- `use-asset.ts:1012-1059` — `createDefaultLoad` returns
  `async (source, loadOptions) => { … player.resetConfiguration() … await player.load(resolvedSource, timeToLoad) }`.
  Its parameter object is `{ asset, assetId, player, preloadManager, startTime }`.
- `use-asset.ts:535-541` — the `catch` of `loadAsset` already returns `false`
  quietly for `error instanceof DOMException && error.name === "AbortError"`.
- `apps/www/registry/default/hooks/use-player.ts`, hook `usePlayer` — three
  in-place mutations of the store's Map:

  ```ts
  // lines 147-150 (inside load)
          preloadManagers.delete(asset.id)
          store.setState(({ player }) => {
            player.preloadManagers = new Map(preloadManagers)
          })

  // lines 185-189 (inside preload)
          const preloadManagers = store.getState().player.preloadManagers
          preloadManagers.set(asset.id, manager)
          store.setState(({ player }) => {
            player.preloadManagers = new Map(preloadManagers)
          })

  // lines 202-209 (inside cancelPreload)
      const preloadManagers = store.getState().player.preloadManagers
      const manager = preloadManagers.get(assetId)
      if (manager) {
        manager.destroy()
        preloadManagers.delete(assetId)
        store.setState(({ player }) => {
          player.preloadManagers = new Map(preloadManagers)
        })
  ```

- The correct pattern already exists in `use-asset.ts:505-511`:

  ```ts
              const updated = new Map(preloadManagers)
              updated.delete(assetId)
              set(({ player }) => {
                player.preloadManagers = updated
              })
  ```

  Copy first, mutate the copy, assign the copy. Match it.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `cd apps/www && bun test` | all pass |
| Typecheck | `cd apps/www && bun run typecheck` | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `apps/www/registry/default/hooks/use-asset.ts` — `createDefaultLoad` and its call site
- `apps/www/registry/default/hooks/use-player.ts` — the three Map mutations in `usePlayer`

**Out of scope**:
- The wider preload bookkeeping in `use-asset.ts` (managers not destroyed when
  bypassed, not cleared on player teardown, asset-id mismatch between playlist
  and load). Reported by the audit but not verified line-by-line by the plan
  author; listed in `plans/README.md` as not yet planned.
- The public `AssetLoadContext` type and the `loader.load` signature.

## Git workflow

- Branch: `fix/stale-load-guard`. Commit: `fix: guard superseded loads and copy preload map before mutating`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Make `loadDefault` refuse to run for an aborted load

1. Add `signal` to `createDefaultLoad`'s parameter object and its type:
   `signal: AbortSignal`.
2. At the very top of the returned async function (before
   `const normalizedSource = …`), add:

   ```ts
       if (signal.aborted) {
         throw new DOMException("Asset load superseded", "AbortError")
       }
   ```

3. At the call site, pass `signal: abortController.signal` to `createDefaultLoad`.

The thrown `AbortError` propagates out of the user's `loader.load`, reaches the
`catch` of `loadAsset`, and is already handled there as "superseded → return false".

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 2: Guard after the custom loader returns

Directly after the `await options.loader.load({ … })` call (still inside the
`if (options?.loader?.load)` branch), add:

```ts
              if (abortController.signal.aborted) {
                return false
              }
```

**Verify**: `grep -c "abortController.signal.aborted" apps/www/registry/default/hooks/use-asset.ts` → `2`.

### Step 3: Copy the Map before mutating it in `usePlayer`

Rewrite the three sites so the store's Map is never mutated:

```ts
// load
          const updatedManagers = new Map(preloadManagers)
          updatedManagers.delete(asset.id)
          store.setState(({ player }) => {
            player.preloadManagers = updatedManagers
          })

// preload
          const updatedManagers = new Map(
            store.getState().player.preloadManagers
          )
          updatedManagers.set(asset.id, manager)
          store.setState(({ player }) => {
            player.preloadManagers = updatedManagers
          })

// cancelPreload
        manager.destroy()
        const updatedManagers = new Map(preloadManagers)
        updatedManagers.delete(assetId)
        store.setState(({ player }) => {
          player.preloadManagers = updatedManagers
        })
```

**Verify**: `grep -n "preloadManagers\.\(set\|delete\)(" apps/www/registry/default/hooks/use-player.ts` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 4: Add a regression test for the frozen-Map behaviour

Create `apps/www/tests/immer-map.test.ts`. It documents *why* the copy is needed:

```ts
import { describe, expect, test } from "bun:test"
import { immer } from "zustand/middleware/immer"
import { createStore } from "zustand/vanilla"

interface ProbeState {
  player: { instance: null | object; preloadManagers: Map<string, number> }
}

describe("store maps", () => {
  test("a Map read from the store is frozen after any update", () => {
    const store = createStore<ProbeState>()(
      immer(() => ({ player: { instance: null, preloadManagers: new Map() } }))
    )

    store.setState((state) => {
      state.player.instance = {}
    })

    expect(() =>
      store.getState().player.preloadManagers.set("asset", 1)
    ).toThrow()
  })

  test("copy, mutate the copy, assign the copy", () => {
    const store = createStore<ProbeState>()(
      immer(() => ({ player: { instance: null, preloadManagers: new Map() } }))
    )

    const updatedManagers = new Map(store.getState().player.preloadManagers)
    updatedManagers.set("asset", 1)
    store.setState((state) => {
      state.player.preloadManagers = updatedManagers
    })

    expect(store.getState().player.preloadManagers.get("asset")).toBe(1)
  })
})
```

**Verify**: `cd apps/www && bun test` → all pass, 2 new tests.

## Test plan

Step 4. The stale-load race itself needs a real Shaka player and is covered by
the manual check below.

## Done criteria

- [ ] `grep -n "preloadManagers\.\(set\|delete\)(" apps/www/registry/default/hooks/use-player.ts` → no output
- [ ] `grep -c "abortController.signal.aborted" apps/www/registry/default/hooks/use-asset.ts` → `2`
- [ ] `grep -n "Asset load superseded" apps/www/registry/default/hooks/use-asset.ts` → one match
- [ ] `cd apps/www && bun test` exits 0; typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only the two hook files and the new test file are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `createDefaultLoad` has callers other than the one in `loadAsset`
  (`grep -n "createDefaultLoad(" apps/www/registry/default/hooks/use-asset.ts`
  should show the definition and one call).
- `DOMException` is unavailable where `use-asset.ts` runs on the server during
  the static build (`cd apps/www && bun run build` fails with a `DOMException`
  reference error) — it is only constructed inside an async load, so this is
  not expected.

## Maintenance notes

- Manual check for the reviewer: neither shipped block uses `loader.load` (the
  audio block uses `resolveSource`, which was already guarded). To exercise the
  fix, pass a `loading={{ loader: { load: async ({ loadDefault }) => { await new Promise((r) => setTimeout(r, 1500)); await loadDefault() } } }}`
  to a player with a playlist and click "next" several times quickly. The track
  that ends up playing must match the highlighted track.
- A user-supplied `loader.load` that catches all errors will swallow the new
  `AbortError`; the Step 2 guard covers that case.

## Execution note (2026-11-13)

- The file already had two `abortController.signal.aborted` checks in its
  preload path. The plan's unscoped grep therefore returns four after adding
  the two `loadAsset` checks; both new checks are present in `loadAsset`.
- The 34 Bun tests, typecheck, lint (0 errors), formatting, registry validation,
  and production build passed. The custom-loader race still needs the manual
  playlist check above because the shipped blocks do not supply `loader.load`.
