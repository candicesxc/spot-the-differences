import type { Level, Difference } from '../types'
import levelsJson from './levels.json'

const levels = levelsJson as Level[]

function toDifference(d: { x: number; y: number; radius: number }, i: number): Difference {
  return { id: `d${i + 1}`, x: d.x, y: d.y, radius: d.radius }
}

export function getAllLevels(): Level[] {
  return levels
}

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id)
}

export function getLevelDifferences(level: Level): Difference[] {
  return level.differences.map((d, i) => toDifference(d, i))
}
