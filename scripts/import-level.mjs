#!/usr/bin/env node
/**
 * Imports one level from an Admin Tool export.
 *
 * Usage:
 *   node scripts/import-level.mjs <path-to-export.json>
 *
 * Expects the image file in the same directory as the JSON, named level-<id>.png
 * (e.g. level-5-export.json → level-5.png).
 *
 * Writes the image to public/levels/level-<id>.png and updates src/data/levels.json
 * with imageUrl /levels/level-<id>.png and the 5 differences.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const levelsPath = join(root, 'src', 'data', 'levels.json')
const levelsDir = join(root, 'public', 'levels')

function main() {
  const jsonPath = process.argv[2]
  if (!jsonPath) {
    console.error('Usage: node scripts/import-level.mjs <path-to-export.json>')
    console.error('Example: node scripts/import-level.mjs ./level-5-export.json')
    process.exit(1)
  }

  const absJson = resolve(process.cwd(), jsonPath)
  if (!existsSync(absJson)) {
    console.error('File not found:', absJson)
    process.exit(1)
  }

  const payload = JSON.parse(readFileSync(absJson, 'utf8'))
  const { id, theme, imageUrl: _, differences } = payload
  const imageFileName = `level-${id}.png`
  const imagePath = join(dirname(absJson), imageFileName)

  if (!existsSync(imagePath)) {
    console.error('Image not found:', imagePath)
    console.error('Ensure', imageFileName, 'is in the same folder as the export JSON.')
    process.exit(1)
  }

  if (!Array.isArray(differences) || differences.length !== 5) {
    console.error('Export must contain exactly 5 differences.')
    process.exit(1)
  }

  if (!existsSync(levelsDir)) mkdirSync(levelsDir, { recursive: true })

  const destImage = join(levelsDir, imageFileName)
  copyFileSync(imagePath, destImage)
  console.log('Copied image to', destImage)

  const levels = JSON.parse(readFileSync(levelsPath, 'utf8'))
  const index = levels.findIndex((l) => l.id === String(id))
  if (index === -1) {
    levels.push({
      id: String(id),
      theme: theme || `Level ${id}`,
      imageUrl: `/levels/${imageFileName}`,
      differences,
    })
    console.log('Added new level', id)
  } else {
    levels[index] = {
      ...levels[index],
      theme: theme || levels[index].theme,
      imageUrl: `/levels/${imageFileName}`,
      differences,
    }
    console.log('Updated level', id)
  }

  writeFileSync(levelsPath, JSON.stringify(levels, null, 2) + '\n')
  console.log('Updated', levelsPath)
}

main()
