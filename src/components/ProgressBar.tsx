interface ProgressBarProps {
  found: number
  total: number
}

export function ProgressBar({ found, total }: ProgressBarProps) {
  const pct = total ? (found / total) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 md:w-32 bg-dark-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-neon-green rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-display text-xs text-neon-cyan">
        {found} / {total}
      </span>
    </div>
  )
}
