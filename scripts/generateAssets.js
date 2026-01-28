#!/usr/bin/env node
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'

const root = process.cwd()
const levelsPath = join(root, 'src', 'data', 'levels.json')
const outDir = join(root, 'public', 'levels')

const promptForTheme = (theme) =>
  `Create a single "spot the difference" image. Left half: a detailed scene — "${theme}". Right half: the same scene but with exactly 5 visible changes (missing or extra object, different color, moved item). Crisp illustrated style, no text. One horizontal image split left | right, same framing.`

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
if (!apiKey) {
  console.error('Set OPENAI_API_KEY or VITE_OPENAI_API_KEY in your environment.')
  process.exit(1)
}

const client = new OpenAI({ apiKey })

const ensureDir = (dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const downloadToFile = async (url, outputPath) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`)
  }

  await new Promise((resolve, reject) => {
    const fileStream = createWriteStream(outputPath)
    response.body.pipe(fileStream)
    response.body.on('error', reject)
    fileStream.on('finish', resolve)
  })
}

const main = async () => {
  const levels = JSON.parse(readFileSync(levelsPath, 'utf8'))
  ensureDir(outDir)

  for (const [index, level] of levels.entries()) {
    const theme = level.theme
    const slug = slugify(theme)
    const outputPath = join(outDir, `${slug}.png`)

    console.log(`[${index + 1}/${levels.length}] Generating ${theme} → ${outputPath}`)

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: promptForTheme(theme),
      n: 1,
      size: '1024x512',
      quality: 'standard',
    })

    const imageUrl = response?.data?.[0]?.url
    if (!imageUrl) {
      throw new Error(`No image URL returned for theme: ${theme}`)
    }

    await downloadToFile(imageUrl, outputPath)
    console.log(`Saved ${outputPath}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
