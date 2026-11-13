# Plan 015: `ExclusivePlaybackProvider` pauses every other playing element, and its docs match

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/default/ui/exclusive-playback-provider.tsx apps/www/content/docs/components/exclusive-playback-provider.mdx`
> Plan 003 edits two import lines in the `.mdx`; that is expected. For anything
> else, compare the "Current state" excerpts against the live code; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/005-play-rejection-non-fatal.md (without it, pausing a
  player whose `play()` is still pending puts that player into the error state)
- **Category**: bug
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

`ExclusivePlaybackProvider` was added in commit `9e75eb9`. Its docs say it
"Ensures that only one descendant audio or video element plays at a time". The
implementation remembers a single "active" element and only learns about an
element when it sees that element's `play` event. An element that was already
playing before the provider could observe it (an `autoPlay` element that
started before hydration, or a provider mounted around a playing player) is
never tracked, so starting a second element leaves both playing. The remembered
element is also kept referenced after it is removed from the page. Asking the
DOM "which other descendants are playing right now?" at the moment of `play`
is simpler and has neither gap.

## Current state

`apps/www/registry/default/ui/exclusive-playback-provider.tsx` (whole file, 66 lines). The core:

```tsx
export interface ExclusivePlaybackProviderProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

export const ExclusivePlaybackProvider = React.forwardRef<
  HTMLDivElement,
  ExclusivePlaybackProviderProps
>(function ExclusivePlaybackProvider(
  { asChild, onEndedCapture, onPauseCapture, onPlayCapture, ...props },
  forwardedRef
) {
  const activeMediaRef = React.useRef<HTMLMediaElement | null>(null)
  const Component = asChild ? Slot : "div"

  const handlePlayCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
    onPlayCapture?.(event)
    if (event.defaultPrevented) return

    const mediaElement = getMediaElement(event)
    if (!mediaElement || activeMediaRef.current === mediaElement) return

    activeMediaRef.current?.pause()
    activeMediaRef.current = mediaElement
  }

  const releaseMedia = (event: React.SyntheticEvent<HTMLDivElement>) => { … }
  const handlePauseCapture = … // calls onPauseCapture, then releaseMedia
  const handleEndedCapture = … // calls onEndedCapture, then releaseMedia

  return (
    <Component
      {...props}
      onEndedCapture={handleEndedCapture}
      onPauseCapture={handlePauseCapture}
      onPlayCapture={handlePlayCapture}
      ref={forwardedRef}
    />
  )
})
…
function getMediaElement(
  event: React.SyntheticEvent<HTMLDivElement>
): HTMLMediaElement | null {
  return event.target instanceof HTMLMediaElement ? event.target : null
}
```

- `event.currentTarget` in a capture handler is the provider's root element
  (also with `asChild`, where the handlers are merged onto the child).
- `apps/www/content/docs/components/exclusive-playback-provider.mdx:60-63`:

  ```mdx
  <AutoTypeTable
    path="./registry/default/ui/exclusive-playback-provider.tsx"
    name="ExclusivePlaybackProviderProps"
  />
  ```

  Every other component doc points at a narrowed `…PropsDocs` type so the table
  does not list every inherited `div` attribute. Exemplar:
  `apps/www/registry/default/ui/media.tsx:20` — `export type MediaPropsDocs = Pick<MediaProps, "as">`.
- Conventions: support `asChild` via `@radix-ui/react-slot`; compose the user's
  handlers first and respect `event.defaultPrevented` (already done here — keep it).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `apps/www/registry/default/ui/exclusive-playback-provider.tsx`
- `apps/www/content/docs/components/exclusive-playback-provider.mdx` (the `AutoTypeTable` name and one added sentence)

**Out of scope**:
- `apps/www/registry/default/examples/exclusive-playback-provider-demo.tsx`.
- `apps/www/registry/collection/registry-ui.ts` — dependencies do not change.
- Media-session ownership (`hooks/use-media-session.ts`) — plan 007.
- Elements outside the provider's subtree, and elements inside shadow DOM or iframes.

## Git workflow

- Branch: `fix/exclusive-playback-provider`. Commit: `fix: exclusive playback pauses all other playing descendants`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Pause all other playing descendants on `play`

Replace the ref-based tracking with a DOM query:

1. Delete `activeMediaRef`, `releaseMedia`, `handlePauseCapture` and `handleEndedCapture`.
2. Stop destructuring `onEndedCapture` and `onPauseCapture` (they then flow
   through `...props` untouched) and remove those two props from the JSX.
3. Rewrite `handlePlayCapture`:

   ```tsx
     const handlePlayCapture = (event: React.SyntheticEvent<HTMLDivElement>) => {
       onPlayCapture?.(event)
       if (event.defaultPrevented) return

       const startedElement = getMediaElement(event)
       if (!startedElement) return

       const descendants =
         event.currentTarget.querySelectorAll<HTMLMediaElement>("audio, video")

       for (const mediaElement of descendants) {
         if (mediaElement !== startedElement && !mediaElement.paused) {
           mediaElement.pause()
         }
       }
     }
   ```

4. Add the docs type under the props interface:

   ```ts
   export type ExclusivePlaybackProviderPropsDocs = Pick<
     ExclusivePlaybackProviderProps,
     "asChild"
   >
   ```

**Verify**: `grep -n "activeMediaRef\|releaseMedia" apps/www/registry/default/ui/exclusive-playback-provider.tsx` → no output.
**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors.

### Step 2: Docs

In the `.mdx`:

1. Change `name="ExclusivePlaybackProviderProps"` to `name="ExclusivePlaybackProviderPropsDocs"`.
2. After the sentence "Use separate providers to create independent playback groups.", add:
   "The provider only coordinates `<audio>` and `<video>` elements rendered inside it in the same document; media in iframes or shadow roots is not affected."
3. Replace "When a descendant media element starts playing, the provider pauses
   the previously active element. Pausing or ending the active element releases it."
   with "When a descendant media element starts playing, the provider pauses
   every other descendant that is currently playing."

**Verify**: `grep -n "ExclusivePlaybackProviderPropsDocs" apps/www/content/docs/components/exclusive-playback-provider.mdx apps/www/registry/default/ui/exclusive-playback-provider.tsx` → one match in each file.

## Test plan

No DOM test environment in this repo. Manual check in Maintenance notes.

## Done criteria

- [ ] `grep -n "activeMediaRef\|releaseMedia" apps/www/registry/default/ui/exclusive-playback-provider.tsx` → no output
- [ ] `grep -n 'querySelectorAll<HTMLMediaElement>("audio, video")' apps/www/registry/default/ui/exclusive-playback-provider.tsx` → one match
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] Only the two in-scope files are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- Plan 005 has not landed (`grep -n "isPlayInterruption" apps/www/registry/default/hooks/use-playback.ts`
  returns nothing). Without it, this change makes the error-state problem more
  likely, because more elements get paused.
- TypeScript rejects iterating a `NodeListOf` with `for…of` (then use
  `descendants.forEach((mediaElement) => { … })`; if that also fails, STOP).

## Maintenance notes

- Manual check for the reviewer on `/docs/components/exclusive-playback-provider`:
  start the video, then the audio — video pauses, and **does not** show an error
  screen. Then add `autoPlay muted` to one element via `mediaProps`, reload,
  start the other — the autoplaying one pauses.
- A muted background video inside the provider will now be paused when anything
  else plays. If that is unwanted, the opt-out is to place it outside the provider.
- The live `querySelectorAll` runs once per `play` event; cost is negligible.
