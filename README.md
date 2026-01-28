# Spot the Difference

“Spot the Difference” game built with React (Vite) and Tailwind CSS. Uses **pre-generated levels** for fast load (~0s wait) and a Yale Blue (#00356B) theme.

## Features

- **12 pre-defined levels** – Themes like Cyberpunk Tokyo, Cat Picnic, Underwater Castle, etc. Levels are loaded from `src/data/levels.json` (no API call during play).
- **Instant start** – Choosing a level starts the game immediately; images come from static assets in `/public/images/`.
- **Click to find** – Click differences; correct hits show a red circle and progress (e.g. “3 / 5 found”).
- **Suggest a theme** – After finishing a level, users can suggest a theme. Suggestions are stored in `localStorage` under `spotTheDifferenceSuggestions` (and logged to the console). A message says: “Thank you! Our AI is working on this theme for the next update.”

## Level data and images

- **Location:** `src/data/levels.json`
- **Shape:** Each level has `id`, `theme`, `imageUrl` (path to a static asset in `/public/images/`), and `differences` (array of 5 `{ x, y, radius }` in 0–1).
- **Included:** Each level has a theme-colored SVG in `public/images/level-1.svg` … `level-12.svg` with difference circles that match the coordinates, so the game is playable out of the box.
- **AI-generated images (optional):** To replace them with DALL·E 3–generated puzzles, set `VITE_OPENAI_API_KEY` in `.env`, then run:
  ```bash
  node scripts/generate-level-images.mjs
  ```
  This writes `public/images/level-1.png` … `level-12.png`. Then in `src/data/levels.json` set each level’s `imageUrl` to `/images/level-N.png` and adjust the `differences` coordinates to match the new images if needed.

## Local development

```bash
git clone https://github.com/candicesxc/spot-the-differences.git
cd spot-the-differences
npm install
npm run dev    # http://localhost:5173
npm run build  # dist/
npm run preview
```

No API key is required for the level-based game.

## Deploy to GitHub Pages

- **Settings → Pages → Source:** GitHub Actions.
- Push to `main`; `.github/workflows/deploy.yml` builds and deploys.
- Or run `npm run deploy` to publish from `dist/` via the `gh-pages` package.

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Static level data + `localStorage` for theme suggestions
