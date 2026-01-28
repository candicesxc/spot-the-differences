# Spot the Difference

AI-powered “Spot the Difference” game built with React (Vite), Tailwind CSS, and OpenAI DALL·E 3. Hosted on GitHub Pages.

## Features

- **Theme input** – Type a theme (e.g. “Cyberpunk Tokyo”, “Cat Picnic”) and generate a puzzle.
- **DALL·E 3** – One wide image (1792×1024) with left/right scenes and 5 differences.
- **Difficulty** – Easy (large), Medium, Hard (subtle).
- **Click to find** – Click on differences; correct hits get a red circle and count toward “X of 5 found”.
- **Cheat mode** – Use fixed difference regions for testing when AI placement is inconsistent.

## Push this project to GitHub

From the project folder, run:

```bash
git init
git add -A
git commit -m "Spot the Difference game – React, Vite, Tailwind, DALL·E 3"
git branch -M main
git remote add origin https://github.com/candicesxc/spot-the-differences.git
git push -u origin main
```

Your `.env` file is in `.gitignore` and will **not** be committed, so your API key stays local.

## Local development

### 1. Clone and install

```bash
git clone https://github.com/candicesxc/spot-the-differences.git
cd spot-the-differences
npm install
```

### 2. API key (required for image generation)

**Never commit your OpenAI API key.** Use a local `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your key:

```
VITE_OPENAI_API_KEY=sk-your-openai-key-here
```

Get a key at [OpenAI API keys](https://platform.openai.com/api-keys).

### 3. Run and build

```bash
npm run dev    # http://localhost:5173
npm run build  # output in dist/
npm run preview # preview production build
```

## Deploy to GitHub Pages

### Option A: GitHub Actions (recommended)

1. In the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. (Optional) To enable image generation on the live site, add a secret:
   - **Settings → Secrets and variables → Actions** → **New repository secret**
   - Name: `VITE_OPENAI_API_KEY`, Value: your OpenAI API key.
   - **Warning:** Anyone who can open your repo’s secrets could see it. Prefer using the app locally and leaving the deployed site without a key if you’re worried about exposure.
3. Push to `main`; the workflow in `.github/workflows/deploy.yml` will build and deploy.

### Option B: Local deploy with `gh-pages`

```bash
npm run deploy
```

Uses the `gh-pages` package to push `dist/` to the `gh-pages` branch. Ensure **Settings → Pages** uses the `gh-pages` branch and `/ (root)` (or `/docs` if you change the script).

The app is built with `base: '/spot-the-differences/'` in `vite.config.ts`, so the site URL is:

**https://candicesxc.github.io/spot-the-differences/**

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- OpenAI API (DALL·E 3), called from the browser with `VITE_OPENAI_API_KEY`
