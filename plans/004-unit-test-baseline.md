# Plan 004: A `bun test` suite exists and covers the library's pure logic

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- apps/www/package.json apps/www/registry/default/hooks/use-playlist.ts apps/www/registry/default/hooks/use-media-session.ts apps/www/registry/default/lib/time.ts .github/workflows/ci.yml`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition. (Plans 001/002 edit other jobs in
> `ci.yml`; that is expected.)

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/001-ci-typecheck-gate.md (uses `bun run typecheck`)
- **Category**: tests
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The repository ships playlist ordering, shuffle, repeat, time formatting and
media-session position logic into every user's project, and has no unit tests
at all (`apps/www/tests/` is empty; `turbo.json` declares a `test` task with no
script behind it). Plans 005, 006 and 013 change this logic and need a place to
add regression tests. This plan adds the runner and a first set of
*characterization* tests: they record what the code does today, so later
changes are deliberate.

## Current state

- Runner: Bun ships a test runner (`bun test`). The advisor confirmed on a clean
  export of this commit that a test file under `apps/www/tests/` can import
  registry modules through the `@/…` alias with no browser:
  `import { formatTimestamp } from "@/registry/default/lib/time"` works, and so do
  imports of `use-media-session.ts` and `use-playlist.ts`.
- `apps/www/tsconfig.json` includes `**/*.ts`, so test files are typechecked.
  `bun:test` types come from the `@types/bun` package, which is **not** installed.
- `apps/www/registry/default/lib/time.ts` exports:
  - `durationDateTime(durationSeconds: number, seekRange?: shaka.extern.BufferedRange)` → ISO-8601 duration string
  - `formatTimestamp(seconds: number, showHours = false)` → `"MM:SS"` or `"HH:MM:SS"`
- `apps/www/registry/default/lib/utils.ts:91` exports `toFixedNumber(num, digits, base = 10)`.
- `apps/www/registry/default/hooks/use-media-session.ts` exports pure helpers
  (lines 100–192): `canMoveToNextMediaSessionTrack`, `canMoveToPreviousMediaSessionTrack`,
  `canStartMediaSessionPlayback(status)`, `getMediaSessionCurrentTime`,
  `getMediaSessionMetadataValue(...values)`, `getMediaSessionPlaybackState({active,status})`,
  `getMediaSessionPositionState({active,currentTime,duration,playbackRate?})`,
  `isMediaSessionPlaylistSource(sourceType)`.
- `apps/www/registry/default/hooks/use-playlist.ts` has module-private pure helpers
  (not exported today):
  - line 691 `function createShuffleOrder(length: number, excludeIndex?: number): number[]`
  - line 727 `function getPreviousPlaylistTarget(playlist): { historyIndex: number; index: number }`
  - line 782 `function getRepeatModes(queueLength: number): RepeatMode[]`
  - line 797 `function normalizeRepeatMode(mode: RepeatMode, queueLength: number): RepeatMode`
- Observed current behaviour (verified by running the code) that the tests must record:
  - `formatTimestamp(61)` → `"01:01"`; `formatTimestamp(3600, false)` → `"00:00"` (hours dropped); `formatTimestamp(0)` → `"00:00"`
  - `durationDateTime(600)` → `"PT10M"`
  - `durationDateTime(600, { start: 0, end: 600 })` → `"PT0S"` — this is a known bug
    (the range is in seconds but treated as milliseconds). Plan 013 fixes it. Do
    **not** assert this value; leave it for plan 013.
  - `getMediaSessionPositionState({ active: true, currentTime: 5, duration: 10 })`
    → `{ duration: 10, playbackRate: 1, position: 5 }`
- Conventions: no `any`; meaningful names (no `i`, `j`); minimal comments; imports
  sorted (ESLint `perfectionist` will auto-fix order).

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Add types | `cd apps/www && bun add -d @types/bun` | exit 0; `bun.lock` and `apps/www/package.json` change |
| Tests | `cd apps/www && bun test` | all pass, 0 fail |
| Typecheck | `cd apps/www && bun run typecheck` | exit 0 |
| Lint fix (tests only) | `cd apps/www && ../../node_modules/.bin/eslint tests --fix` | 0 errors |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bunx prettier --write apps/www/tests` then `bun run format:check` (root) | exit 0 |

## Scope

**In scope**:
- `apps/www/package.json` (add `test` script, `@types/bun` dev dependency), `bun.lock`
- `apps/www/tests/time.test.ts`, `apps/www/tests/utils.test.ts`,
  `apps/www/tests/media-session.test.ts`, `apps/www/tests/playlist-helpers.test.ts` (create)
- `apps/www/registry/default/hooks/use-playlist.ts` — add the `export` keyword to the four helpers only
- `.github/workflows/ci.yml` — add one `test` job
- `DEVELOPMENT.md` — mention `bun test`

**Out of scope**:
- Fixing any behaviour the tests reveal. Record it; do not fix it.
- Testing React hooks, components or the Zustand slices — later work.
- `turbo.json` — its `test` task already exists and will now have a script.
- Registry metadata (`apps/www/registry/collection/*`): adding `export` to helpers does not change dependencies.

## Git workflow

- Branch: `chore/unit-test-baseline`. Commit: `chore: add bun test baseline`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the runner script and types

1. `cd apps/www && bun add -d @types/bun`
2. In `apps/www/package.json` `"scripts"`, add `"test": "bun test",`.

**Verify**: `cd apps/www && bun test; echo "exit=$?"` → reports "0 pass / no tests found" style output; either exit code is acceptable at this step.

### Step 2: Export the four playlist helpers

In `apps/www/registry/default/hooks/use-playlist.ts`, change `function createShuffleOrder`,
`function getPreviousPlaylistTarget`, `function getRepeatModes` and
`function normalizeRepeatMode` to `export function …`. Change nothing else.

**Verify**: `grep -c "^export function \(createShuffleOrder\|getPreviousPlaylistTarget\|getRepeatModes\|normalizeRepeatMode\)" apps/www/registry/default/hooks/use-playlist.ts` → `4`.

### Step 3: Write the tests

Use this shape for every file (this exact file passed in the advisor's probe):

```ts
import { describe, expect, test } from "bun:test"

import { formatTimestamp } from "@/registry/default/lib/time"

describe("formatTimestamp", () => {
  test("formats minutes and seconds", () => {
    expect(formatTimestamp(61)).toBe("01:01")
  })
})
```

Cases to cover:

- `tests/time.test.ts`
  - `formatTimestamp`: `61` → `"01:01"`; `0`, `-5`, `NaN`, `Infinity` → `"00:00"`; same four with `showHours = true` → `"00:00:00"`; `3661, true` → `"01:01:01"`; `3600, false` → `"00:00"` (name this test "drops hours when showHours is false").
  - `durationDateTime` (one argument only): `600` → `"PT10M"`; `0` → `"PT0S"`; `-1` → `"PT0S"`; `NaN` → `"PT0S"`; `3661` → `"PT1H1M1S"`.
- `tests/utils.test.ts`
  - `toFixedNumber(1.23456, 2)` → `1.23`; `toFixedNumber(1.005, 0)` → `1`.
- `tests/media-session.test.ts`
  - `getMediaSessionPlaybackState`: inactive → `"none"`; active + `"playing"` → `"playing"`; active + `"paused"`/`"buffering"` → `"paused"`.
  - `getMediaSessionPositionState`: the example above; `active: false` → `null`; `duration: Infinity`, `duration: 0`, `currentTime: -1`, `currentTime: NaN` → `null`.
  - `canStartMediaSessionPlayback`: `"error"` and `"init"` → `false`; `"paused"` → `true`.
  - `getMediaSessionMetadataValue`: `(undefined, "  ", "Title")` → `"Title"`; `(null, 7)` → `"7"`; `()` → `undefined`.
  - `isMediaSessionPlaylistSource("playlist")` → `true`; any other value the type allows → `false` (read the `MediaSessionSourceType` type in the file for valid values).
- `tests/playlist-helpers.test.ts`
  - `createShuffleOrder(5)`: length 5 and, when sorted, equals `[0,1,2,3,4]`.
  - `createShuffleOrder(5, 2)`: first element is `2`; sorted equals `[0,1,2,3,4]`.
  - `createShuffleOrder(0)` → `[]`.
  - `getRepeatModes(1)` → `["off","one"]`; `getRepeatModes(3)` → `["off","all","one"]`.
  - `normalizeRepeatMode("all", 1)` → `"one"`; `("all", 2)` → `"all"`; `("off", 1)` → `"off"`.
  - `getPreviousPlaylistTarget`: build a minimal playlist object with the fields the
    function reads (`queue`, `history`, `currentIndex`, `repeatMode`, `shuffle`,
    `shuffleOrder`) and cast it with `as Parameters<typeof getPreviousPlaylistTarget>[0]`.
    Cases: empty queue → `{ historyIndex: -1, index: -1 }`; `repeatMode: "one"` →
    index equals `currentIndex`; no history, `currentIndex: 2`, repeat off → index `1`;
    `currentIndex: 0`, repeat off → `-1`; `currentIndex: 0`, repeat `"all"`, 3 items → `2`.

If a listed expectation does not match what the code returns, do **not** change
the source. Assert the actual value, and list the mismatch in your report.

**Verify**: `cd apps/www && bun test` → 0 fail, at least 25 passing `expect` calls across 4 files.

### Step 4: Lint, format, typecheck

Run the "Lint fix (tests only)", "Format", "Typecheck" and "Lint" commands from the table.

**Verify**: all exit 0 / 0 errors.

### Step 5: Run tests in CI

In `.github/workflows/ci.yml`, add a job after `typecheck`:

```yaml
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.2.19

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests
        run: cd apps/www && bun test
```

In `DEVELOPMENT.md`, add `cd apps/www && bun test` to the "Registry and site checks" block.

**Verify**: `grep -n "name: Unit Tests" .github/workflows/ci.yml` → one match.

## Test plan

This plan *is* the test plan. Later plans add cases to these files.

## Done criteria

- [ ] `cd apps/www && bun test` exits 0 with 4 test files
- [ ] `cd apps/www && bun run typecheck` exits 0
- [ ] `bun run lint` → 0 errors; `bun run format:check` exits 0
- [ ] `git diff --stat` shows only in-scope files; `use-playlist.ts` diff is exactly four added `export` keywords
- [ ] `plans/README.md` status row updated

## STOP conditions

- `bun add -d @types/bun` fails (the repo's `bunfig.toml` enforces a minimum
  package release age; if the resolver refuses, report it rather than editing `bunfig.toml`).
- Importing a registry module in a test throws at import time (a module touches
  `window`/`document` at load) — report which module.
- `bun test` picks up files outside `apps/www/tests/`.

## Maintenance notes

- CI pins Bun 1.2.19 while local machines may run newer; if a test passes
  locally and fails in CI, check the Bun version first.
- Next targets, in order of value: the `playlistFeature()` slice transitions
  (`next`, `previous`, shuffle + repeat), then `normalizeAssets` /
  `getNormalizedAssetId` in `use-asset.ts` (currently private).
- Reviewer: check that no test asserts on shuffle *order* (it is random).
