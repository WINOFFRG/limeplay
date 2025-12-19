#!/usr/bin/env bash
set -euo pipefail

echo "Starting Vercel submodule setup..."

# Check if GITHUB_REPO_CLONE_TOKEN is set (matching User's variable)
if [[ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]]; then
  echo "Error: GITHUB_REPO_CLONE_TOKEN is not set."
  echo "Please set this environment variable in Vercel project settings."
  exit 1
fi

# Configure git to use the token for all GitHub URLs
# This dynamically handles any submodule defined in .gitmodules without hardcoding paths.
# usage: https://x-access-token:<token>@github.com/
echo "Configuring git credential helper..."
git config --global url."https://x-access-token:${GITHUB_REPO_CLONE_TOKEN}@github.com/".insteadOf "git@github.com:"
git config --global url."https://x-access-token:${GITHUB_REPO_CLONE_TOKEN}@github.com/".insteadOf "https://github.com/"

# Move to the repo root to perform git operations
cd "$(git rev-parse --show-toplevel)"

# Update submodules respecting .gitmodules
echo "Updating submodules..."
git submodule sync --recursive
git submodule update --init --recursive

echo "Submodule setup complete."

# Run install as per package.json (usually bun install)
# This script is called by "install:vercel", the next step is usually implicit or handled by Vercel's loop,
# but if this REPLACES the install command, we must run install.
echo "Running package installation..."
bun install