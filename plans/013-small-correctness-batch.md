# Plan 013: Four small, independent correctness fixes

> **Executor instructions**: Follow this plan step by step. Each step is an
> independent fix with its own commit. Run every verification command and
> confirm the expected result before moving to the next step. If anything in
> the "STOP conditions" section occurs, stop and report — do not improvise.
> When done, update the status row for this plan in `plans/README.md` — unless
> a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/lib/time.ts apps/www/registry/default/ui/timeline-labels.tsx apps/www/registry/default/hooks/use-playlist.ts apps/www/registry/default/hooks/use-captions.ts apps/www/registry/default/blocks/video-player/player.tsx`
> Plan 004 adds four `export` keywords in `use-playlist.ts`; that is expected.
> For anything else, compare the "Current state" excerpts against the live
> code; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/004-unit-test-baseline.md
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

Four user-visible defects, each small enough that a dedicated plan would be
overhead:

1. Every `<time dateTime="…">` rendered by the time labels is wrong whenever a
   player exists (`PT0S` for a 10-minute video) — a units bug flagged by a
   `TODO` in the code.
2. With shuffle + repeat-all, the reshuffle at the end of a cycle starts the new
   cycle at a random point in the new order, so most tracks are skipped that cycle.
3. Turning captions off and on again forgets the language the viewer picked.
4. `VideoPlayer`'s `theme` prop documents `@default dark` and types
   `"dark" | "light"`, but the code defaults to `"auto"`.

## Current state

### 1 — `durationDateTime`

`apps/www/registry/default/lib/time.ts:1-21`:

```ts
import type shaka from "shaka-player"

import { intervalToDuration } from "date-fns/intervalToDuration"

const MAX_SAFE_SECONDS = 8.64e12

export function durationDateTime(
  durationSeconds: number,
  seekRange?: shaka.extern.BufferedRange
) {
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
    return "PT0S"
  }

  // TODO: There is a possible bug here as seekRange returns in seconds
  const duration = intervalToDuration(
    seekRange ?? {
      end: durationSeconds * 1000,
      start: 0,
    }
  )
```

When `seekRange` is passed, `durationSeconds` is ignored and the range (in
seconds) is read as millisecond timestamps. Verified by running it:
`durationDateTime(600)` → `"PT10M"`, `durationDateTime(600, { start: 0, end: 600 })` → `"PT0S"`.

`apps/www/registry/default/ui/timeline-labels.tsx` passes the range from four
components, each of which selects the player only for this purpose:

- line 21 `const player = usePlayerStore((state) => state.instance)` / line 25 `dateTime={durationDateTime(currentTime, player?.seekRange())}`
- lines 50 / 55 `durationDateTime(duration - currentTime, player?.seekRange())`
- lines 80 / 85 `durationDateTime(duration, player?.seekRange())`
- lines 103 / 112 `durationDateTime(hoveringTime, player?.seekRange())`
- line 4: `import { usePlayerStore } from "@/registry/default/hooks/use-player"`

### 2 — Reshuffle

`apps/www/registry/default/hooks/use-playlist.ts:277-299`, start of `next`:

```ts
        next: () => {
          const playlist = get().playlist as PlaylistStore["playlist"]
          const nextIndex = playlist.getNextIndex()
          if (nextIndex === -1 || nextIndex >= playlist.queue.length)
            return false

          // When shuffle+repeatMode=all and we're at the end of the current order,
          // generate and persist a new shuffle order for the next cycle
          if (
            playlist.shuffle &&
            playlist.shuffleOrder.length > 0 &&
            playlist.repeatMode === "all"
          ) {
            const currentPos = playlist.shuffleOrder.indexOf(
              playlist.currentIndex
            )
            if (currentPos === playlist.shuffleOrder.length - 1) {
              const newShuffleOrder = createShuffleOrder(playlist.queue.length)
              set(({ playlist: p }) => {
                p.shuffleOrder = newShuffleOrder
              })
            }
          }
```

`nextIndex` was computed from the **old** order (`shuffleOrder[0]`), then the
order is replaced. Playback continues from wherever that index sits in the new order.

### 3 — Caption track memory

`apps/www/registry/default/hooks/use-captions.ts`:

- lines 40–47, the slice type:

  ```ts
    [CAPTIONS_FEATURE_KEY]: {
      activeTrack: null | shaka.extern.TextTrack
      containerElement: HTMLDivElement | null
      setContainerElement: (ref: HTMLDivElement | null) => void
      toggleVisibility: () => void
      tracks?: shaka.extern.TextTrack[]
      visible: boolean
    }
  ```

- lines 65–69, in `toggleVisibility`:

  ```ts
          const track =
            captions.activeTrack ?? findDefaultTrack(captions.tracks)
          if (track) {
            player.selectTextTrack(track)
          }
  ```

- lines 106–116, in `syncTextTrackState`:

  ```ts
    const tracks = player.getTextTracks()
    const activeTrack = tracks.find(
      (track: shaka.extern.TextTrack) => track.active
    )

    store.setState(({ captions }) => {
      captions.activeTrack = activeTrack ?? null
      captions.tracks = tracks
      captions.visible = Boolean(activeTrack)
    })
  ```

  When captions are hidden no track is active, so `activeTrack` becomes `null`
  and the next toggle falls back to the default track. `activeTrack` is
  documented (`apps/www/content/docs/hooks/use-captions.mdx:41`) as "Currently
  active text track" — keep that meaning.

### 4 — `theme` default

`apps/www/registry/default/blocks/video-player/player.tsx:51-54` and `:70`, `:78`:

```ts
  /**
   * @default dark
   */
  theme?: "dark" | "light"
…
      theme = "auto",
…
          className={cn(className, theme === "dark" && "dark")}
```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Tests | `cd apps/www && bun test` | all pass |
| Typecheck | `cd apps/www && bun run typecheck` | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `apps/www/registry/default/lib/time.ts`, `apps/www/registry/default/ui/timeline-labels.tsx`
- `apps/www/registry/default/hooks/use-playlist.ts` (the `next` action only)
- `apps/www/registry/default/hooks/use-captions.ts`, `apps/www/content/docs/hooks/use-captions.mdx` (one table row)
- `apps/www/registry/default/blocks/video-player/player.tsx` (the `theme` type and JSDoc only)
- `apps/www/tests/time.test.ts`, `apps/www/tests/playlist-helpers.test.ts` (add cases)

**Out of scope**:
- Who owns `media.loop` when both playlist repeat and `playback.setLoop` are used
  (`use-playlist.ts:813-817` vs `use-playback.ts:156-166`) — needs a maintainer decision.
- Changing the runtime `theme` default — this plan only makes the type and docs truthful.
- Registry metadata: `timeline-labels` may still list `use-player` as a registry
  dependency after Step 1; leaving it is harmless.

## Git workflow

- Branch: `fix/small-correctness-batch`. One commit per step, e.g.
  `fix: time label dateTime uses the label value`, `fix: start reshuffled cycle at its first item`,
  `fix: remember caption track across toggle`, `fix: document video player theme default`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: `durationDateTime` uses only the duration

1. In `time.ts`: remove the `seekRange` parameter, the `import type shaka` line
   and the `TODO` comment; call `intervalToDuration({ end: durationSeconds * 1000, start: 0 })`.
2. In `timeline-labels.tsx`: drop the second argument in all four calls; remove
   the four `const player = usePlayerStore(…)` lines and the `usePlayerStore`
   import **if** `player` is no longer used in that component / file (lint will
   tell you: an unused variable is an error).
3. In `apps/www/tests/time.test.ts` add: for each of `0`, `59`, `600`, `3661`,
   the result of `durationDateTime(n)` is `"PT0S"`, `"PT59S"`, `"PT10M"`, `"PT1H1M1S"`.

**Verify**: `grep -rn "seekRange" apps/www/registry/default/lib/time.ts apps/www/registry/default/ui/timeline-labels.tsx` → no output.
**Verify**: `cd apps/www && bun test && bun run typecheck` → pass / exit 0; `bun run lint` → 0 errors.

### Step 2: Start the reshuffled cycle at its first item

In `next`, change `const nextIndex` to `let nextIndex`, and replace the inner
`if (currentPos === …)` block with:

```ts
            if (currentPos === playlist.shuffleOrder.length - 1) {
              const newShuffleOrder = createShuffleOrder(playlist.queue.length)
              const lastPosition = newShuffleOrder.length - 1

              // Avoid replaying the track that just finished.
              if (lastPosition > 0 && newShuffleOrder[0] === playlist.currentIndex) {
                newShuffleOrder[0] = newShuffleOrder[lastPosition]
                newShuffleOrder[lastPosition] = playlist.currentIndex
              }

              set(({ playlist: p }) => {
                p.shuffleOrder = newShuffleOrder
              })
              nextIndex = newShuffleOrder[0]
            }
```

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun test` → all pass.

### Step 3: Remember the last selected caption track

1. Add `lastSelectedTrack: null | shaka.extern.TextTrack` to the slice type
   (keep keys alphabetically ordered, as the file does) and
   `lastSelectedTrack: null,` to the initial state in `createSlice`.
2. In `syncTextTrackState`, inside the `setState` callback, add after the
   existing three assignments:

   ```ts
      if (activeTrack) {
        captions.lastSelectedTrack = activeTrack
      } else if (
        captions.lastSelectedTrack &&
        !tracks.some((track) => track.id === captions.lastSelectedTrack?.id)
      ) {
        captions.lastSelectedTrack = null
      }
   ```

   (The second branch forgets the track when a new asset no longer has it.)
3. In `toggleVisibility`, change the fallback chain to:
   `captions.activeTrack ?? captions.lastSelectedTrack ?? findDefaultTrack(captions.tracks)`.
4. In `apps/www/content/docs/hooks/use-captions.mdx`, add a row under the
   `activeTrack` row of the state table:
   `` | `lastSelectedTrack` | `shaka.extern.TextTrack \| null` | Track that was active before captions were hidden | `` (match the column widths loosely; prettier ignores `.mdx`).

**Verify**: `grep -c "lastSelectedTrack" apps/www/registry/default/hooks/use-captions.ts` → at least `6`.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 4: Make the `theme` type and JSDoc match the code

In `player.tsx` change the prop declaration to:

```ts
  /**
   * `"auto"` inherits the surrounding theme.
   * @default "auto"
   */
  theme?: "auto" | "dark" | "light"
```

Do not change line 70 or line 78.

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

## Test plan

- `tests/time.test.ts`: the four `durationDateTime` cases in Step 1.
- `tests/playlist-helpers.test.ts`: no new case is required for Step 2 (the
  `next` action needs a store); if plan 004's follow-up slice tests exist by
  then, add "after the last shuffled item with repeat all, `currentIndex`
  equals the new `shuffleOrder[0]` and differs from the previous index".

## Done criteria

- [ ] `grep -rn "seekRange" apps/www/registry/default/lib/time.ts apps/www/registry/default/ui/timeline-labels.tsx` → no output
- [ ] `grep -n "let nextIndex" apps/www/registry/default/hooks/use-playlist.ts` → one match
- [ ] `grep -c "lastSelectedTrack" apps/www/registry/default/hooks/use-captions.ts` ≥ 6
- [ ] `grep -n '"auto" | "dark" | "light"' apps/www/registry/default/blocks/video-player/player.tsx` → one match
- [ ] `cd apps/www && bun test` exits 0; typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] No files outside the in-scope list are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `durationDateTime` has callers outside `timeline-labels.tsx` that pass a
  second argument (`grep -rn "durationDateTime(" apps/www --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out`).
- `shaka.extern.TextTrack` has no `id` field in the installed typings.
- Another file extends `VideoPlayerProps` and breaks on the widened `theme`
  type (the pro blocks in `apps/www/registry/pro/blocks/*/player.tsx` extend it;
  typecheck covers them when the submodule is checked out).

## Maintenance notes

- Same boundary family, not fixed here: `timeline-labels.tsx` shows hours only
  when `duration > 3600`, so media exactly one hour long renders its duration
  as `00:00`. Changing `>` to `>=` on lines 32, 62, 90, 117 fixes it; left out
  to keep this plan's diff reviewable.
- `lastSelectedTrack` is a new public store field; mention it in release notes.
