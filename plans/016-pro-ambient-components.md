# Plan 016: The pro ambient components stop burning frames, honour `asChild` and reduced motion

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **This plan edits a git submodule.** `apps/www/registry/pro` is a separate
> repository (`limeplay-pro`). Commits for Steps 1–3 are made **inside** that
> directory; the parent repository then records the new submodule commit.
>
> **Drift check (run first)**: `git -C apps/www/registry/pro rev-parse --short HEAD`
> → expected `8d8d975`. If it differs, run
> `git -C apps/www/registry/pro diff --stat 8d8d975..HEAD -- ui/media-ambient.tsx ui/media-glow.tsx`
> and compare the "Current state" excerpts against the live code; on a
> mismatch, treat it as a STOP condition. If the directory is empty, the
> submodule is not checked out: STOP.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: MED (visual components; needs a human to look at the result)
- **Depends on**: none
- **Category**: bug
- **Planned at**: parent commit `9e75eb9`, submodule commit `8d8d975`, 2026-11-13

## Why this matters

The pro submodule holds two visual components that paint a blurred glow behind
the video: `MediaAmbient` (slow crossfade, samples a frame every 5 s) and
`MediaGlow` (samples ~15 frames per second). Three defects:

1. `MediaAmbient` runs a `requestAnimationFrame` loop on every display frame,
   forever — including while paused — only to check whether 5 seconds have
   passed. That is ~60 wake-ups per second to do work every 300th frame.
2. `MediaAmbient` accepts `asChild` but, when it is set, the user's child
   element is discarded and the wrapper's props are merged onto the component's
   own inner `div` instead.
3. Neither component respects `prefers-reduced-motion`, which the project lists
   as non-negotiable ("Respect `prefers-reduced-motion`").

## Current state

All paths relative to `apps/www/registry/pro/`.

- `ui/media-ambient.tsx:153-156` — config is merged into one object whose
  identity changes whenever the caller passes an inline `config={{…}}` (the
  component's own JSDoc example does exactly that):

  ```tsx
      const config = React.useMemo(
        () => ({ ...DEFAULT_CONFIG, ...configOverride }),
        [configOverride]
      )
  ```

  `updateFrame` (lines 223–292) depends on `config`, and the sampling effect
  depends on `updateFrame`, so an unstable `config` re-subscribes everything on
  each parent render.
- `ui/media-ambient.tsx:294-339` — the sampling effect:

  ```tsx
      React.useEffect(() => {
        if (!isReady) return

        if (!isVideoElement(mediaElement)) return

        const sampleFrame = (timestamp: number) => {
          const elapsed = timestamp - lastUpdateTimeRef.current

          // Only update at the specified interval (default: 5 seconds)
          if (elapsed >= config.minImageUpdateIntervalMs) {
            if (
              !mediaElement.paused &&
              mediaElement.videoWidth > 0 &&
              mediaElement.videoHeight > 0
            ) {
              updateFrame()
              lastUpdateTimeRef.current = timestamp
            }
          }

          animationFrameRef.current = requestAnimationFrame(sampleFrame)
        }

        // Initial frame capture when video data is loaded
        const handleLoadedData = () => {
          updateFrame(true)
          lastUpdateTimeRef.current = performance.now()
        }

        // Update frame on seek for immediate feedback
        const handleSeeked = () => {
          updateFrame()
          lastUpdateTimeRef.current = performance.now()
        }

        mediaElement.addEventListener("loadeddata", handleLoadedData)
        mediaElement.addEventListener("seeked", handleSeeked)
        animationFrameRef.current = requestAnimationFrame(sampleFrame)

        return () => {
          cancelAnimationFrame(animationFrameRef.current)
          mediaElement.removeEventListener("loadeddata", handleLoadedData)
          mediaElement.removeEventListener("seeked", handleSeeked)
        }
      }, [isReady, mediaElement, config.minImageUpdateIntervalMs, updateFrame])
  ```

- `ui/media-ambient.tsx:341-371` — the render:

  ```tsx
      const composedRef = composeRefs(forwardedRef, containerRef)
      const Comp = asChild ? Slot : "div"

      return (
        <Comp
          aria-hidden="true"
          className={cn("pointer-events-none", className)}
          ref={composedRef}
          style={{ … }}
          {...etc}
        >
          <div
            ref={innerContainerRef}
            style={{ … }}
          />
        </Comp>
      )
  ```

  `Slot` merges its props into its single child. Here the only child is the
  component's own inner `div`, so with `asChild` the wrapper disappears and the
  caller's `children` (inside `...etc`, overridden by the explicit child) are dropped.
  Imports on lines 3–4: `composeRefs` from `@radix-ui/react-compose-refs`,
  `Slot` from `@radix-ui/react-slot`.
- `ui/media-glow.tsx:129-157` — capture loop control:

  ```tsx
        const startCapture = () => {
          if (animationFrame) return

          lastFrameTime = 0
          animationFrame = requestAnimationFrame(captureFrame)
        }
        …
        mediaElement.addEventListener("loadeddata", captureCurrentFrame)
        mediaElement.addEventListener("play", startCapture)
        mediaElement.addEventListener("pause", handlePause)
        mediaElement.addEventListener("seeked", captureCurrentFrame)

        captureCurrentFrame()

        if (!mediaElement.paused && !mediaElement.ended) {
          startCapture()
        }
  ```

  `MediaGlow` already stops its loop on `pause` — that part is fine.
- These components are consumed by `blocks/ambient-player/player.tsx` and
  `blocks/immersive-player/player.tsx`, which pass a config object through from
  props (`ambientConfig`, `glowConfig`).
- Conventions (same as the main registry): no `any`; meaningful names; minimal comments.

## Commands you will need

Run from the **parent** repository root unless stated.

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 — the pro files are included when the submodule is checked out |
| Lint | `bun run lint` | 0 errors |
| Format | `bunx prettier --check apps/www/registry/pro/ui` | exit 0 |
| Submodule status | `git -C apps/www/registry/pro status --short` | only the two `ui/*.tsx` files |

## Scope

**In scope**:
- `apps/www/registry/pro/ui/media-ambient.tsx`
- `apps/www/registry/pro/ui/media-glow.tsx`
- The submodule pointer in the parent repository (one `git add apps/www/registry/pro`)

**Out of scope**:
- `apps/www/registry/pro/blocks/**`, `README.md`, `apple-music-canvas-reverse-engineering.md`.
- Registering the pro items in `apps/www/registry/collection/*` or changing
  `scripts/registry-dev.mts` — a product decision recorded in `plans/README.md`.
- The hard-coded dark fill colour in `clearFrontCanvas` (`media-ambient.tsx:207`).

## Git workflow

- Inside `apps/www/registry/pro`: branch `fix/ambient-components`, commit
  `fix: ambient sampling interval, asChild and reduced motion`.
- In the parent repo: branch `chore/bump-pro-submodule`, commit `chore: bump pro submodule`.
- Do NOT push either repository or open a PR unless the operator instructed it.
  (The parent commit references a submodule commit that only exists locally
  until the submodule is pushed — tell the operator.)

## Steps

### Step 1: Stable config primitives in `MediaAmbient`

Replace the `config` `useMemo` with one primitive per field:

```tsx
    const blurStrength = configOverride?.blurStrength ?? DEFAULT_CONFIG.blurStrength
    const crossfadeDurationMs =
      configOverride?.crossfadeDurationMs ?? DEFAULT_CONFIG.crossfadeDurationMs
    const minImageUpdateIntervalMs =
      configOverride?.minImageUpdateIntervalMs ??
      DEFAULT_CONFIG.minImageUpdateIntervalMs
    const opacity = configOverride?.opacity ?? DEFAULT_CONFIG.opacity
    const saturation = configOverride?.saturation ?? DEFAULT_CONFIG.saturation
    const scaleX = configOverride?.scaleX ?? DEFAULT_CONFIG.scaleX
    const scaleY = configOverride?.scaleY ?? DEFAULT_CONFIG.scaleY
```

Replace every `config.<field>` in the file with the matching variable, and
replace `config` in dependency arrays with the specific variables each callback
or effect uses (`updateFrame` uses `blurStrength`, `opacity`, `crossfadeDurationMs`).

**Verify**: `grep -n "config\.\|\[configOverride\]" apps/www/registry/pro/ui/media-ambient.tsx` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 2: Sample on a timer, and only when motion is allowed

Replace the body of the sampling effect with:

```tsx
      if (!isReady) return
      if (!isVideoElement(mediaElement)) return

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const handleLoadedData = () => {
        updateFrame(true)
      }

      const handleSeeked = () => {
        updateFrame(prefersReducedMotion)
      }

      mediaElement.addEventListener("loadeddata", handleLoadedData)
      mediaElement.addEventListener("seeked", handleSeeked)

      const intervalId = prefersReducedMotion
        ? null
        : window.setInterval(() => {
            if (!mediaElement.paused) updateFrame()
          }, minImageUpdateIntervalMs)

      return () => {
        if (intervalId !== null) window.clearInterval(intervalId)
        mediaElement.removeEventListener("loadeddata", handleLoadedData)
        mediaElement.removeEventListener("seeked", handleSeeked)
      }
```

with dependencies `[isReady, mediaElement, minImageUpdateIntervalMs, updateFrame]`.
(`updateFrame` already returns early when `videoWidth`/`videoHeight` is 0, and
its argument `true` means "skip the crossfade animation".) Then delete
`lastUpdateTimeRef` and `animationFrameRef`, which are no longer used.

**Verify**: `grep -n "requestAnimationFrame\|lastUpdateTimeRef\|animationFrameRef" apps/www/registry/pro/ui/media-ambient.tsx` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 3: Make `asChild` keep the caller's element

Import `Slottable` alongside `Slot`: `import { Slot, Slottable } from "@radix-ui/react-slot"`.
Pull `children` out of the props destructuring (next to `className`), and render:

```tsx
      <Comp … {...etc}>
        {asChild ? <Slottable>{children}</Slottable> : null}
        <div ref={innerContainerRef} style={{ … }} />
      </Comp>
```

With `asChild`, `Slot` now merges onto the caller's element (the `Slottable`
content) and appends the inner `div` as that element's child. Without
`asChild`, output is unchanged (callers' `children` were never rendered before
and still are not).

Also switch `composeRefs(forwardedRef, containerRef)` to the hook form
`useComposedRefs(forwardedRef, containerRef)` (import it from
`@radix-ui/react-compose-refs`; the exemplar is `apps/www/registry/default/ui/media.tsx:27`).
Do the same in `media-glow.tsx` for `composeRefs(forwardedRef, canvasRef)`.

**Verify**: `grep -n "Slottable" apps/www/registry/pro/ui/media-ambient.tsx` → two matches (import, use).
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 4: Reduced motion in `MediaGlow`

In the capture effect of `media-glow.tsx`, add at the top (after the early return):

```tsx
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
```

and make `startCapture` do nothing when it is true:

```tsx
      const startCapture = () => {
        if (prefersReducedMotion || animationFrame) return
        …
```

The `loadeddata`, `pause` and `seeked` listeners still capture a still frame,
so the glow is present but does not animate.

**Verify**: `grep -c "prefersReducedMotion" apps/www/registry/pro/ui/media-glow.tsx` → `2`.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors; `bunx prettier --check apps/www/registry/pro/ui` → exit 0.

### Step 5: Commit in the submodule, then record it in the parent

```bash
git -C apps/www/registry/pro add ui/media-ambient.tsx ui/media-glow.tsx
git -C apps/www/registry/pro commit -m "fix: ambient sampling interval, asChild and reduced motion"
git add apps/www/registry/pro
git commit -m "chore: bump pro submodule"
```

**Verify**: `git status --short` in the parent → clean; `git -C apps/www/registry/pro status --short` → clean.

## Test plan

Canvas and animation code; no automated tests. The reviewer's visual check is
in Maintenance notes and is required before merging.

## Done criteria

- [ ] `grep -n "requestAnimationFrame" apps/www/registry/pro/ui/media-ambient.tsx` → no output
- [ ] `grep -n "Slottable" apps/www/registry/pro/ui/media-ambient.tsx` → two matches
- [ ] `grep -c "prefers-reduced-motion" apps/www/registry/pro/ui/media-ambient.tsx apps/www/registry/pro/ui/media-glow.tsx` → `1` for each file
- [ ] `cd apps/www && bun run typecheck` exits 0; `bun run lint` 0 errors
- [ ] Submodule has one new commit; parent has one commit bumping the pointer
- [ ] `plans/README.md` status row updated

## STOP conditions

- `apps/www/registry/pro` is empty or not at `8d8d975` with differing code.
- `Slottable` is not exported by the installed `@radix-ui/react-slot`
  (`grep -n "Slottable" node_modules/@radix-ui/react-slot/dist/index.d.ts`).
- You are asked to push the submodule and do not have credentials — report,
  do not try other remotes.

## Maintenance notes

- **Required visual check** (reviewer): the pro components are not registered
  in any registry collection today, so there is no docs page to open. Render
  `AmbientPlayer` and `ImmersivePlayer` (from `apps/www/registry/pro/blocks/*/player.tsx`)
  on a scratch page in `bun run dev` and confirm: glow appears after the first
  frame, crossfades roughly every 5 s while playing, holds still while paused,
  updates after a seek; with the OS "reduce motion" setting on, it shows a
  still glow.
- The sampling interval restarts when `mediaElement`, the interval length or
  `updateFrame` changes; with Step 1 those are stable across parent re-renders.
  If someone reintroduces an object dependency there, sampling can starve.
- `matchMedia` is read once per effect run; a user toggling the OS setting
  mid-session takes effect on the next media element change. Acceptable.
