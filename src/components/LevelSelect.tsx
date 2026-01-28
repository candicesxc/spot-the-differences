import { getAllLevels } from '../data/levels'
import type { Level } from '../types'

interface LevelSelectProps {
  onSelect: (level: Level) => void
}

const levels = getAllLevels()

export function LevelSelect({ onSelect }: LevelSelectProps) {
  return (
    <section className="w-full">
      <h2 className="text-center text-white font-game text-sm uppercase tracking-wider mb-4 min-h-[2rem]">
        Choose a level
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {levels.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelect(level)}
            className="flex flex-col items-center justify-center min-h-[88px] rounded-lg bg-yale-blue hover:bg-yale-blue-border border border-yale-blue-border text-white font-game text-xs sm:text-sm text-center px-3 py-4 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span className="font-display text-[10px] opacity-80">Level {level.id}</span>
            <span className="mt-0.5 line-clamp-2">{level.theme}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
