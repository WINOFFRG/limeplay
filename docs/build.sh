#!/bin/bash

if git diff HEAD^ HEAD --quiet ./docs; then
    echo "🛑 - No changes in docs folder. Skipping build."
    exit 0;
else
    echo "✅ - Changes detected in docs folder. Triggering build."
    exit 1;
fi