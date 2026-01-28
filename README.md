# Spot the Difference

“Spot the Difference” game built with React (Vite) and Tailwind CSS. Uses **pre-generated levels** for fast load (~0s wait) and a Yale Blue (#00356B) theme.

## Features

- **12 pre-defined levels** – Themes like Cyberpunk Tokyo, Cat Picnic, Underwater Castle, etc. Levels are loaded from `src/data/levels.json` (no API call during play).
- **Instant start** – Choosing a level starts the game immediately; images come from static assets in `/public/images/`.
- **Click to find** – Click differences; correct hits show a red circle and progress (e.g. “3 / 5 found”).
- **Suggest a theme** – After finishing a level, users can suggest a theme. Suggestions are stored in `localStorage` under `spotTheDifferenceSuggestions` (and logged to the console). A message says: “Thank you! Our AI is working on this theme for the next update.”

## Level data and images

- **Location:** `src/data/levels.json`
- **Shape:** Each level has `id`, `theme`, `imageUrl` (e.g. `/levels/level-1.png` or `/images/level-1.svg`), and `differences` (array of 5 `{ x, y, radius }` in 0–1, panel space).
- **Included:** Each level has a theme-colored SVG in `public/images/level-1.svg` … `level-12.svg` so the game is playable out of the box.

### Admin Tool: generate and import level assets

1. Set `VITE_OPENAI_API_KEY` in `.env`.
2. Open **http://localhost:5173?admin=1** (or `#admin`).
3. **Generate:** Pick a level/theme, click “Generate with DALL·E 3”. A wide (1792×1024) spot-the-difference image is created.
4. **Click 5 differences:** Click once on each of the 5 differences on the **right half** of the image.
5. **Export:** Click “Export image + JSON”. Saves `level-<id>.png` and `level-<id>-export.json`. Put both in the same folder.
6. **Import:** Run `node scripts/import-level.mjs /path/to/level-<id>-export.json`. The script copies the image to `public/levels/` and updates `src/data/levels.json`.
7. Repeat for all 12 levels. When done, remove the Admin UI (delete the `isAdmin()` check and `AdminTool` from `App.tsx`) and push `public/levels/` and `levels.json` to GitHub.

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
