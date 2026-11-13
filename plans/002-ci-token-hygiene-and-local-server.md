# Plan 002: Clone tokens are not exposed to third-party code, and the test server is local-only

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 9e75eb9..HEAD -- .github/workflows/ci.yml apps/www/scripts/vercel-install.sh apps/www/scripts/test-registry-install.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition. (Plan 001 edits the `typecheck` job
> in `ci.yml`; that change is expected and is not drift for this plan.)

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED (Step 2 changes the production install script and cannot be fully tested locally)
- **Depends on**: none (apply after 001 to avoid a merge conflict in `ci.yml`)
- **Category**: security
- **Planned at**: commit `9e75eb9`, 2026-11-13

## Why this matters

`apps/www/registry/pro` is a private git submodule, so CI and Vercel each hold
a GitHub token to clone it. Today that token is left on disk where every later
build step can read it — including unpinned `shadcn@latest`, dependency install
scripts, and source fetched from a third-party registry host. One CI job holds
the token even though it never uses the submodule. Separately, the local
registry test server listens on every network interface and will serve files
outside its folder. This plan removes those three exposures.

**Never print, echo, log or commit a token value while doing this work.**

## Current state

- `.github/workflows/ci.yml`, job `registry-install-test` (lines 73–97):

  ```yaml
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.WINOFFRG_PAT }}
          submodules: recursive
  ```

  The job then runs `cd apps/www && bun run test:registry-install`. That script
  only installs the two public blocks (`BLOCK_CONFIGS` in
  `apps/www/scripts/test-registry-install.ts:50-61`: `audio-player`,
  `video-player`). The separate `registry` job already builds the registry on a
  checkout with **no** submodule and passes, so the build does not need pro.
- The workflow has no top-level `permissions:` block.
- `apps/www/scripts/vercel-install.sh` (whole file, 34 lines) — runs on Vercel.
  It rewrites `.gitmodules` to an HTTPS URL containing `${GITHUB_REPO_CLONE_TOKEN}`,
  runs `git submodule sync --recursive` (which copies that URL into `.git/config`),
  runs `git submodule update --init --recursive`, then restores only `.gitmodules`:

  ```bash
  sed -i.tmp "s|git@github.com:|https://${GITHUB_REPO_CLONE_TOKEN}@github.com/|g" .gitmodules
  …
  git submodule sync --recursive
  …
  git submodule update --init --recursive

  echo "Restoring original .gitmodules (optional)..."
  mv .gitmodules.bak .gitmodules
  rm -f .gitmodules.tmp
  ```

  The file starts with `set -e` and has no `trap`, so a failed clone leaves the
  token-bearing `.gitmodules` in place. After success the token remains in
  `.git/config` and in the submodule's `remote.origin.url`.
- `apps/www/scripts/test-registry-install.ts`:
  - line 32: `const SERVER_PORT = 5178`
  - line 182: `` `REGISTRY_HOST=http://localhost:${SERVER_PORT} bun run ./scripts/registry-dev.mts`, ``
  - lines 387–389 and 413–415:

    ```ts
    server = http.createServer((req, res) => {
      const urlPath = req.url?.split("?")[0] ?? "/"
      const filePath = join(PUBLIC_DIR, urlPath)
    …
    server.listen(SERVER_PORT, () => {
      resolvePromise(`http://localhost:${SERVER_PORT}`)
    })
    ```

  - line 26 imports: `import { dirname, extname, join, resolve } from "path"`

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Shell syntax | `bash -n apps/www/scripts/vercel-install.sh` | exit 0, no output |
| Typecheck | `cd apps/www && bunx tsc --noEmit` | exit 0 (if it fails with `fumadocs-mdx:collections` or `RouteContext`, run `bunx fumadocs-mdx && bunx next typegen && rm -f .next/tsconfig.tsbuildinfo` first) |
| Lint | `bun run lint` (repo root) | 0 errors |
| Format | `bun run format:check` (repo root) | exit 0 |

## Scope

**In scope**:
- `.github/workflows/ci.yml` — `registry-install-test` checkout step and a new top-level `permissions:` block
- `apps/www/scripts/vercel-install.sh`
- `apps/www/scripts/test-registry-install.ts` — server host, URL and path check only

**Out of scope**:
- Rotating or re-scoping the tokens themselves — only the repository owner can do that (see Maintenance notes).
- `.github/workflows/indexnow.yml` — already uses `persist-credentials: false` and `contents: read`.
- Pinning actions to commit SHAs, pinning `shadcn@latest` — deferred.
- The `typecheck` job — plan 001.

## Git workflow

- Branch: `chore/ci-token-hygiene`. Commit style: conventional lower-case, e.g. `chore: keep clone token out of git config`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Remove the token from the install-test job and restrict workflow permissions

In `.github/workflows/ci.yml`:

1. In job `registry-install-test`, replace the checkout step with a plain
   `- uses: actions/checkout@v4` (delete the `with:` block with `token:` and `submodules:`).
2. Directly after the `on:` block and before `concurrency:`, add:

   ```yaml
   permissions:
     contents: read
   ```

**Verify**: `grep -c "WINOFFRG_PAT" .github/workflows/ci.yml` → `0` if plan 001
is applied, otherwise `1` (the `typecheck` job).
**Verify**: `grep -n "^permissions:" .github/workflows/ci.yml` → one match.

### Step 2: Make `vercel-install.sh` clean up the token on success and on failure

Replace the body of `apps/www/scripts/vercel-install.sh` after the `cd "$(git rev-parse --show-toplevel)"`
line with the following (keep the token check and the `cd` above it unchanged):

```bash
echo "Backing up .gitmodules..."
cp .gitmodules .gitmodules.bak

restore_gitmodules() {
  if [[ -f .gitmodules.bak ]]; then
    mv .gitmodules.bak .gitmodules
  fi
  rm -f .gitmodules.tmp
  # Re-sync so .git/config and the submodule remote go back to the token-free URL.
  git submodule sync --recursive >/dev/null 2>&1 || true
}
trap restore_gitmodules EXIT

echo "Rewriting .gitmodules to use HTTPS + Token..."
sed -i.tmp "s|git@github.com:|https://${GITHUB_REPO_CLONE_TOKEN}@github.com/|g" .gitmodules

echo "Syncing submodule configuration..."
git submodule sync --recursive

echo "Updating submodules..."
git submodule update --init --recursive

echo "Submodule setup complete."
```

The `trap … EXIT` runs on both success and failure, so the old explicit
"Restoring original .gitmodules" block is removed.

**Verify**: `bash -n apps/www/scripts/vercel-install.sh` → exit 0.
**Verify**: `grep -n "set -x\|echo.*GITHUB_REPO_CLONE_TOKEN" apps/www/scripts/vercel-install.sh`
→ only the existing `echo "Error: GITHUB_REPO_CLONE_TOKEN is not set."` line (it prints the variable *name*, not its value).

### Step 3: Bind the test server to loopback and confine it to `public/`

In `apps/www/scripts/test-registry-install.ts`:

1. Add `sep` to the `path` import: `import { dirname, extname, join, resolve, sep } from "path"`.
2. Add a constant next to `SERVER_PORT`: `const SERVER_HOST = "127.0.0.1"`.
3. Line 182: change `http://localhost:${SERVER_PORT}` to `http://${SERVER_HOST}:${SERVER_PORT}`.
4. In the request handler, replace the `filePath` line with:

   ```ts
   const filePath = resolve(PUBLIC_DIR, `.${urlPath}`)

   if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + sep)) {
     res.writeHead(403)
     res.end("Forbidden")
     return
   }
   ```

5. Replace the `listen` call with:

   ```ts
   server.listen(SERVER_PORT, SERVER_HOST, () => {
     resolvePromise(`http://${SERVER_HOST}:${SERVER_PORT}`)
   })
   ```

Using the literal `127.0.0.1` in the URLs (not `localhost`) matters: `localhost`
can resolve to IPv6 `::1`, which a server bound to `127.0.0.1` does not answer.

**Verify**: `grep -n "localhost" apps/www/scripts/test-registry-install.ts` → no matches.
**Verify**: `cd apps/www && bunx tsc --noEmit` → exit 0.
**Verify**: `bun run lint` → 0 errors.

## Test plan

- No unit tests. `bun run test:registry-install` (in `apps/www`) is the end-to-end
  check for Step 3, but it scaffolds four apps from the network and takes up to
  20 minutes; run it only if the operator asks. CI runs it on the PR.
- Step 2 can only be proven by a Vercel preview deployment of the PR.

## Done criteria

- [ ] `bash -n apps/www/scripts/vercel-install.sh` exits 0
- [ ] `grep -n "trap restore_gitmodules EXIT" apps/www/scripts/vercel-install.sh` → one match
- [ ] `grep -n "localhost" apps/www/scripts/test-registry-install.ts` → no matches
- [ ] `grep -n "^permissions:" .github/workflows/ci.yml` → one match
- [ ] `cd apps/www && bunx tsc --noEmit` exits 0; `bun run lint` 0 errors; `bun run format:check` exits 0
- [ ] No files outside the in-scope list are modified
- [ ] `plans/README.md` status row updated

## STOP conditions

- `vercel-install.sh` does not match the excerpt (someone changed the clone method).
- Any step would require printing or reading a token value.
- The registry build inside `test:registry-install` turns out to require the
  pro submodule (the CI `registry-install-test` job fails after Step 1 with a
  missing `registry/pro` path). Report; do not re-add the token.

## Maintenance notes

- **Owner action, not executor work**: check the scope of the `WINOFFRG_PAT`
  secret and the Vercel `GITHUB_REPO_CLONE_TOKEN`. Replace each with a
  fine-grained, read-only token limited to the `limeplay-pro` repository (or a
  deploy key), and rotate the current ones — they have been readable by build
  steps until now. This plan is not a substitute for that; treat it as a
  recommendation and confirm with whoever owns security for the project.
- The Vercel preview build of this PR is the real test of Step 2. If the
  preview fails at "Updating submodules", revert Step 2 only.
- Deferred: pin GitHub Actions to commit SHAs; pin `shadcn@latest` in
  `test-registry-install.ts:325,351` to a version; vendor the third-party
  registry dependency `https://bazza.dev/r/hit-area` (declared in
  `registry-blocks.ts:111,229` and four examples) so installs do not pull code
  from another host.
