# Plan 003: README and docs snippets import from the paths the blocks actually install to

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- README.md apps/www/content/docs apps/www/registry/collection/registry-blocks.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The first code snippet in the README, and the usage snippets in the block docs,
import the player from `@/components/limeplay/video-player/player`. The shadcn
registry installs the block to `components/video-player/player.tsx` — there is
no `limeplay/` folder in that path — so the first thing a new user pastes fails
with "module not found". The quick-start's "build from scratch" sample also
uses `<Volume.Input />`, a component that does not exist. This plan fixes the
docs to match what is installed; it does not move any installed file.

## Current state

- Where blocks install (`apps/www/registry/collection/registry-blocks.ts`):
  - line 20: `target: "components/video-player/player.tsx",`
  - line 159: `target: "components/audio-player/player.tsx",`
  - Other block files get `components/video-player/…` / `components/audio-player/…`
    targets generated automatically (e.g. `components/video-player/lib/media-kit.ts`).
  - The repo's own install test agrees: `apps/www/scripts/test-registry-install.ts:53,58`
    use `importPath: "components/audio-player/player"` and `"components/video-player/player"`.
- Wrong imports (all nine occurrences):
  - `README.md:28` — `import { VideoPlayer } from "@/components/limeplay/video-player/player"`
  - `apps/www/content/docs/usage.mdx:17` — same for `VideoPlayer`
  - `apps/www/content/docs/usage.mdx:35` — `} from "@/components/limeplay/audio-player/player"`
  - `apps/www/content/docs/usage.mdx:227` — `import { useMediaEvents } from "@/components/limeplay/video-player/lib/media-kit"`
  - `apps/www/content/docs/blocks/video-player.mdx:19` and `:46`
  - `apps/www/content/docs/blocks/audio-player.mdx:22`
  - `apps/www/content/docs/components/exclusive-playback-provider.mdx:24` and `:26`
- **Do not over-correct**: single primitives and hooks really do install under
  `limeplay/` (`@/components/limeplay/volume-control`, `@/hooks/limeplay/use-playback-source`,
  `@/components/limeplay/exclusive-playback-provider`). Only the two block
  folders `video-player/` and `audio-player/` are wrong.
- `apps/www/content/docs/quick-start.mdx:113-118`:

  ```tsx
          <Volume.Root>
            <Volume.Track>
              <Volume.Input />
            </Volume.Track>
          </Volume.Root>
  ```

  `apps/www/registry/default/ui/volume-control.tsx` exports only `Root`, `Track`,
  `Progress` and `Thumb`. The correct composition is shown in
  `apps/www/content/docs/components/volume-control.mdx:28-33`:

  ```tsx
      <VolumeSlider.Track>
        <VolumeSlider.Progress />
      </VolumeSlider.Track>
      <VolumeSlider.Thumb />
  ```

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Find leftovers | `grep -rn "components/limeplay/\(video\|audio\)-player" README.md apps/www/content apps/www/app` | no output |
| Format | `bun run format:check` (repo root) | exit 0 (`*.md` and `*.mdx` are excluded from prettier, so this just must not regress) |

## Scope

**In scope**:
- `README.md`
- `apps/www/content/docs/usage.mdx`
- `apps/www/content/docs/blocks/video-player.mdx`
- `apps/www/content/docs/blocks/audio-player.mdx`
- `apps/www/content/docs/components/exclusive-playback-provider.mdx` (import lines only)
- `apps/www/content/docs/quick-start.mdx`

**Out of scope**:
- `apps/www/registry/collection/registry-blocks.ts` — do NOT change install
  targets; that would move files for everyone who already installed a block.
- Any `@/components/limeplay/<primitive>` or `@/hooks/limeplay/<hook>` import — those are correct.
- The `<AutoTypeTable>` in `exclusive-playback-provider.mdx` — plan 015.
- Generated output: `apps/www/public/r`, `apps/www/out`, `apps/www/.source`.

## Git workflow

- Branch: `fix/docs-block-import-paths`. Commit: `fix: block import paths in docs`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Fix the nine block imports

In the five files listed, replace the substring
`@/components/limeplay/video-player/` with `@/components/video-player/` and
`@/components/limeplay/audio-player/` with `@/components/audio-player/`.
Change nothing else on those lines.

**Verify**: `grep -rn "components/limeplay/\(video\|audio\)-player" README.md apps/www/content apps/www/app` → no output.
**Verify**: `grep -rn "@/components/\(video\|audio\)-player/" README.md apps/www/content | wc -l` → `9` (it is `0` before this step).

### Step 2: Fix the quick-start volume sample

In `apps/www/content/docs/quick-start.mdx`, replace the five-line `Volume` block
shown in "Current state" with:

```tsx
          <Volume.Root>
            <Volume.Track>
              <Volume.Progress />
            </Volume.Track>
            <Volume.Thumb />
          </Volume.Root>
```

**Verify**: `grep -rn "Volume\.Input" apps/www/content README.md` → no output.

## Test plan

Docs only; no tests. The greps in the steps are the checks.

## Done criteria

- [ ] `grep -rn "components/limeplay/\(video\|audio\)-player" README.md apps/www/content apps/www/app` → no output
- [ ] `grep -rn "Volume\.Input" apps/www/content README.md` → no output
- [ ] `git diff --stat` lists only the six in-scope files
- [ ] `plans/README.md` status row updated

## STOP conditions

- `registry-blocks.ts:20` or `:159` no longer says `components/video-player/player.tsx` /
  `components/audio-player/player.tsx` (the targets were changed instead — then
  the docs may already be right).
- More than nine occurrences are found, in files not listed here.

## Maintenance notes

- `DEVELOPMENT.md` says "Public examples should import from `@/components/limeplay/*`".
  That is true for primitives, not for blocks. If the maintainer would rather
  have blocks under `components/limeplay/<block>/`, that is a breaking change
  to the registry targets and needs its own decision.
- Follow-up worth considering: have `scripts/test-registry-install.ts` compile
  the quick-start sample so doc snippets cannot rot silently.
