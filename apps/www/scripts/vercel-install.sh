#!/usr/bin/env bash
set -e

echo "Starting Vercel submodule setup (.gitmodules rewrite method)..."

# Check token
if [[ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]]; then
  echo "Error: GITHUB_REPO_CLONE_TOKEN is not set."
  exit 1
fi

# Move to repo root
cd "$(git rev-parse --show-toplevel)"

echo "Backing up .gitmodules..."
cp .gitmodules .gitmodules.bak

restore_gitmodules() {
  if [[ -f .gitmodules.bak ]]; then
    mv .gitmodules.bak .gitmodules
  fi
  rm -f .gitmodules.tmp
  # Restore token-free URLs in .git/config and the submodule remote.
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
