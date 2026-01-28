import { useState } from 'react'
import { ThemeInput } from './components/ThemeInput'
import { DifficultySelector } from './components/DifficultySelector'
import { GameBoard } from './components/GameBoard'
import { ProgressBar } from './components/ProgressBar'
import type { Difficulty, GameState } from './types'

const initialGameState: GameState = {
  theme: '',
  difficulty: 'medium',
  imageLeft: null,
  imageRight: null,
  differences: [],
  foundIds: new Set(),
  cheatMode: false,
  isLoading: false,
  error: null,
}

function App() {
  const [game, setGame] = useState<GameState>(initialGameState)

  const handleStart = (theme: string, difficulty: Difficulty) => {
    setGame({
      ...initialGameState,
      theme,
      difficulty,
      isLoading: true,
      error: null,
    })
  }

  const handleGameUpdate = (updates: Partial<GameState>) => {
    setGame((prev) => ({ ...prev, ...updates }))
  }

  const totalDiffs = game.differences.length
  const foundCount = game.foundIds.size
  const isPlaying = Boolean(game.imageLeft && game.imageRight)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-dark-600 border-opacity-50 py-4 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-lg md:text-xl text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">
            SPOT THE DIFFERENCE
          </h1>
          {isPlaying && (
            <ProgressBar found={foundCount} total={totalDiffs} />
          )}
        </div>
      </header>

      <main className="flex-1 py-6 px-4 md:px-6 max-w-6xl w-full mx-auto">
        {!isPlaying ? (
          <div className="space-y-8 animate-float">
            <section className="text-center space-y-2">
              <p className="text-neon-pink font-game text-sm md:text-base tracking-wider">
                AI-POWERED · PICK A THEME · FIND 5 DIFFERENCES
              </p>
            </section>

            <ThemeInput difficulty={game.difficulty} onStart={handleStart} disabled={game.isLoading} />

            <DifficultySelector
              value={game.difficulty}
              onChange={(d) => setGame((g) => ({ ...g, difficulty: d }))}
              disabled={game.isLoading}
            />

            {game.error && (
              <div className="rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 text-sm">
                {game.error}
              </div>
            )}
          </div>
        ) : (
          <GameBoard game={game} onUpdate={handleGameUpdate} onReset={() => setGame({ ...initialGameState, foundIds: new Set() })} />
        )}
      </main>

      <footer className="border-t border-dark-600 border-opacity-50 py-3 px-4 text-center text-dark-400 text-xs">
        Powered by DALL·E 3 · Built with React + Vite
      </footer>
    </div>
  )
}

export default App
