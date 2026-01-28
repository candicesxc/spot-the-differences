#!/usr/bin/env node
/**
 * One-time script to generate AI (DALL-E 3) images for each level.
 * Requires: VITE_OPENAI_API_KEY in .env or environment.
 * Output: public/images/level-1.png ... level-12.png
 *
 * Run from project root:
 *   node scripts/generate-level-images.mjs
 *
 * Uses dotenv if available, or load .env manually. For a quick run:
 *   VITE_OPENAI_API_KEY=your_key node scripts/generate-level-images.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const levelsPath = join(root, 'src', 'data', 'levels.json')
const outDir = join(root, 'public', 'images')

const prompt = (theme) =>
  `Create a single image for a "spot the difference" puzzle. Left half: a detailed scene — "${theme}". Right half: the SAME scene but with exactly 5 visible changes (e.g. missing or extra object, different color, moved item). Style: crisp, illustrated, no text. One horizontal image, left scene | right scene, same framing.`

async function generate(theme, apiKey) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt(theme),
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'url',
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || res.statusText)
  }
  const data = await res.json()
  return data.data?.[0]?.url
}

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function loadEnv() {
  const p = join(root, '.env')
  if (!existsSync(p)) return
  const content = readFileSync(p, 'utf8')
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*VITE_OPENAI_API_KEY\s*=\s*(.+)/)
    if (m) return m[1].replace(/^["']|["']$/g, '').trim()
  }
}

async function main() {
  const apiKey = process.env.VITE_OPENAI_API_KEY || loadEnv()
  if (!apiKey) {
    console.error('Set VITE_OPENAI_API_KEY in .env or environment.')
    process.exit(1)
  }

  const levels = JSON.parse(readFileSync(levelsPath, 'utf8'))
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    const id = level.id
    const outPath = join(outDir, `level-${id}.png`)
    console.log(`[${i + 1}/${levels.length}] ${level.theme} → level-${id}.png`)
    try {
      const url = await generate(level.theme, apiKey)
      if (!url) throw new Error('No URL in response')
      const buf = await download(url)
      writeFileSync(outPath, buf)
      console.log(`  Saved ${outPath}`)
    } catch (e) {
      console.error(`  Error: ${e.message}`)
    }
  }
  console.log('Done. Update src/data/levels.json imageUrl to /images/level-N.png if you use PNG.')
}

main()
