export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Difference {
  id: string
  /** Center x as fraction of image width (0–1) */
  x: number
  /** Center y as fraction of image height (0–1) */
  y: number
  /** Radius as fraction of smaller image dimension (0–1), for hit detection */
  radius: number
}

/** Raw difference from levels.json (no id) */
export interface DifferenceInput {
  x: number
  y: number
  radius: number
}

export interface Level {
  id: string
  theme: string
  imageUrl: string
  differences: DifferenceInput[]
}

export interface GameState {
  levelId: string | null
  theme: string
  difficulty: Difficulty
  imageLeft: string | null
  imageRight: string | null
  differences: Difference[]
  foundIds: Set<string>
  isLoading: boolean
  error: string | null
}
