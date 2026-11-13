# Plan 007: Two playing players no longer fight over the media session

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/hooks/use-media-session.ts`
> If the file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as
> a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The browser has one Media Session (lock-screen / media-key controls), so the
library keeps a module-level "owner" and lets a player take ownership when it
starts playing. The take-over is re-run every time the owner changes. When two
players are both playing — for example a muted background video and an audio
player — each one sees the other take ownership and immediately takes it back.
That is an unbounded synchronous update loop; React aborts it with "Maximum
update depth exceeded". After this plan a player forces ownership only at the
moment it starts wanting it, not every time someone else takes it.

This conclusion comes from reading the code; it was not reproduced in a
browser. The logic is described below so you can confirm it.

## Current state

`apps/www/registry/default/hooks/use-media-session.ts`:

- Lines 408–424 — `useMediaSessionSync` reads the current owner with
  `useSyncExternalStore`, so every owner change re-renders every player:

  ```ts
  export function useMediaSessionSync({
    actions,
    active = true,
    claim = false,
    …
  }: UseMediaSessionSyncOptions): UseMediaSessionReturn {
    const mediaSession = useMediaSession()
    const owner = React.useRef<symbol>(MEDIA_SESSION_OWNER_FALLBACK)
    const retainedPosition = React.useRef<null | RetainedMediaPositionState>(null)
    const currentOwner = React.useSyncExternalStore(
      subscribeMediaSessionOwner,
      getMediaSessionOwner,
      getServerMediaSessionOwner
    )
  ```

- Lines 431–444 — the claim effect (note `currentOwner` in the dependency list):

  ```ts
    React.useEffect(() => {
      if (!active) {
        if (getMediaSessionOwner() === owner.current) {
          mediaSession.clearMetadata()
          mediaSession.clearPositionState()
          mediaSession.setPlaybackState("none")
          retainedPosition.current = null
          releaseMediaSessionOwner(owner.current)
        }
        return
      }

      claimMediaSessionOwner(owner.current, claim)
    }, [active, claim, currentOwner, mediaSession])
  ```

- Lines 520–526 — a forced claim always overwrites and notifies:

  ```ts
  function claimMediaSessionOwner(owner: symbol, force: boolean) {
    if (mediaSessionOwner === owner) return
    if (mediaSessionOwner !== null && !force) return

    mediaSessionOwner = owner
    notifyMediaSessionOwnerListeners()
  }
  ```

- Both blocks pass `claim: status === "playing"`
  (`apps/www/registry/default/blocks/video-player/components/media-session-controller.tsx:126`,
  `apps/www/registry/default/blocks/audio-player/components/media-session-controller.tsx:104`).

The loop: A and B are both playing, so both have `claim === true`. A owns. B's
effect runs → forced claim → owner = B → listeners notified → A re-renders with
a new `currentOwner` → A's effect re-runs → forced claim → owner = A → B
re-renders → …

Conventions: refs for values that must not trigger renders; no `any`; minimal comments.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit` if plan 001 is not applied) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |
| Tests (if plan 004 applied) | `cd apps/www && bun test` | all pass |

## Scope

**In scope**:
- `apps/www/registry/default/hooks/use-media-session.ts` — the claim effect in `useMediaSessionSync` only

**Out of scope**:
- `claimMediaSessionOwner`, `releaseMediaSessionOwner` and the other module-level functions.
- Both `media-session-controller.tsx` files.
- `apps/www/registry/default/ui/exclusive-playback-provider.tsx`.

## Git workflow

- Branch: `fix/media-session-claim-loop`. Commit: `fix: claim media session only when playback starts`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Force the claim only on the false → true edge of `claim`

Add a ref next to `retainedPosition`:

```ts
  const previousClaim = React.useRef(false)
```

Replace the claim effect with:

```ts
  React.useEffect(() => {
    if (!active) {
      previousClaim.current = false

      if (getMediaSessionOwner() === owner.current) {
        mediaSession.clearMetadata()
        mediaSession.clearPositionState()
        mediaSession.setPlaybackState("none")
        retainedPosition.current = null
        releaseMediaSessionOwner(owner.current)
      }
      return
    }

    const shouldForceClaim = claim && !previousClaim.current
    previousClaim.current = claim

    claimMediaSessionOwner(owner.current, shouldForceClaim)
  }, [active, claim, currentOwner, mediaSession])
```

Resulting behaviour, which you should confirm by reading:

- A player that starts playing (`claim` goes false → true) takes ownership. Same as before.
- When another player takes ownership, this player's effect re-runs with
  `shouldForceClaim === false`, so it does not take it back. The loop is gone.
- When the owner releases (owner becomes `null`), the non-forced claim still
  succeeds, so a remaining active player picks the session up. Same as before.
- A player that pauses and plays again produces a new edge and reclaims.

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

## Test plan

`claimMediaSessionOwner` and the owner variable are module-private and the
effect needs React, so there is no unit test in this plan. The reviewer's
manual check is in Maintenance notes.

## Done criteria

- [ ] `grep -n "previousClaim" apps/www/registry/default/hooks/use-media-session.ts` → at least 4 matches
- [ ] `grep -n "claimMediaSessionOwner(owner.current, claim)" apps/www/registry/default/hooks/use-media-session.ts` → no output
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only `use-media-session.ts` is modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The claim effect does not match the excerpt.
- You find another caller of `claimMediaSessionOwner` besides this effect
  (`grep -n "claimMediaSessionOwner(" apps/www/registry/default/hooks/use-media-session.ts`
  should show the definition and one call).

## Maintenance notes

- Manual check for the reviewer: render a `VideoPlayer` and an `AudioPlayer` on
  one page **without** `ExclusivePlaybackProvider`, start both. Before: console
  error "Maximum update depth exceeded" (or a frozen tab). After: no error; the
  lock-screen controls follow whichever player started most recently.
- React StrictMode runs the effect twice on mount. The second run is a
  non-forced claim; it succeeds because the simulated unmount released
  ownership in between.
- Open design question for the maintainer (not part of this plan): should
  media-session ownership follow `ExclusivePlaybackProvider`'s active player?
  Today they are independent mechanisms.
