# Plan 011: The timeline updates after a seek, a pause and at the end of media

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/hooks/use-timeline.ts`
> If the file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The timeline store (current time, progress) is refreshed by a 500 ms interval
that only runs while the player is playing or buffering. Nothing refreshes it
when the position changes while paused. So if the user presses the ±10 s seek
buttons while paused, or a seek comes from the lock screen, the video frame
moves but the progress bar, the time labels and the media-session position stay
at the old value until playback resumes. At the end of media the last interval
tick can be up to half a second early, so the bar can stop short of 100%.

## Current state

`apps/www/registry/default/hooks/use-timeline.ts`, component `TimelineSetup`:

- Lines 205–260 — `onTimeUpdate` is a `React.useCallback` that reads
  `mediaElement.currentTime`, writes `timeline.currentTime`, `timeline.progress`
  etc. to the store and emits `timeupdate`. It returns early when
  `readyState < MediaReadyState.HAVE_METADATA`.
- Lines 305–306 — the only regular caller:

  ```ts
  const isActive = status === "playing" || status === "buffering"
  useInterval(onTimeUpdate, isActive ? UPDATE_DURATION : null)
  ```

- Lines 308–341 — the listener effect:

  ```ts
  React.useEffect(() => {
    if (!mediaElement || !player) return noop

    const media = mediaElement

    if (canPlay) {
      onTimeUpdate()
      onDurationChange()
      onBuffer()
    }

    on(media, ["durationchange", "loading"], onDurationChange)
    on(media, "progress", onBuffer)
    on(player, ["trackschanged", "loading"], onBuffer)
    on(player, "loading", onLoading)

    return () => {
      off(media, ["durationchange", "loading"], onDurationChange)
      off(media, "progress", onBuffer)
      off(player, ["trackschanged", "loading"], onBuffer)
      off(player, "loading", onLoading)
    }
  }, [
    canPlay,
    mediaElement,
    onBuffer,
    onDurationChange,
    onLoading,
    onTimeUpdate,
    player,
  ])
  ```

  `on` / `off` come from `@/registry/default/lib/utils` and accept either one
  event name or an array of names. `onTimeUpdate` is already in the dependency list.
- `apps/www/registry/default/hooks/use-seek.ts:16` sets `media.currentTime`
  directly and does not touch the timeline store — this is the seek-button path
  that exposes the bug. The browser fires a `seeked` event on the media element
  after any such assignment.
- Repo rule: "Polling intervals: suspend when not observable (paused/ended)".
  This plan keeps the interval as is and adds event-driven refreshes; it does
  not make the interval run while paused.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `apps/www/registry/default/hooks/use-timeline.ts` — the listener effect only

**Out of scope**:
- `use-seek.ts`, `use-interval.ts`, `UPDATE_DURATION`.
- Throttling drag-seeks on the timeline control (a separate performance topic).
- Reading `isLive` / `readyState` lazily inside `onTimeUpdate` — a valid cleanup, not needed for this fix.

## Git workflow

- Branch: `fix/timeline-sync-on-seek`. Commit: `fix: sync timeline on seeked, pause and ended`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Refresh the timeline on `seeked`, `pause` and `ended`

In the listener effect, add after the existing `on(…)` lines:

```ts
    on(media, ["seeked", "pause", "ended"], onTimeUpdate)
```

and in the cleanup, add:

```ts
      off(media, ["seeked", "pause", "ended"], onTimeUpdate)
```

**Verify**: `grep -c '"seeked", "pause", "ended"' apps/www/registry/default/hooks/use-timeline.ts` → `2`.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

## Test plan

Event-driven DOM behaviour; no automated test in this repo's current setup.
Manual check in Maintenance notes.

## Done criteria

- [ ] `grep -c '"seeked", "pause", "ended"' apps/www/registry/default/hooks/use-timeline.ts` → `2`
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only `use-timeline.ts` is modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The `on` helper's type does not accept `"seeked"` for an `HTMLMediaElement`
  target (typecheck fails on the new line).
- The listener effect no longer matches the excerpt.

## Maintenance notes

- Manual check for the reviewer on `/docs/components/seek-controls`: pause,
  press the forward-seek button. The demo has native video controls but no
  separate elapsed label or progress bar. Use `/blocks/video-player` to inspect
  the elapsed label and timeline at media end.
- `onTimeUpdate` also emits the `timeupdate` event, so subscribers now get one
  extra event per seek/pause/end. That is intended.
- While dragging the timeline, every pointer move seeks, so `seeked` fires
  often and each one writes the store once. If scrubbing becomes janky, the fix
  is to throttle seeks in `ui/timeline-control.tsx`, not to remove these listeners.

## Execution note (2026-11-13)

- In the browser, Forward 10 seconds moved the paused demo video's current time
  from 0.084 to 10.084 seconds. The demo has no separate store-backed time label,
  so its timeline-store update was not observed directly there.
- In `/blocks/video-player`, playback from near the end reached `ended: true`,
  the elapsed label showed 10:30, and the timeline slider reached 100%.
