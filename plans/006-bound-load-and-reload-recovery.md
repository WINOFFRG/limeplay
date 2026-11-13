# Plan 006: Error recovery cannot loop forever

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/hooks/use-asset.ts apps/www/registry/default/hooks/use-player.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition. (Plan 005 changes the autoplay block
> around `use-asset.ts:517-525` and adds one import; that is expected.)

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (changes default recovery behaviour)
- **Depends on**: plans/004-unit-test-baseline.md, plans/005-play-rejection-non-fatal.md
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

Two default recovery paths have no upper bound:

1. **Load failure with repeat on.** When an asset fails to load, the code skips
   to the "next" item if one exists. With repeat `"one"` the next item is the
   same item; with repeat `"all"` the list wraps. A broken URL, or going
   offline, therefore reloads forever, the error UI never appears, and
   `assetloaderror` fires continuously.
2. **Playback error.** With no `recover.playbackError` callback, the default
   decision is "reload the stream", with no attempt limit. A persistent
   mid-playback error reloads the stream indefinitely.

Also, every Shaka `error` event is treated as fatal, including ones Shaka marks
as recoverable (it is already retrying them itself). After this plan: a failed
load never wraps around the playlist, default reloads are capped, and
recoverable Shaka errors are ignored.

## Current state

All in `apps/www/registry/default/hooks/`.

- `use-playlist.ts:163-189` — `getNextIndex()`:

  ```ts
          if (playlist.queue.length === 0) return -1

          if (playlist.repeatMode === "one") return playlist.currentIndex

          if (playlist.shuffle && playlist.shuffleOrder.length > 0) {
            const currentPos = playlist.shuffleOrder.indexOf(
              playlist.currentIndex
            )
            const nextPos = currentPos + 1
            if (nextPos < playlist.shuffleOrder.length) {
              return playlist.shuffleOrder[nextPos]
            }
            if (playlist.repeatMode === "all") {
              return playlist.shuffleOrder[0]
            }
            return -1
          }

          const nextIndex = playlist.currentIndex + 1
          if (nextIndex < playlist.queue.length) return nextIndex
          if (playlist.repeatMode === "all") return 0
          return -1
  ```

- `use-asset.ts:544-549` — in the `catch` of `loadAsset`:

  ```ts
            const normalizedError = toError(error)
            events.emit("assetloaderror", { asset, error: normalizedError })
            const playlist = get().playlist
            const maxRetries = options?.maxRetries ?? 0
            const currentRetryCount = get().asset.retryCount
            const hasNext = playlist.getNextIndex() !== -1
  ```

  `hasNext` is then used three times below (passed to `recover.loadError`,
  and in two `if (… hasNext)` branches that call `playlist.next()`); when it is
  false the code calls `get().playback.setError(normalizedError)`.
  `playlist.next()` emits `playlistchange`, and `AssetSetup` (line 908) answers
  that event by calling `loadAsset` again — that is the loop.
- `use-asset.ts:924-969` — in `AssetSetup`, the `playbackerror` listener. The
  relevant part:

  ```ts
    const offPlaybackError = events.on("playbackerror", (payload) => {
      void (async () => {
        const state = api.getState()
        const { currentItem } = state.playlist
        const sessionId = state.asset.activeSession?.id
        const options = state.asset.activeSession?.loading as
          undefined | UseAssetOptions<TAsset>
        if (!currentItem) return
        const currentItemId = currentItem.id
        …
        try {
          const currentTime = …
          const decision = options?.recover?.playbackError
            ? await options.recover.playbackError(…)
            : {
                action: AssetRecoveryAction.Reload,
              }
          const freshCurrentItem = getFreshCurrentItem()
          if (!freshCurrentItem) return

          if (decision.action === AssetRecoveryAction.Reload) {
            …
            await api.getState().asset.loadAsset(…)
  ```

  This listener is registered inside a `useEffect(() => { … }, [api, events])`.
- `use-player.ts:364-375` — the Shaka error listener:

  ```ts
    const errorHandler = (event: Event) => {
      const detail = (event as CustomEvent).detail as shaka.util.Error
      if (isLoadInterrupted(detail)) return
      const media = store.getState().media.mediaElement
      const currentTime = media?.currentTime ?? 0

      store.getState().playback.setError(detail)
      events.emit("playbackerror", {
        currentTime,
        error: detail as unknown as Error,
      })
    }
  ```

  `shaka` is a **type-only** import in this file (`import type shaka from "shaka-player"`),
  so enum values cannot be read from it at runtime. The file already defines a
  numeric constant `SHAKA_LOAD_INTERRUPTED_ERROR_CODE` for the same reason —
  follow that pattern. In `shaka-player` 5.2 typings
  (`node_modules/shaka-player/dist/shaka-player.compiled.d.ts:3629-3630`):
  `CRITICAL = 2.0`, `RECOVERABLE = 1.0`.
- Conventions: no `any`; read state lazily with `get()` / `api.getState()` inside
  handlers; minimal comments; meaningful names.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `cd apps/www && bun test` | all pass |
| Typecheck | `cd apps/www && bun run typecheck` | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 (run `bunx prettier --write <file>` on files you changed) |

## Scope

**In scope**:
- `apps/www/registry/default/hooks/use-asset.ts`
- `apps/www/registry/default/hooks/use-player.ts` (the `errorHandler` only)
- `apps/www/tests/asset-recovery.test.ts` (create)

**Out of scope**:
- `use-playlist.ts` — `getNextIndex()` is correct for normal "track ended" advancing; do not change it.
- The `ended` listener and `getHasNext` in `AssetSetup` — normal end-of-track wrap-around must keep working.
- Behaviour when the user supplies `recover.playbackError` — their callback stays in full control.
- Docs under `apps/www/content/docs/` — see Maintenance notes.

## Git workflow

- Branch: `fix/bound-error-recovery`. Commit: `fix: bound load and playback error recovery`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add a pure helper that decides whether a failed load may skip forward

In `use-asset.ts`, add an exported function next to the other module-level
helpers at the bottom of the file:

```ts
export function canSkipAfterLoadError(playlist: {
  currentIndex: number
  queue: readonly unknown[]
  repeatMode: string
  shuffle: boolean
  shuffleOrder: readonly number[]
}): boolean {
  if (playlist.queue.length === 0) return false
  if (playlist.repeatMode === "one") return false

  if (playlist.shuffle && playlist.shuffleOrder.length > 0) {
    const currentPosition = playlist.shuffleOrder.indexOf(playlist.currentIndex)
    return currentPosition + 1 < playlist.shuffleOrder.length
  }

  return playlist.currentIndex + 1 < playlist.queue.length
}
```

It mirrors `getNextIndex()` but never wraps: a failed load may move to a later
item in the current order, never back to the start and never to itself.

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 2: Use it in the `loadAsset` catch

Replace `const hasNext = playlist.getNextIndex() !== -1` (line 549) with:

```ts
            const hasNext = canSkipAfterLoadError(playlist)
```

Leave every later use of `hasNext` as it is.

**Verify**: `grep -n "playlist.getNextIndex() !== -1" apps/www/registry/default/hooks/use-asset.ts` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0. If the `playlist` type
is not assignable to the helper's parameter, widen the helper's parameter type
to accept it; do not add a cast at the call site.

### Step 3: Cap default playback-error reloads

In `AssetSetup`, at module level (above the function) add:

```ts
const MAX_DEFAULT_PLAYBACK_RELOADS = 3
const PLAYBACK_RELOAD_WINDOW_MS = 30_000
```

Inside the `useEffect`, before `const offPlaybackError = …`, add:

```ts
    let reloadedItemId: null | string = null
    let reloadCount = 0
    let reloadWindowStartedAt = 0
```

Inside the listener, immediately after `const currentItemId = currentItem.id`, add:

```ts
        if (!options?.recover?.playbackError) {
          const now = Date.now()
          const isNewWindow =
            reloadedItemId !== currentItemId ||
            now - reloadWindowStartedAt > PLAYBACK_RELOAD_WINDOW_MS

          if (isNewWindow) {
            reloadedItemId = currentItemId
            reloadCount = 0
            reloadWindowStartedAt = now
          }

          if (reloadCount >= MAX_DEFAULT_PLAYBACK_RELOADS) return

          reloadCount += 1
        }
```

When the cap is hit the listener returns without reloading. The player stays in
the `error` status that `use-player.ts` already set before emitting the event,
so the error UI is shown.

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 4: Ignore recoverable Shaka errors

In `use-player.ts`, next to `SHAKA_LOAD_INTERRUPTED_ERROR_CODE`, add:

```ts
const SHAKA_ERROR_SEVERITY_RECOVERABLE = 1
```

In `errorHandler`, after the `isLoadInterrupted` line, add:

```ts
      if (detail.severity === SHAKA_ERROR_SEVERITY_RECOVERABLE) return
```

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 5: Test the helper

Create `apps/www/tests/asset-recovery.test.ts` (same structure as
`apps/www/tests/playlist-helpers.test.ts`) covering `canSkipAfterLoadError`:

| Case | Input | Expected |
|---|---|---|
| empty queue | `queue: []` | `false` |
| repeat one | 3 items, `currentIndex: 0`, `repeatMode: "one"` | `false` |
| middle of list | 3 items, `currentIndex: 0`, repeat `"off"` | `true` |
| last item, repeat off | 3 items, `currentIndex: 2` | `false` |
| last item, repeat all | 3 items, `currentIndex: 2`, `repeatMode: "all"` | `false` (this is the regression test) |
| shuffle, not last | `shuffle: true`, `shuffleOrder: [2,0,1]`, `currentIndex: 2` | `true` |
| shuffle, last, repeat all | `shuffleOrder: [2,0,1]`, `currentIndex: 1`, `repeatMode: "all"` | `false` |

**Verify**: `cd apps/www && bun test` → all pass, 7 new cases.

## Test plan

Step 5 covers the pure decision. The reload cap and severity filter are
event-driven and need a browser; see Maintenance notes for the manual check.

## Done criteria

- [ ] `cd apps/www && bun test` exits 0 with `tests/asset-recovery.test.ts` present
- [ ] `cd apps/www && bun run typecheck` exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] `grep -n "playlist.getNextIndex() !== -1" apps/www/registry/default/hooks/use-asset.ts` → no output
- [ ] `grep -n "MAX_DEFAULT_PLAYBACK_RELOADS\|SHAKA_ERROR_SEVERITY_RECOVERABLE" apps/www/registry/default/hooks/use-asset.ts apps/www/registry/default/hooks/use-player.ts` → matches in both files
- [ ] Only the three in-scope files are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The `playbackerror` listener is no longer registered inside a `useEffect` in
  `AssetSetup` (the closure counters would then be wrong).
- `shaka.util.Error` in the installed `shaka-player` typings has no numeric
  `severity` field, or `RECOVERABLE` is not `1`
  (`grep -n "RECOVERABLE" node_modules/shaka-player/dist/shaka-player.compiled.d.ts`).
- The fix seems to need a change in `use-playlist.ts`.

## Maintenance notes

- **Execution note (2026-11-13):** The implemented default reload cap is three
  per item and loading session, rather than three per 30-second window. A
  rolling window could reset during a slower persistent failure and allow
  unlimited reloads. The count resets when the item or session changes.
- Behaviour change to mention in release notes: with repeat `"one"`/`"all"`, a
  failing item now stops with an error at the end of the list where it used to
  retry endlessly; a persistent playback error stops after 3 default reloads
  for the same item in one loading session.
- The docs for `loading.recover` (`apps/www/content/docs/hooks/use-asset.mdx`,
  if it describes default recovery) should gain one sentence about the cap.
  Left out of scope so this plan stays code-only.
- Manual check for the reviewer: in the audio-player block, set repeat to "all"
  and give the last track a 404 URL — expect the error state, not a spinner
  loop. Then block the media host in DevTools mid-playback — expect at most 3
  reload attempts.
- Step 4 relies on Shaka dispatching `error` events for recoverable errors. If
  playback problems that used to show an error screen now show nothing, look
  here first; a follow-up could surface them as a non-fatal `playbackwarning` event.
- After a default reload, playback stays paused unless the element has
  `autoplay`. Restoring the pre-error play state is a separate follow-up.
