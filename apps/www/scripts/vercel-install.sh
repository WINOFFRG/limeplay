#!/usr/bin/env bash
set -euo pipefail

echo "Starting Vercel submodule setup..."

# Move to the repo root to perform git operations
cd "$(git rev-parse --show-toplevel)"

# Check if GITHUB_REPO_CLONE_TOKEN is set
if [[ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]]; then
  echo "Error: GITHUB_REPO_CLONE_TOKEN is not set."
  echo "Please set this environment variable in Vercel project settings."
  exit 1
fi

# Configure git LOCALLY for this repository
# Using --global in CI can be flaky or permission-restricted.
# Local config (.git/config) is reliable for the current build.
echo "Configuring git credential helper (local)..."
# We unconfigure any previous settings just in case
git config --unset-all url."https://x-access-token:${GITHUB_REPO_CLONE_TOKEN}@github.com/".insteadOf || true

# Set the replacement rules
git config url."https://x-access-token:${GITHUB_REPO_CLONE_TOKEN}@github.com/".insteadOf "git@github.com:"
git config url."https://x-access-token:${GITHUB_REPO_CLONE_TOKEN}@github.com/".insteadOf "https://github.com/"

# Debug: Print config to verify (masking token for safety if we wanted, but here just checking keys)
echo "Active 'insteadOf' configurations:"
git config --get-regexp "url\..*\.insteadOf" | sed "s/${GITHUB_REPO_CLONE_TOKEN}/[TOKEN]/g" || true

echo "Updating submodules..."
# Sync resets submodule URLs in .git/config to match .gitmodules (which uses SSH)
git submodule sync --recursive

# Update uses the URLs from .git/config, which will be intercepted by the insteadOf rule
git submodule update --init --recursive

echo "Submodule setup complete."
