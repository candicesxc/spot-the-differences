import { useState, FormEvent } from 'react'
import type { Difficulty } from '../types'

const PLACEHOLDERS = [
  'Cyberpunk Tokyo',
  'Cat Picnic',
  'Underwater Castle',
  'Cozy Coffee Shop',
  'Space Station',
]

interface ThemeInputProps {
  difficulty: Difficulty
  onStart: (theme: string, difficulty: Difficulty) => void
  disabled?: boolean
}

export function ThemeInput({ difficulty, onStart, disabled }: ThemeInputProps) {
  const [theme, setTheme] = useState('')
  const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const t = theme.trim()
    if (t && !disabled) {
      onStart(t, difficulty)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
    >
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 min-w-[200px] max-w-md px-4 py-3 rounded-lg bg-dark-800 border-2 border-dark-600 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/30 outline-none transition-all placeholder:text-dark-400 font-game text-sm"
        maxLength={80}
      />
      <button
        type="submit"
        disabled={disabled || !theme.trim()}
        className="px-6 py-3 rounded-lg bg-neon-cyan text-dark-900 font-display text-xs tracking-wide hover:bg-neon-cyan/90 hover:shadow-neon disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {disabled ? 'GENERATING…' : 'PLAY'}
      </button>
    </form>
  )
}
