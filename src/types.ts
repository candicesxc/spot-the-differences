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

export interface GameState {
  theme: string
  difficulty: Difficulty
  imageLeft: string | null
  imageRight: string | null
  differences: Difference[]
  foundIds: Set<string>
  /** Cheat mode: use manually defined coordinates */
  cheatMode: boolean
  isLoading: boolean
  error: string | null
}
