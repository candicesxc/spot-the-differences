#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "→ Initializing git (if needed)..."
git init

echo "→ Staging files (.env is ignored by .gitignore)..."
git add -A
git status --short

echo "→ Committing..."
git commit -m "Spot the Difference game – React, Vite, Tailwind, DALL·E 3" || echo "   (nothing new or already committed)"

echo "→ Setting remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/candicesxc/spot-the-differences.git

echo "→ Pushing to main..."
git branch -M main
git push -u origin main

echo "Done. See https://github.com/candicesxc/spot-the-differences"
