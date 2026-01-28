import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageWithOverlay } from './ImageWithOverlay'
import { generateImages } from '../lib/openai'
import type { GameState, Difference } from '../types'

interface GameBoardProps {
  game: GameState
  onUpdate: (updates: Partial<GameState>) => void
  onReset?: () => void
}

/** Default "cheat" differences: 5 circles as fraction of image (0–1). Use when AI coords are unreliable. */
const CHEAT_DIFFERENCES: Difference[] = [
  { id: 'c1', x: 0.25, y: 0.3, radius: 0.08 },
  { id: 'c2', x: 0.5, y: 0.45, radius: 0.08 },
  { id: 'c3', x: 0.75, y: 0.35, radius: 0.08 },
  { id: 'c4', x: 0.35, y: 0.7, radius: 0.08 },
  { id: 'c5', x: 0.65, y: 0.65, radius: 0.08 },
]

export function GameBoard({ game, onUpdate, onReset }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [useCheatMode, setUseCheatMode] = useState(false)

  useEffect(() => {
    if (!game.theme || !game.isLoading) return

    const key = import.meta.env.VITE_OPENAI_API_KEY
    if (!key) {
      onUpdate({
        isLoading: false,
        error: 'Missing VITE_OPENAI_API_KEY. Add it to a .env file (see .env.example).',
      })
      return
    }

    let cancelled = false
    generateImages(game.theme, game.difficulty, key)
      .then(({ imageLeft, imageRight, differences }) => {
        if (cancelled) return
        onUpdate({
          imageLeft,
          imageRight,
          differences: differences.length >= 5 ? differences : CHEAT_DIFFERENCES,
          isLoading: false,
          error: null,
          cheatMode: differences.length < 5,
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        onUpdate({
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to generate images.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [game.theme, game.difficulty, game.isLoading, onUpdate])

  const handleHit = useCallback(
    (id: string) => {
      onUpdate({
        foundIds: new Set([...game.foundIds, id]),
      })
    },
    [game.foundIds, onUpdate]
  )

  if (game.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-neon-cyan font-game">Generating your images…</p>
        <p className="text-dark-400 text-sm">This may take 20–40 seconds.</p>
      </div>
    )
  }

  const differences = useCheatMode ? CHEAT_DIFFERENCES : game.differences
  const total = differences.length
  const found = game.foundIds.size
  const isWin = total > 0 && found >= total

  return (
    <div ref={containerRef} className="space-y-4">
      {isWin && (
        <div className="rounded-lg bg-neon-green/20 border-2 border-neon-green text-neon-green px-4 py-3 text-center font-display text-sm animate-pulse-glow">
          YOU FOUND THEM ALL — Nice work!
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-neon-pink font-game text-sm">
          Theme: <span className="text-white">{game.theme}</span>
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-dark-400 cursor-pointer">
            <input
              type="checkbox"
              checked={useCheatMode}
              onChange={(e) => setUseCheatMode(e.target.checked)}
              className="rounded border-dark-500"
            />
            Cheat mode (fixed spots)
          </label>
          <button
            type="button"
            onClick={() => onReset?.()}
            className="text-xs text-neon-cyan hover:underline"
          >
            New game
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <p className="text-xs text-dark-400 mb-1 font-game">LEFT</p>
          <ImageWithOverlay
            src={game.imageLeft!}
            differences={differences}
            foundIds={game.foundIds}
            onHit={handleHit}
            side="left"
            half={game.imageLeft === game.imageRight ? 'left' : undefined}
          />
        </div>
        <div className="relative">
          <p className="text-xs text-dark-400 mb-1 font-game">RIGHT</p>
          <ImageWithOverlay
            src={game.imageRight!}
            differences={differences}
            foundIds={game.foundIds}
            onHit={handleHit}
            side="right"
            half={game.imageLeft === game.imageRight ? 'right' : undefined}
          />
        </div>
      </div>
    </div>
  )
}
