# Plan 005: A blocked or interrupted `play()` no longer puts the player into the error state

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/hooks/use-playback.ts apps/www/registry/default/hooks/use-asset.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/004-unit-test-baseline.md (for the test file location and runner)
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

`HTMLMediaElement.play()` returns a promise that rejects in two ordinary,
non-broken situations: the browser blocked autoplay (`NotAllowedError`), or the
play request was interrupted by a `pause()` or a new load (`AbortError`). The
playback store treats every rejection as a fatal error. Consequences today:
(1) with autoplay blocked, a successfully loaded asset is reported as a load
failure and the playlist skips to the next item, which fails the same way, all
the way down the list; (2) a quick play-then-pause shows the error screen;
(3) the new `ExclusivePlaybackProvider`, which pauses the previously playing
element, can push that player into the error state.

## Current state

- `apps/www/registry/default/hooks/use-playback.ts:91-106` — the `play` action:

  ```ts
        play: async () => {
          const media = get().media.mediaElement
          if (!media) return

          set(({ media: mediaState }) => {
            mediaState.idle = false
          })

          try {
            await media.play()
          } catch (error: unknown) {
            console.error("Error playing media", error)
            get().playback.setError(error)
            throw error
          }
        },
  ```

  `setError` (same file, line 122) pauses the element and sets
  `playback.status = "error"`.
- `apps/www/registry/default/hooks/use-playback.ts:175-183` — `togglePaused`
  already swallows the rejection: `await get().playback.play().catch(noop)`.
  `noop` is imported at line 9 from `@/registry/default/lib/utils`.
- `apps/www/registry/default/hooks/use-asset.ts:517-525` — inside the `try` of
  `loadAsset`, after the Shaka load has succeeded:

  ```ts
            if (media.autoplay && media.paused) {
              if (get().asset.isFirstLoad) {
                if (options?.autoplayFirst) {
                  await get().playback.play()
                }
              } else {
                await get().playback.play()
              }
            }
  ```

- `apps/www/registry/default/hooks/use-asset.ts:535-541` — the `catch` of
  `loadAsset` only exempts aborted loads:

  ```ts
          } catch (error) {
            if (
              get().asset.loadGeneration !== generation ||
              isLoadInterrupted(error) ||
              (error instanceof DOMException && error.name === "AbortError")
            ) {
              return false
            }
  ```

  Anything else (so: `NotAllowedError`) emits `assetloaderror` and then calls
  `playlist.next()` when a next item exists.
- `use-asset.ts` imports types from `use-playback` at lines 7–10 with
  `import type { … } from "@/registry/default/hooks/use-playback"`. A value
  import from that module must be a separate, non-`type` import.
- Conventions: no `any`; strongly typed; minimal comments, only where intent is
  not obvious; exported helpers are plain `export function` declarations.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `cd apps/www && bun test` | all pass |
| Typecheck | `cd apps/www && bun run typecheck` | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 (run `bunx prettier --write <file>` on files you changed) |

## Scope

**In scope**:
- `apps/www/registry/default/hooks/use-playback.ts`
- `apps/www/registry/default/hooks/use-asset.ts` (the autoplay block only)
- `apps/www/tests/playback.test.ts` (create)

**Out of scope**:
- `apps/www/registry/default/ui/exclusive-playback-provider.tsx` — fixed indirectly by this plan.
- The rest of the `loadAsset` catch block (retry/skip logic) — plan 006.
- `apps/www/registry/collection/registry-hooks.ts` — `use-asset` already lists `use-playback` as a registry dependency.

## Git workflow

- Branch: `fix/play-rejection-non-fatal`. Commit: `fix: treat blocked or interrupted play as non-fatal`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add and export a classifier in `use-playback.ts`

Add near the other exported functions (for example directly above `usePlaybackStore`):

```ts
export function isPlayInterruption(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "NotAllowedError")
  )
}
```

**Verify**: `grep -n "export function isPlayInterruption" apps/www/registry/default/hooks/use-playback.ts` → one match.

### Step 2: Do not call `setError` for those rejections

Change the `catch` in the `play` action to:

```ts
          } catch (error: unknown) {
            if (!isPlayInterruption(error)) {
              console.error("Error playing media", error)
              get().playback.setError(error)
            }
            throw error
          }
```

The promise still rejects (callers that care can still observe it); only the
store's error state is no longer set.

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 3: Keep a blocked autoplay out of load-error recovery

In `use-asset.ts`:

1. Add a value import: `import { isPlayInterruption } from "@/registry/default/hooks/use-playback"`
   (next to the existing `import { isLoadInterrupted } from "@/registry/default/hooks/use-player"`).
2. Replace the autoplay block shown in "Current state" with:

   ```ts
            const shouldAutoplay =
              media.autoplay &&
              media.paused &&
              (!get().asset.isFirstLoad || Boolean(options?.autoplayFirst))

            if (shouldAutoplay) {
              try {
                await get().playback.play()
              } catch (playError) {
                if (!isPlayInterruption(playError)) throw playError
              }
            }
   ```

   A real play failure (for example `NotSupportedError`) still reaches the
   existing `catch` and its recovery logic. A blocked or interrupted play does
   not: the asset stays loaded and paused, and `assetloaded` is emitted.

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 4: Test the classifier

Create `apps/www/tests/playback.test.ts`:

```ts
import { describe, expect, test } from "bun:test"

import { isPlayInterruption } from "@/registry/default/hooks/use-playback"

describe("isPlayInterruption", () => {
  test("treats blocked autoplay as an interruption", () => {
    expect(isPlayInterruption(new DOMException("blocked", "NotAllowedError"))).toBe(true)
  })

  test("treats an aborted play request as an interruption", () => {
    expect(isPlayInterruption(new DOMException("aborted", "AbortError"))).toBe(true)
  })

  test("does not hide real failures", () => {
    expect(isPlayInterruption(new DOMException("bad", "NotSupportedError"))).toBe(false)
    expect(isPlayInterruption(new Error("AbortError"))).toBe(false)
    expect(isPlayInterruption(null)).toBe(false)
  })
})
```

**Verify**: `cd apps/www && bun test` → all pass, including 3 new tests.

## Test plan

Unit tests as in Step 4. The store-level behaviour (status stays `paused`,
playlist does not advance) needs a browser; see Maintenance notes.

## Done criteria

- [ ] `cd apps/www && bun test` exits 0 with `tests/playback.test.ts` present
- [ ] `cd apps/www && bun run typecheck` exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] `grep -n "get().playback.setError(error)" apps/www/registry/default/hooks/use-playback.ts` shows the call is inside `if (!isPlayInterruption(error))`
- [ ] Only the three in-scope files are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The `play` action or the autoplay block does not match the excerpts.
- Importing `isPlayInterruption` into `use-asset.ts` creates an import cycle
  error at test or build time (`use-playback.ts` must not import from `use-asset.ts`;
  confirm with `grep -n "use-asset" apps/www/registry/default/hooks/use-playback.ts` → no output).
- `DOMException` is not defined in the test runtime.

## Maintenance notes

- Manual check for the reviewer (not automatable here): open the audio-player
  block with a playlist in a browser profile that blocks autoplay, with
  `mediaProps={{ autoPlay: true }}` and `loading={{ autoplayFirst: true }}`.
  Expected after this plan: first track loaded and paused, no error, no skipping.
- With `NotAllowedError`, `playback.status` is left as whatever the `canplay`
  handlers set (normally `paused`). If a UI needs to show "tap to play", a
  dedicated `autoplayBlocked` flag would be the follow-up.
- Plan 015 (exclusive playback provider) assumes this plan has landed.
