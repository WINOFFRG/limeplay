# Plan 008: Registry items declare what they import, and the validator fails on gaps

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/registry/collection apps/www/registry/default/blocks/video-player/ui apps/www/scripts/validate-registries.ts`
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

Limeplay is distributed through a shadcn registry: `npx shadcn add @limeplay/video-player`
copies files into the user's project and installs the npm packages listed in
the item's `dependencies`. Several items import packages they do not list, so
an install into a project that does not already have those packages fails to
build. The video block also ships a file nobody imports, aimed at the user's
own `components/ui/toggle.tsx`, which the CLI will offer to overwrite. Finally,
the validation script only *warns* on unresolved registry dependencies, so CI
stays green when one is broken.

## Current state

- `apps/www/registry/collection/registry-blocks.ts:5-15` — `video-player` item:

  ```ts
    dependencies: [
      "@phosphor-icons/react",
      "@base-ui/react",
      "@radix-ui/react-toggle",
      "zustand",
      "shaka-player@^5.2.7",
      "lodash.clamp",
    ],
  ```

  But its files import:
  - `lucide-react` — `apps/www/registry/default/blocks/video-player/components/player-error-screen.tsx:3`
  - `class-variance-authority` — `apps/www/registry/default/blocks/video-player/components/button.tsx:2`
    (and `ui/toggle.tsx:4`)
- `registry-blocks.ts:88-92` — the unused file:

  ```ts
      {
        path: `${VIDEO_PLAYER_SRC_URL}/ui/toggle.tsx`,
        target: "components/ui/toggle.tsx",
        type: "registry:ui",
      },
  ```

  `apps/www/registry/default/blocks/video-player/ui/toggle.tsx` is not imported
  by any file in `apps/www/registry/default/` (the only matches for `ui/toggle`
  or `react-toggle` in the registry are the file itself and these metadata
  lines). It is the only reason `@radix-ui/react-toggle` is declared.
- `registry-blocks.ts:147-154` — `audio-player` item:

  ```ts
    dependencies: [
      "@phosphor-icons/react",
      "@radix-ui/react-slot",
      "motion",
      "zustand",
      "shaka-player@^5.2.7",
    ],
  ```

  But `apps/www/registry/default/blocks/audio-player/components/playlist.tsx:4`
  imports `XIcon` from `lucide-react`.
- `apps/www/registry/collection/registry-examples.ts` — five example items have
  no `dependencies` field although their files import `@phosphor-icons/react`:
  `playback-state-control-demo`, `picture-in-picture-control-demo`,
  `volume-state-control-demo`, `captions-state-control-demo`, `seek-control-demo`.
  The pattern to copy is the `error-screen-demo` item in the same file:
  `dependencies: ["lucide-react"],` placed as the first key of the item.
- `apps/www/registry/collection/registry-hooks.ts:207-219` — `use-playlist`:

  ```ts
    dependencies: ["lodash", "zustand"],
    …
    name: "use-playlist",
  ```

  It imports `lodash/clamp`, `lodash/pull`, `lodash/reject`, `lodash/shuffle`
  but declares no types package. Sibling items declare theirs, e.g. line 32:
  `devDependencies: ["@types/lodash.clamp"],`.
- `apps/www/scripts/validate-registries.ts:217-245` — unresolved
  `registryDependencies` call `warn(...)` (two call sites), and the script exits
  0 on warnings. The file has `function error(msg: string)` at line 77 and
  `function warn(msg: string)` at line 465.
- Repo rule (from `DEVELOPMENT.md`): "Registry dependencies should be explicit
  and major versions with breaking changes should be pinned."

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Build registry | `cd apps/www && bun run registry:build` | exit 0 (writes gitignored `public/r`, `registry.json`) |
| Validate | `cd apps/www && bun run validate:registries` | exit 0, no `❌` lines (needs network: it resolves shadcn items) |
| Typecheck | `cd apps/www && bun run typecheck` (or `bunx tsc --noEmit`) | exit 0 |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `apps/www/registry/collection/registry-blocks.ts`
- `apps/www/registry/collection/registry-examples.ts`
- `apps/www/registry/collection/registry-hooks.ts` (the `use-playlist` item only)
- `apps/www/registry/default/blocks/video-player/ui/toggle.tsx` (delete)
- `apps/www/scripts/validate-registries.ts` (the two `warn` calls in the dependency check only)

**Out of scope**:
- `apps/www/components/ui/toggle.tsx` and `toggle-group.tsx` — the docs site's own copies, unrelated.
- Removing "over-declared" dependencies (`@base-ui/react`, `zustand`, `lodash.clamp`
  on the block): they arrive through registry dependencies anyway and removing
  them is not worth the risk.
- Adding `use-media` to `media-provider`'s `registryDependencies`
  (`registry-ui.ts:79`). The two items import each other, and whether the shadcn
  CLI tolerates a dependency cycle was not verified. Deferred.
- The third-party dependency `https://bazza.dev/r/hit-area` — see plan 002 notes.
- `apps/www/package.json`.

## Git workflow

- Branch: `fix/registry-dependencies`. Commit: `fix: declare missing registry dependencies`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Confirm `toggle.tsx` is unused, then remove it

Run: `grep -rn "ui/toggle\"\|ui/toggle'\|toggleVariants\|<Toggle[ >]" apps/www/registry/default`

Expected: matches only inside `apps/www/registry/default/blocks/video-player/ui/toggle.tsx`.
If anything else matches, STOP.

Then:
1. Delete `apps/www/registry/default/blocks/video-player/ui/toggle.tsx`.
2. Delete its five-line entry from `registry-blocks.ts` (shown above).
3. Remove `"@radix-ui/react-toggle",` from the `video-player` `dependencies`.

**Verify**: `grep -rn "react-toggle\|ui/toggle" apps/www/registry/collection apps/www/registry/default` → no output.

### Step 2: Declare the missing npm dependencies

1. `video-player` `dependencies`: add `"lucide-react"` and `"class-variance-authority"`.
2. `audio-player` `dependencies`: add `"lucide-react"`.
3. In `registry-examples.ts`, add `dependencies: ["@phosphor-icons/react"],` as
   the first key of each of the five example items named above.
4. In `registry-hooks.ts`, add `devDependencies: ["@types/lodash"],` to the
   `use-playlist` item, directly after its `dependencies` line.

Before step 3, confirm each example really imports the package:
`grep -ln "@phosphor-icons/react" apps/www/registry/default/examples/*.tsx` → exactly those five files.

**Verify**: `cd apps/www && bun run typecheck` → exit 0; `bun run lint` → 0 errors
(ESLint `perfectionist` may reorder object keys; if it reports an ordering
error, run `cd apps/www && ../../node_modules/.bin/eslint registry/collection --fix`).

### Step 3: Make unresolved registry dependencies an error

In `apps/www/scripts/validate-registries.ts`, inside the loop over
`item.registryDependencies` (lines 217–245), change both `warn(` calls to
`error(`. Do not touch other `warn` calls in the file.

**Verify**: `sed -n 215,246p apps/www/scripts/validate-registries.ts | grep -c "warn("` → `0`.

### Step 4: Rebuild and validate

```bash
cd apps/www
bun run registry:build
bun run validate:registries; echo "exit=$?"
```

**Verify**: `exit=0`. Then
`grep -c "lucide-react" public/r/video-player.json` → at least `1`, and
`grep -c "components/ui/toggle.tsx" public/r/video-player.json` → `0`.

## Test plan

No unit tests. Step 4 is the check; CI additionally runs the full install test
(`registry-install-test`), which builds both blocks in freshly scaffolded apps.

## Done criteria

- [ ] `apps/www/registry/default/blocks/video-player/ui/toggle.tsx` does not exist
- [ ] `cd apps/www && bun run registry:build && bun run validate:registries` exits 0
- [ ] `grep -c "components/ui/toggle.tsx" apps/www/public/r/video-player.json` → `0`
- [ ] Typecheck exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] `git status --short` shows only in-scope files (generated `public/r`, `registry.json` are gitignored)
- [ ] `plans/README.md` status row updated

## STOP conditions

- Step 1's grep finds an importer of `toggle.tsx`.
- `validate:registries` fails after Step 3 with an unresolved dependency that
  was previously only a warning — report the item and dependency name; do not
  revert Step 3 and do not guess a fix.
- `validate:registries` cannot reach the network.

## Maintenance notes

- Follow-up worth doing: extend `validateImportCompleteness()` in
  `validate-registries.ts` (it currently checks only `registry:block` items and
  only `@/registry/…` imports) to compare each item's bare npm imports against
  its `dependencies`. That would have caught everything in this plan.
- The install test scaffolds apps with a shadcn preset that already includes
  `lucide-react` and `class-variance-authority`, which is why CI never noticed.
- Reviewer: confirm nobody relied on the `glass` toggle variant from the removed file.
