#!/usr/bin/env bash
set -e

echo "Starting Vercel submodule setup with Branch Matching..."

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
sed -i.tmp "s|git@github.com:|https://${GITHUB_REPO_CLONE_TOKEN}@github.com/|g" .gitmodules

echo "Syncing submodule configuration..."
git submodule sync --recursive

echo "Updating submodules..."
git submodule update --init --recursive

# ------------------------------------------------------------------
# Dynamic Branch Matching Logic
# ------------------------------------------------------------------
echo "Checking for matching branch in submodule..."

# Get current branch name (Vercel env var or fallback to git)
BRANCH_NAME="${VERCEL_GIT_COMMIT_REF:-}"
if [[ -z "$BRANCH_NAME" ]]; then
  BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
fi

echo "Current Monorepo Branch: $BRANCH_NAME"

if [[ "$BRANCH_NAME" == "HEAD" || -z "$BRANCH_NAME" ]]; then
  echo "Current branch is detached or unknown. Keeping pinned submodule commit."
else
  SUBMODULE_DIR="apps/www/registry/pro"
  
  if [[ -d "$SUBMODULE_DIR" ]]; then
    pushd "$SUBMODULE_DIR" > /dev/null
    
    # Check if a branch with the same name exists in the submodule remote
    echo "Checking submodule remote for branch '$BRANCH_NAME'..."
    if git ls-remote --exit-code --heads origin "$BRANCH_NAME" >/dev/null 2>&1; then
      echo "✅ Found matching branch '$BRANCH_NAME' in submodule."
      echo "Switching submodule to match..."
      
      # Fetch and Checkout
      git fetch origin "$BRANCH_NAME"
      git checkout "$BRANCH_NAME"
      git pull origin "$BRANCH_NAME"
      
      echo "Submodule is now on branch '$BRANCH_NAME'."
    else
      echo "ℹ️  Branch '$BRANCH_NAME' not found in submodule."
      echo "Staying on pinned commit (default behavior)."
    fi
    popd > /dev/null
  else
    echo "Warning: Submodule directory not found at $SUBMODULE_DIR"
  fi
fi
# ------------------------------------------------------------------

echo "Restoring original .gitmodules..."
mv .gitmodules.bak .gitmodules
rm -f .gitmodules.tmp

echo "Submodule setup complete."
