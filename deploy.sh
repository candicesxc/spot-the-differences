#!/usr/bin/env bash
set -e
echo "Building for GitHub Pages (base: /spot-the-differences/)..."
npm run build
echo "Deploying to gh-pages branch..."
npx gh-pages -d dist
echo "Done. Site will be at https://candicesxc.github.io/spot-the-differences/"
