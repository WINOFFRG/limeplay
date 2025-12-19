#!/usr/bin/env bash
set -e

SUBMODULE_PATH="apps/www/registry/pro"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ -d "$SUBMODULE_PATH" ]]; then
  echo "Syncing submodule '$SUBMODULE_PATH' to branch '$CURRENT_BRANCH'..."
  pushd "$SUBMODULE_PATH" > /dev/null
  
  # Check if branch exists locally
  if git show-ref --verify --quiet "refs/heads/$CURRENT_BRANCH"; then
    git checkout "$CURRENT_BRANCH"
  else
    # Check if branch exists remotely
    git fetch origin
    if git show-ref --verify --quiet "refs/remotes/origin/$CURRENT_BRANCH"; then
      git checkout -b "$CURRENT_BRANCH" "origin/$CURRENT_BRANCH"
    else
      # Create new branch
      echo "Creating new branch '$CURRENT_BRANCH' in submodule..."
      git checkout -b "$CURRENT_BRANCH"
    fi
  fi
  popd > /dev/null
  echo "Submodule synced."
fi
