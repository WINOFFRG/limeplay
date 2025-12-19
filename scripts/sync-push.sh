#!/usr/bin/env bash
set -e

SUBMODULE_PATH="apps/www/registry/pro"

# 1. Push Submodule
if [[ -d "$SUBMODULE_PATH" ]]; then
  echo "Syncing submodule push..."
  pushd "$SUBMODULE_PATH" > /dev/null
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  
  # Check if HEAD is detached
  if [[ "$BRANCH" == "HEAD" ]]; then
     echo "Submodule is in detached HEAD state. Skipping push."
  else
     # Check if upstream is configured
     if git config "branch.$BRANCH.merge" > /dev/null; then
        git push
     else
        echo "Setting upstream for submodule branch '$BRANCH'..."
        git push --set-upstream origin "$BRANCH"
     fi
  fi
  popd > /dev/null
fi

# 2. Push Main Repo
echo "Pushing main repo..."
MAIN_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if git config "branch.$MAIN_BRANCH.merge" > /dev/null; then
   git push
else
   echo "Setting upstream for main repo branch '$MAIN_BRANCH'..."
   git push --set-upstream origin "$MAIN_BRANCH"
fi

echo "Done."
