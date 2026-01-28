import { useState } from 'react'
import { LevelSelect } from './components/LevelSelect'
import { GameBoard } from './components/GameBoard'
import { ProgressBar } from './components/ProgressBar'
import { getLevelDifferences } from './data/levels'
import type { GameState, Level } from './types'

const initialGameState: GameState = {
  levelId: null,
  theme: '',
  difficulty: 'medium',
  imageLeft: null,
  imageRight: null,
  differences: [],
  foundIds: new Set(),
  isLoading: false,
  error: null,
}

function App() {
  const [game, setGame] = useState<GameState>(initialGameState)

  const handleLevelSelect = (level: Level) => {
    const url = level.imageUrl
    const diffs = getLevelDifferences(level)
    setGame({
      ...initialGameState,
      levelId: level.id,
      theme: level.theme,
      imageLeft: url,
      imageRight: url,
      differences: diffs,
      foundIds: new Set(),
    })
  }

  const handleGameUpdate = (updates: Partial<GameState>) => {
    setGame((prev) => ({ ...prev, ...updates }))
  }

  const totalDiffs = game.differences.length
  const foundCount = game.foundIds.size
  const isPlaying = Boolean(game.imageLeft && game.imageRight)

  return (
    <div className="min-h-screen flex flex-col bg-yale-dark">
      <header className="border-b border-yale-blue-light/30 py-4 px-4 md:px-6 min-h-[72px] flex items-center">
        <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-lg md:text-xl text-white text-center flex-1 md:flex-none md:text-left">
            SPOT THE DIFFERENCE
          </h1>
          {isPlaying && (
            <ProgressBar found={foundCount} total={totalDiffs} />
          )}
        </div>
      </header>

      <main className="flex-1 py-6 px-4 md:px-6 max-w-6xl w-full mx-auto">
        {!isPlaying ? (
          <div className="space-y-6">
            <p className="text-center text-yale-blue-light/90 font-game text-sm min-h-[1.5rem]">
              Find 5 differences · Pick a level to start
            </p>
            <LevelSelect onSelect={handleLevelSelect} />
            {game.error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 text-sm text-center">
                {game.error}
              </div>
            )}
          </div>
        ) : (
          <GameBoard
            game={game}
            onUpdate={handleGameUpdate}
            onReset={() => setGame({ ...initialGameState, foundIds: new Set() })}
          />
        )}
      </main>

      <footer className="border-t border-yale-blue-light/30 py-3 px-4 text-center text-yale-blue-light/60 text-xs min-h-[44px] flex items-center justify-center">
        Built with React + Vite
      </footer>
    </div>
  )
}

export default App
