# Plan 010 (investigate): Timeline and volume sliders respond to the keyboard

> **Executor instructions**: This is an **investigation plan**. Its output is a
> short written report plus, only if every gate passes, a small code change.
> Follow it step by step. If anything in the "STOP conditions" section occurs,
> stop and report — do not improvise. When done, update the status row for
> this plan in `plans/README.md` — unless a reviewer dispatched you and told
> you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/ui/timeline-control.tsx apps/www/registry/default/ui/volume-control.tsx`
> Plan 009 edits both files (handler composition); that is expected. Any other
> change: compare against "Current state" and treat a mismatch as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (touches the primary seek interaction; needs a human in a browser)
- **Depends on**: plans/009-slider-handler-composition.md
- **Category**: bug (accessibility)
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The project's own rules say "Full keyboard support (Space, Enter, Arrow keys,
M, F)" and "Visible focus styles" are non-negotiable. The timeline and volume
sliders are built on Base UI's `Slider`, are given a controlled `value`, and
are never given `onValueChange`. Pointer input is handled by the project's own
pointer handlers, but nothing handles keys, so a keyboard or screen-reader user
cannot seek or change the volume. The README also promises "keyboard navigation".

**Confidence note**: the missing `onValueChange` was confirmed by reading this
repo's code. How Base UI behaves when it is added (in particular whether it
also fires during pointer drags and fights the existing handlers) was reported
by an audit sub-agent from reading `node_modules/@base-ui/react` and has **not**
been verified by the plan author. That is why this is an investigation plan.

## Current state

- `apps/www/registry/default/ui/timeline-control.tsx:100-119` — `Root` renders
  `<SliderPrimitive.Root … value={[currentValue]} … />` where
  `currentValue = duration ? (currentTime / duration) * 100 : 0` (a 0–100
  percentage). There is no `onValueChange`. Store actions available in this
  component: `seek` (`useTimelineStore((state) => state.seek)`, takes a time in
  seconds), `duration`, `isLive`, `player` (`player.seekRange()` gives
  `{ start, end }` for live streams).
- Lines 62–67 show how a percentage is mapped to a seek time for live streams:

  ```ts
        const liveSeekTime = isLive
          ? seekRange.start +
            (newTime / duration) * (seekRange.end - seekRange.start)
          : newTime
  ```

- `apps/www/registry/default/ui/volume-control.tsx:74-88` — `Root` renders
  `<SliderPrimitive.Root … min={0} … step={0.01} value={[currentVolumeValue]} … />`
  with no `onValueChange`. `setVolume` (`useVolumeStore((state) => state.setVolume)`)
  takes 0–1.
- `grep -rn "onKeyDown\|keydown" apps/www/registry/default` matches only
  `hooks/use-idle.ts` (idle-timer reset). There is no key handling for controls.
- The blocks render two `Thumb` elements per slider (one for the current value,
  one hover indicator): `apps/www/registry/default/blocks/video-player/components/timeline-slider-control.tsx:47,55`.
  Each Base UI `Thumb` renders its own hidden range input, so a single-value
  slider ends up with two tab stops.
- `timeline-control.tsx:140` puts `tabIndex={0}` on the `Track` — a focusable
  element with no role and no key handling.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Dev server | `cd apps/www && bun run registry:build && bun run dev` | site on `http://localhost:3000` |
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |

## Scope

**In scope**:
- `apps/www/registry/default/ui/timeline-control.tsx`, `apps/www/registry/default/ui/volume-control.tsx`
- A report file: `plans/010-findings.md` (create)

**Out of scope**:
- Global shortcuts (Space, M, F, arrow keys on the player container) — a
  separate feature; see "Direction" in `plans/README.md`.
- The blocks' second hover `Thumb` — report on it, do not restructure the blocks.
- `use-track-events.ts`.

## Git workflow

- Branch: `fix/slider-keyboard`. Commit: `fix: keyboard support for timeline and volume sliders`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Read how Base UI's slider reports changes

Read `apps/www/node_modules/@base-ui/react/slider/root/SliderRoot.d.ts` (or the
path that `@base-ui/react/slider` resolves to under `node_modules`). Write down
in `plans/010-findings.md`:

1. The exact signature of `onValueChange` (arguments and their types).
2. Whether the event details distinguish keyboard from pointer input (look for
   a `reason` or similar field).
3. The props that set the arrow-key step and the large (Page Up/Down) step.

**Verify**: `plans/010-findings.md` exists and answers all three.

### Step 2: Add `onValueChange` to the volume slider (the lower-risk one)

In `volume-control.tsx` `Root`, pull `onValueChange: onValueChangeProp` out of
props and pass to `SliderPrimitive.Root`:

```tsx
      onValueChange={(nextValue, eventDetails) => {
        onValueChangeProp?.(nextValue, eventDetails)
        if (disabled) return
        const nextVolume = Array.isArray(nextValue) ? nextValue[0] : nextValue
        setCurrentValue(nextVolume)
        setVolume(nextVolume)
      }}
```

Adjust the parameter list to the signature you recorded in Step 1.

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 3: Browser check — gate for continuing

**This step needs a human or a browser-automation tool. If you have neither, STOP here and report Steps 1–2.**

Open `http://localhost:3000/docs/components/volume-control`, load the demo,
and check:

1. Tab to the volume thumb; Arrow Left/Right changes the volume and the fill moves.
2. Dragging with the mouse still works and is not jumpy.
3. Clicking on the track still jumps to that position.

Record the three results in `plans/010-findings.md`. If 2 or 3 regressed,
revert Step 2 (`git checkout -- apps/www/registry/default/ui/volume-control.tsx`
if plan 009 is already committed) and STOP.

### Step 4: Apply the same to the timeline

In `timeline-control.tsx` `Root`, pull out `onValueChange: onValueChangeProp` and add:

```tsx
      onValueChange={(nextValue, eventDetails) => {
        onValueChangeProp?.(nextValue, eventDetails)
        if (disabled || !duration || !player) return
        const percent = Array.isArray(nextValue) ? nextValue[0] : nextValue
        const nextTime = (percent / 100) * duration
        const seekRange = player.seekRange()
        seek(
          isLive
            ? seekRange.start +
                (nextTime / duration) * (seekRange.end - seekRange.start)
            : nextTime
        )
      }}
```

Also remove `tabIndex={0}` from the `Track` (line 140), and give the timeline
`Thumb` an accessible value text if Base UI exposes a prop for it (recorded in
Step 1); use `formatTimestamp` from `@/registry/default/lib/time`.

A 1% arrow step is too coarse for long media and too fine for short media. If
Base UI has a `step` prop, set it so one arrow press is about 5 seconds:
`step={duration ? Math.min(100, (5 / duration) * 100) : 1}`.

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.
**Verify (browser, same gate as Step 3)** on `/blocks/video-player`: arrows
seek; drag-seek, click-seek and hover preview still work; live stream demo
still seeks within its window.

## Test plan

No DOM test environment exists in this repo; verification is the browser
checklist in Steps 3 and 4, recorded in `plans/010-findings.md`.

## Done criteria

- [ ] `plans/010-findings.md` exists with Step 1 answers and Step 3/4 browser results
- [ ] `grep -n "onValueChange" apps/www/registry/default/ui/timeline-control.tsx apps/www/registry/default/ui/volume-control.tsx` → matches in both files (or the plan was stopped at a gate and the report says why)
- [ ] `grep -n "tabIndex={0}" apps/www/registry/default/ui/timeline-control.tsx` → no output
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] `plans/README.md` status row updated (DONE, or BLOCKED with the gate that failed)

## STOP conditions

- No browser is available for Step 3 (report Steps 1–2 and stop).
- `onValueChange` also fires during pointer drags **and** causes visible
  double-seeking or jitter that cannot be removed by checking the event's
  reason field.
- The Base UI version installed is not 1.7.x (`grep '"version"' apps/www/node_modules/@base-ui/react/package.json`).

## Maintenance notes

- Screen-reader output (announced value, label) was not assessed; ask someone
  with VoiceOver or NVDA to check the timeline thumb after this lands.
- `shortcut="P"` on the picture-in-picture control
  (`apps/www/registry/default/blocks/video-player/components/pip-control.tsx:15`)
  sets `aria-keyshortcuts` and announces a shortcut that nothing binds. Until a
  shortcuts feature exists, consider removing that prop from the block.
- The duplicate tab stop from the hover `Thumb` in both blocks should be
  replaced with a plain positioned element; that is a block-level change.
