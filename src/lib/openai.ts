import type { Difference, Difficulty } from '../types'

function difficultyPrompt(d: Difficulty): string {
  switch (d) {
    case 'easy':
      return 'Include 5 obvious, large differences (e.g. missing building, extra tree, different sky).'
    case 'medium':
      return 'Include 5 medium-sized differences (e.g. changed sign, different hat, extra window).'
    case 'hard':
      return 'Include 5 subtle, small differences (e.g. changed eye color, small button, tiny crack).'
    default:
      return 'Include 5 clear differences.'
  }
}

/** Build prompt for one wide 1792x1024 image with left and right scenes that differ in 5 ways. */
function wideImagePrompt(theme: string, difficulty: Difficulty): string {
  const diff = difficultyPrompt(difficulty)
  return `Create a single image that acts as a "spot the difference" puzzle.

Left half: A detailed scene — "${theme}".
Right half: The SAME scene but with exactly 5 changes. ${diff}

Style: crisp, illustrated, well-lit, no text. Render as one horizontal image: left scene | right scene, side by side. Same composition and framing on both sides, only the 5 specific differences.`
}

/** Returns one image URL (wide left|right puzzle), and placeholder differences. DALL-E can't return coords, so we use fixed spots; enable "Cheat mode" to test. */
export async function generateImages(
  theme: string,
  difficulty: Difficulty,
  apiKey: string
): Promise<{ imageLeft: string; imageRight: string; differences: Difference[] }> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: wideImagePrompt(theme, difficulty),
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'url',
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message || response.statusText)
  }

  const data = (await response.json()) as { data?: { url?: string }[] }
  const url = data.data?.[0]?.url
  if (!url) throw new Error('No image URL in response')

  /* Use same URL for both sides; GameBoard displays left/right half via clip-path to avoid CORS. */
  const differences: Difference[] = [
    { id: 'd1', x: 0.25, y: 0.25, radius: 0.1 },
    { id: 'd2', x: 0.5, y: 0.35, radius: 0.1 },
    { id: 'd3', x: 0.75, y: 0.3, radius: 0.1 },
    { id: 'd4', x: 0.35, y: 0.65, radius: 0.1 },
    { id: 'd5', x: 0.65, y: 0.7, radius: 0.1 },
  ]

  return { imageLeft: url, imageRight: url, differences }
}
