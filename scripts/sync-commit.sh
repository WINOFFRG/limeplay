#!/usr/bin/env bash
set -e

SUBMODULE_PATH="apps/www/registry/pro"
MSG="$1"

if [[ -z "$MSG" ]]; then
  echo "Usage: bun commit \"your commit message\""
  exit 1
fi

echo "Committing..."

# 1. Commit in Submodule
if [[ -d "$SUBMODULE_PATH" ]]; then
  pushd "$SUBMODULE_PATH" > /dev/null
  if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected in submodule. Committing..."
    git add .
    git commit -m "$MSG" || echo "Submodule commit failed or empty?"
  else
    echo "No changes in submodule."
  fi
  popd > /dev/null
fi

# 2. Add Submodule update to Main Repo
git add "$SUBMODULE_PATH"

# 3. Commit in Main Repo
git add .
git commit -m "$MSG"

echo "Done. Synced commit."
