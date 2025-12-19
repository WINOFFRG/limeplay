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

echo "Rewriting .gitmodules to use HTTPS + Token..."
# Replace git@github.com:USER/REPO.git with https://TOKEN@github.com/USER/REPO.git
# We use | as delimiter to avoid escaping slashes
sed -i.tmp "s|git@github.com:|https://${GITHUB_REPO_CLONE_TOKEN}@github.com/|g" .gitmodules

echo "Syncing submodule configuration..."
# This updates .git/config with the new URLs from .gitmodules
git submodule sync --recursive

echo "Updating submodules..."
git submodule update --init --recursive

echo "Restoring original .gitmodules (optional)..."
mv .gitmodules.bak .gitmodules
rm -f .gitmodules.tmp

echo "Submodule setup complete."
