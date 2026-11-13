# Plan 001: Typecheck runs and passes on every PR and every push

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- .github/workflows/ci.yml apps/www/package.json DEVELOPMENT.md`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

The CI "Type Check" job only runs on pushes to `main`, and there it fails every
time, so pull requests merge without ever being typechecked and `main` is
permanently red. The failure is not a real type error: the job runs `tsc`
without first generating two sets of files that are gitignored. After this
plan, one command (`bun run typecheck`) works on a fresh clone and CI runs it
on every PR. Every other plan in `plans/` uses this command as a gate.

## Current state

- `.github/workflows/ci.yml` — the CI workflow. The `typecheck` job (lines 35–54):

  ```yaml
  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.WINOFFRG_PAT }}
          submodules: recursive

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.2.19

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: cd apps/www && bunx tsc --noEmit
  ```

- `apps/www/package.json` — scripts block has no `typecheck` script. It has
  `"docs:generate": "fumadocs-mdx"` and `"postinstall": "true"` (a no-op).
- Why it fails on a clean checkout (reproduced by the advisor on an export of
  `9e75eb9` with no generated files): 7 errors, all caused by missing generated
  files:
  - `lib/source.ts`, `lib/blocks-source.ts`: `Cannot find module 'fumadocs-mdx:collections/server'`
    — the `.source/` directory is produced by the `fumadocs-mdx` CLI.
  - `app/og/docs/[...slug]/route.tsx(19,15)`: `Cannot find name 'RouteContext'`
    — the global type is produced by `next typegen` into `.next/types/`.
  - The remaining errors are implicit-`any` cascades from the first one.
- Verified fix: on that same clean export, running `bunx fumadocs-mdx` then
  `bunx next typegen` then `bunx tsc --noEmit` exits 0. This was done **without**
  the private `apps/www/registry/pro` submodule checked out and without running
  `registry:build`, so the job needs neither the PAT nor the submodule.
  (`apps/www/types/registry-index.d.ts` declares the generated
  `@/registry/__index__` module, which is why no registry build is needed.)
- Gotcha observed: `apps/www/tsconfig.json` sets `"incremental": true` with
  `tsBuildInfoFile: ".next/tsconfig.tsbuildinfo"`. If `tsc` runs once *before*
  the types are generated, a later run can keep reporting the stale
  `RouteContext` error until that file is deleted. Always generate first.
- `next typegen` may rewrite `apps/www/next-env.d.ts` (it flips between
  `./.next/types/…` and `./.next/dev/types/…`). That file is tracked. Do not
  commit changes to it.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `bun install --frozen-lockfile` (repo root) | exit 0 |
| Typecheck (new) | `cd apps/www && bun run typecheck` | exit 0, no `error TS` lines |
| Lint | `bun run lint` (repo root) | 0 errors (14 existing warnings are fine) |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope** (the only files you should modify):
- `.github/workflows/ci.yml` — only the `typecheck` job
- `apps/www/package.json` — add one script
- `DEVELOPMENT.md` — add the command to the "Commands" list

**Out of scope** (do NOT touch):
- The `registry-install-test` job and any token handling — plan 002 owns that.
- `apps/www/next-env.d.ts` — generated; never commit changes to it.
- `apps/www/tsconfig.json`.
- Adding a `next build` job — deferred (see Maintenance notes).

## Git workflow

- Branch: `chore/ci-typecheck-gate` (repo uses `feat/…`, `fix/…`, `chore/…`).
- Commit style: conventional, lower-case, e.g. `fix: media session persistance state`,
  `chore: dependency version bump and motion fix`. Suggested: `chore: typecheck on every PR`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add a `typecheck` script

In `apps/www/package.json`, add to `"scripts"` (keep the existing entries):

```json
"typecheck": "fumadocs-mdx && next typegen && tsc --noEmit",
```

**Verify** (simulates a fresh clone; these three paths are gitignored generated output):

```bash
cd apps/www
rm -rf .source .next/types .next/tsconfig.tsbuildinfo
bun run typecheck; echo "exit=$?"
```

→ `exit=0` and no line containing `error TS`.

### Step 2: Make the CI job use it, on PRs too, without the token

Replace the `typecheck` job in `.github/workflows/ci.yml` with:

```yaml
  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.2.19

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Type check
        run: cd apps/www && bun run typecheck
```

(The `if:` line, the `token:` and the `submodules:` lines are removed.)

**Verify**: `grep -n "github.event_name == 'push'" .github/workflows/ci.yml` → no output.
**Verify**: `grep -c "WINOFFRG_PAT" .github/workflows/ci.yml` → `1` (only the
`registry-install-test` job still references it).

### Step 3: Document the command

In `DEVELOPMENT.md`, under `## Commands`, add `cd apps/www && bun run typecheck`
to the "Registry and site checks" code block.

**Verify**: `grep -n "bun run typecheck" DEVELOPMENT.md` → one match.

### Step 4: Discard generated churn

Run `git status --short`. If `apps/www/next-env.d.ts` shows as modified by your
work, restore it: `git checkout -- apps/www/next-env.d.ts`.

**Verify**: `git status --short` lists only the three in-scope files.

## Test plan

No unit tests. The gate is the verification in Step 1 plus the CI run on the PR.

## Done criteria

- [ ] `cd apps/www && rm -rf .source .next/types .next/tsconfig.tsbuildinfo && bun run typecheck` exits 0
- [ ] `grep -n "github.event_name == 'push'" .github/workflows/ci.yml` returns nothing
- [ ] `bun run format:check` exits 0
- [ ] Only `.github/workflows/ci.yml`, `apps/www/package.json`, `DEVELOPMENT.md` are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `bun run typecheck` reports errors other than the two classes described in
  "Current state" (that would be a real type error introduced after `9e75eb9`;
  report it, do not fix it here).
- `next typegen` is not a recognised command (Next.js version differs from 16.3.1).
- The Step 1 verification fails twice.

## Maintenance notes

- When the pro submodule is absent, `apps/www/registry/pro/**` is simply not
  typechecked in CI. If pro code must be typechecked, add a second job gated
  on `github.event.pull_request.head.repo.full_name == github.repository`.
- Deferred: a CI job running `next build` and `bun run validate:seo`. Not
  included because the advisor did not verify a clean `next build` without
  the Vercel environment variables.
- Reviewer: confirm the PR's own CI run shows the "Type Check" job executing
  (not skipped) and passing.
