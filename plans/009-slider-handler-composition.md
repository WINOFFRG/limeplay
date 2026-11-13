# Plan 009: Slider components compose user handlers and honour `disabled`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/ui/timeline-control.tsx apps/www/registry/default/ui/volume-control.tsx apps/www/registry/default/ui/playback-rate.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The project rule is "never block event propagation — compose events" and
"always allow prop overrides". Three components break it: if a user passes
their own `onPointerDown`/`onPointerMove`/`onPointerUp` to the timeline or
volume slider, or `onValueChange` to the playback-rate select, their prop
silently *replaces* the component's own handler and seeking, volume dragging or
rate changes stop working. In addition the timeline ignores `disabled` (a
disabled timeline still seeks), its hover flag is never cleared when the
pointer leaves, and a thumb pinned at `position={0}` is ignored.

## Current state

- `apps/www/registry/default/ui/timeline-control.tsx`
  - line 28: `const { className, orientation = "horizontal", ...etc } = props`
  - line 36: `const disabled = props.disabled || readyState < MediaReadyState.HAVE_METADATA`
  - lines 57–98: `const trackEvents = useTrackEvents({ onPointerDown: …, onPointerMove: …, onPointerUp: () => { setIsHovering(false) }, orientation })`.
    `onPointerDown` calls `seek(liveSeekTime)`; `onPointerMove` calls
    `setHoveringTime(newTime)`, `setIsHovering(true)` and, when the pointer is
    down, `seek(liveSeekTime)`. Neither checks `disabled`. No `onPointerOut` is passed.
  - lines 100–119, the render:

    ```tsx
      <SliderPrimitive.Root
        aria-label="Timeline Slider"
        className={…}
        orientation={orientation}
        ref={internalRef}
        value={[currentValue]}
        {...trackEvents}
        {...etc}
        disabled={disabled}
      />
    ```

    `{...etc}` comes after `{...trackEvents}`, so a user's pointer handler wins.
  - line 257, in `Thumb`: `if (position && Number.isFinite(position)) {` — `0` is falsy.
- `apps/www/registry/default/ui/volume-control.tsx`
  - line 23: `const { className, orientation = "horizontal", ...etc } = props`
  - lines 49–65: `useTrackEvents({ onPointerDown, onPointerMove, orientation })`;
    both callbacks start with `if (disabled) return` — this is the pattern to copy.
  - lines 84–87: same `{...trackEvents}` then `{...etc}` order.
- `apps/www/registry/default/hooks/use-track-events.ts` — returns
  `{ onPointerDown, onPointerMove, onPointerOut, onPointerUp }`, each typed
  `(e: React.PointerEvent<E>) => void`. Its options accept an optional
  `onPointerOut?: (event) => void`.
- `apps/www/registry/default/ui/playback-rate.tsx:12-25`:

  ```tsx
  export function SelectRoot(
    props: React.ComponentProps<typeof SelectPrimitive>
  ) {
    const setPlaybackRate = usePlaybackRateStore((state) => state.setPlaybackRate)
    const value = usePlaybackRateStore((state) => state.value)

    return (
      <SelectPrimitive
        onValueChange={(value) => setPlaybackRate(Number(value))}
        value={value.toString()}
        {...props}
      />
    )
  }
  ```

- Exemplar for composing handlers in this repo: the button controls call the
  user's handler first and skip their own if `event.defaultPrevented`, e.g.
  `apps/www/registry/default/ui/mute-control.tsx`. Match that order.
- Conventions: no `any`; `React.useCallback` for handlers in high-frequency components.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 (run `bunx prettier --write <file>` on files you changed) |

## Scope

**In scope**:
- `apps/www/registry/default/ui/timeline-control.tsx` (`Root` and the one condition in `Thumb`)
- `apps/www/registry/default/ui/volume-control.tsx` (`Root`)
- `apps/www/registry/default/ui/playback-rate.tsx` (`SelectRoot`)

**Out of scope**:
- `apps/www/registry/default/hooks/use-track-events.ts` — do not change its API.
- Keyboard support for the sliders — plan 010.
- `Buffered` applying `className` twice (`timeline-control.tsx:220-227`) — left
  alone; changing it alters the look of the audio block.
- The block wrappers under `apps/www/registry/default/blocks/`.

## Git workflow

- Branch: `fix/slider-handler-composition`. Commit: `fix: compose user handlers in slider controls`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Timeline — honour `disabled`, clear hover, compose handlers

In `timeline-control.tsx` `Root`:

1. Pull the user's handlers out of the props:

   ```ts
   const {
     className,
     onPointerDown: onPointerDownProp,
     onPointerMove: onPointerMoveProp,
     onPointerOut: onPointerOutProp,
     onPointerUp: onPointerUpProp,
     orientation = "horizontal",
     ...etc
   } = props
   ```

2. In the `useTrackEvents` options: add `if (disabled) return` as the first
   line of both `onPointerDown` and `onPointerMove`, and add

   ```ts
   onPointerOut: (event) => {
     if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
       setIsHovering(false)
     }
   },
   ```

   (`disabled` is declared on line 36, before `useTrackEvents` — keep it there.)

3. Replace `{...trackEvents}` and `{...etc}` in the JSX with `{...etc}` followed
   by four explicit handlers:

   ```tsx
        {...etc}
        disabled={disabled}
        onPointerDown={(event) => {
          onPointerDownProp?.(event)
          if (!event.defaultPrevented) trackEvents.onPointerDown(event)
        }}
        onPointerMove={(event) => {
          onPointerMoveProp?.(event)
          if (!event.defaultPrevented) trackEvents.onPointerMove(event)
        }}
        onPointerOut={(event) => {
          onPointerOutProp?.(event)
          if (!event.defaultPrevented) trackEvents.onPointerOut(event)
        }}
        onPointerUp={(event) => {
          onPointerUpProp?.(event)
          if (!event.defaultPrevented) trackEvents.onPointerUp(event)
        }}
   ```

4. In `Thumb`, change line 257 to:
   `if (position !== undefined && Number.isFinite(position)) {`

**Verify**: `cd apps/www && bun run typecheck` → exit 0. If the event type of
the Base UI `Root` prop does not match `React.PointerEvent<HTMLDivElement>`,
STOP (see STOP conditions) rather than casting to `any`.

### Step 2: Volume — compose handlers

Apply items 1 and 3 of Step 1 to `volume-control.tsx` `Root` (it already checks
`disabled`; it has no hover state, so do not add `onPointerOut` logic beyond
composing the returned `trackEvents.onPointerOut`).

**Verify**: `cd apps/www && bun run typecheck` → exit 0.

### Step 3: Playback rate — call both handlers

Change `SelectRoot` to:

```tsx
export function SelectRoot({
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive>) {
  const setPlaybackRate = usePlaybackRateStore((state) => state.setPlaybackRate)
  const value = usePlaybackRateStore((state) => state.value)

  return (
    <SelectPrimitive
      value={value.toString()}
      {...props}
      onValueChange={(nextValue) => {
        setPlaybackRate(Number(nextValue))
        onValueChange?.(nextValue)
      }}
    />
  )
}
```

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

## Test plan

These are React components with pointer events; the repo has no DOM test
environment, so no automated test is added. Manual check in Maintenance notes.

## Done criteria

- [ ] `grep -n "{...trackEvents}" apps/www/registry/default/ui/timeline-control.tsx apps/www/registry/default/ui/volume-control.tsx` → no output
- [ ] `grep -c "if (disabled) return" apps/www/registry/default/ui/timeline-control.tsx` → `2`
- [ ] `grep -n "position && Number.isFinite" apps/www/registry/default/ui/timeline-control.tsx` → no output
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only the three in-scope files are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- The handler prop types on `SliderPrimitive.Root` are incompatible with the
  functions returned by `useTrackEvents` without a cast.
- `SelectPrimitive`'s `onValueChange` passes more than one argument that the
  user callback needs (check the type; if so, forward all arguments with
  `(...args) => { setPlaybackRate(Number(args[0])); onValueChange?.(...args) }`
  only if it typechecks cleanly — otherwise STOP).

## Maintenance notes

- Manual check for the reviewer, in `bun run dev` on the video-player block:
  drag-seek still works; hovering then leaving the timeline hides the hover
  thumb/time; `<Timeline.Root disabled>` no longer seeks; passing
  `onPointerDown={() => console.log("x")}` logs **and** seeks.
- `use-track-events.ts` calls `stopPropagation()` and `preventDefault()` on every
  pointer event, which itself conflicts with the "never block propagation"
  rule. Not changed here because blocks may rely on it; worth a separate look.
