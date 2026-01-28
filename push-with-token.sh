#!/usr/bin/env bash
# One-time push using your GitHub token. Run from this folder:
#   GITHUB_TOKEN=your_token_here ./push-with-token.sh
# Or run and paste token when prompted (after "Token:" appears).
set -e
cd "$(dirname "$0")"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Run: GITHUB_TOKEN=your_github_token ./push-with-token.sh"
  echo "Or enter token when prompted:"
  read -rs GITHUB_TOKEN
  echo
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "No token provided. Exit."
  exit 1
fi

git remote set-url origin "https://candicesxc:${GITHUB_TOKEN}@github.com/candicesxc/spot-the-differences.git"
git push -u origin main

# Remove token from remote URL after push (leave only HTTPS URL)
git remote set-url origin "https://github.com/candicesxc/spot-the-differences.git"

echo "Done. Repo: https://github.com/candicesxc/spot-the-differences"
