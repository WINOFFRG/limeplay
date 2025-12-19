#!/usr/bin/env bash
set -e

echo "Starting Vercel submodule setup (Manual Clone Method)..."

# Configuration
SUBMODULE_PATH="apps/www/registry/pro"
SUBMODULE_GITHUB_URL="github.com/WINOFFRG/limeplay-pro.git"

# Verify Token
if [[ -z "${GITHUB_REPO_CLONE_TOKEN:-}" ]]; then
  echo "Error: GITHUB_REPO_CLONE_TOKEN is not set."
  exit 1
fi

# Move to repo root
cd "$(git rev-parse --show-toplevel)"

echo "Processing submodule: $SUBMODULE_PATH"

# 1. Get the expected commit hash for the submodule
# Output format: "-<commit> <path>" or "+<commit> <path>" or " <commit> <path>"
# We use awk to extract the commit hash (column 1, stripping prefix symbols)
SUBMODULE_STATUS=$(git submodule status "$SUBMODULE_PATH")
COMMIT_HASH=$(echo "$SUBMODULE_STATUS" | awk '{print $1}' | sed 's/^[+\-]//')

echo "Target commit: $COMMIT_HASH"

if [[ -z "$COMMIT_HASH" ]]; then
  echo "Error: Could not determine commit hash for $SUBMODULE_PATH"
  exit 1
fi

# 2. Clone to a temporary directory
TEMP_DIR="tmp_submodule_clone"
rm -rf "$TEMP_DIR" || true
mkdir -p "$TEMP_DIR"

echo "Cloning $SUBMODULE_GITHUB_URL to temporary directory..."
git clone --depth 1 "https://${GITHUB_REPO_CLONE_TOKEN}@${SUBMODULE_GITHUB_URL}" "$TEMP_DIR"

# 3. Checkout the specific commit
pushd "$TEMP_DIR" > /dev/null
echo "Fetching specific commit: $COMMIT_HASH"
git fetch origin "$COMMIT_HASH"
git checkout "$COMMIT_HASH"
popd > /dev/null

# 4. Move files to the submodule path
echo "Moving submodule files to $SUBMODULE_PATH..."
rm -rf "$SUBMODULE_PATH"
mkdir -p "$SUBMODULE_PATH"

# Move content, excluding .git
rsync -av --exclude='.git' "$TEMP_DIR/" "$SUBMODULE_PATH/"

# 5. Cleanup
rm -rf "$TEMP_DIR"

echo "Submodule setup complete."
