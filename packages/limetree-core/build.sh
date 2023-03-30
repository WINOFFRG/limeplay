#!/bin/bash

if git diff HEAD^ HEAD --quiet ./packages/limetree; then
    echo "🛑 - No changes in LimePlay folder. Skipping build."
    exit 0;
else
    echo "✅ - Changes detected in LimePlay folder. Triggering build."
    exit 1;
fi