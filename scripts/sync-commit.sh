#!/usr/bin/env bash
set -e

SUBMODULE_PATH="apps/www/registry/pro"

if [[ -d "$SUBMODULE_PATH" ]]; then
  pushd "$SUBMODULE_PATH" > /dev/null
  # Check for changes in the submodule (staged or unstaged)
  if [[ -n $(git status --porcelain) ]]; then
    echo "Changes detected in submodule. Auto-committing..."
    git add .
    # Note: We use a generic message because pre-commit hooks don't have easy access 
    # to the user's incoming commit message for the main repo.
    git commit -m "chore: auto-sync submodule"
    popd > /dev/null
    
    # Stage the updated submodule state in the main repo so it's included in the current commit
    git add "$SUBMODULE_PATH"
  else
    popd > /dev/null
  fi
fi
