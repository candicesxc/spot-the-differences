import type { Difficulty } from '../types'

const OPTIONS: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'EASY', desc: 'Big changes' },
  { value: 'medium', label: 'MEDIUM', desc: 'Medium spots' },
  { value: 'hard', label: 'HARD', desc: 'Tiny details' },
]

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (d: Difficulty) => void
  disabled?: boolean
}

export function DifficultySelector({ value, onChange, disabled }: DifficultySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {OPTIONS.map(({ value: v, label, desc }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-lg font-display text-xs transition-all
            ${value === v
              ? 'bg-neon-pink text-white shadow-neon-pink'
              : 'bg-dark-700 text-dark-400 hover:bg-dark-600 hover:text-white border border-dark-600'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span className="block">{label}</span>
          <span className="text-[10px] font-sans font-normal opacity-80">{desc}</span>
        </button>
      ))}
    </div>
  )
}
