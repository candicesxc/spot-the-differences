import { useCallback, useState } from 'react'
import { ImageWithOverlay } from './ImageWithOverlay'
import type { GameState } from '../types'

const SUGGESTIONS_KEY = 'spotTheDifferenceSuggestions'

function loadSuggestions(): string[] {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveSuggestion(theme: string) {
  const arr = loadSuggestions()
  arr.push(theme)
  try {
    localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(arr))
  } catch {
    console.warn('Could not save suggestion to localStorage')
  }
  console.log('Theme suggestions:', arr)
}

interface GameBoardProps {
  game: GameState
  onUpdate: (updates: Partial<GameState>) => void
  onReset?: () => void
}

export function GameBoard({ game, onUpdate, onReset }: GameBoardProps) {
  const [suggestTheme, setSuggestTheme] = useState('')
  const [suggestSubmitted, setSuggestSubmitted] = useState(false)

  const handleHit = useCallback(
    (id: string) => {
      onUpdate({
        foundIds: new Set([...game.foundIds, id]),
      })
    },
    [game.foundIds, onUpdate]
  )

  const total = game.differences.length
  const found = game.foundIds.size
  const isWin = total > 0 && found >= total

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const t = suggestTheme.trim()
    if (!t) return
    saveSuggestion(t)
    setSuggestSubmitted(true)
    setSuggestTheme('')
  }

  return (
    <div className="space-y-4">
      {isWin && (
        <div className="min-h-[80px] flex flex-col gap-3">
          <div className="rounded-lg bg-yale-blue/80 border border-yale-blue-light text-white px-4 py-3 text-center font-display text-sm">
            YOU FOUND THEM ALL — Nice work!
          </div>
          {!suggestSubmitted ? (
            <form onSubmit={handleSuggestSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                type="text"
                value={suggestTheme}
                onChange={(e) => setSuggestTheme(e.target.value)}
                placeholder="Suggest a theme for the next update"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-yale-dark border border-yale-blue-light text-white placeholder-white/40 text-sm outline-none focus:ring-2 focus:ring-white/30"
                maxLength={80}
              />
              <button
                type="submit"
                disabled={!suggestTheme.trim()}
                className="px-4 py-2 rounded-lg bg-yale-blue text-white text-sm font-game hover:bg-yale-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit
              </button>
            </form>
          ) : (
            <p className="text-center text-white/90 text-sm py-2 min-h-[2.5rem]">
              Thank you! Our AI is working on this theme for the next update.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 min-h-[2rem]">
        <p className="text-yale-blue-light font-game text-sm">
          Theme: <span className="text-white">{game.theme}</span>
        </p>
        <button
          type="button"
          onClick={() => onReset?.()}
          className="text-sm text-white/80 hover:text-white hover:underline"
        >
          New game
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="relative">
          <p className="text-xs text-yale-blue-light mb-1 font-game min-h-[1rem]">LEFT</p>
          <ImageWithOverlay
            src={game.imageLeft!}
            differences={game.differences}
            foundIds={game.foundIds}
            onHit={handleHit}
            side="left"
            half={game.imageLeft === game.imageRight ? 'left' : undefined}
          />
        </div>
        <div className="relative">
          <p className="text-xs text-yale-blue-light mb-1 font-game min-h-[1rem]">RIGHT</p>
          <ImageWithOverlay
            src={game.imageRight!}
            differences={game.differences}
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
