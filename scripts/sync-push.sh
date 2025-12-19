#!/usr/bin/env bash
set -e

SUBMODULE_PATH="apps/www/registry/pro"

if [[ -d "$SUBMODULE_PATH" ]]; then
  echo "Syncing submodule push..."
  pushd "$SUBMODULE_PATH" > /dev/null
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  
  if [[ "$BRANCH" == "HEAD" ]]; then
     echo "Submodule is in detached HEAD state. Skipping push."
  else
     if git config "branch.$BRANCH.merge" > /dev/null; then
        git push
     else
        echo "Setting upstream for submodule branch '$BRANCH'..."
        git push --set-upstream origin "$BRANCH"
     fi
  fi
  popd > /dev/null
fi
# Main repo push continues automatically after this hook passes
