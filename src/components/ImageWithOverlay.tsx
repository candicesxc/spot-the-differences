import { useCallback, useRef, useState, useLayoutEffect } from 'react'
import type { Difference } from '../types'

interface ImageWithOverlayProps {
  src: string
  differences: Difference[]
  foundIds: Set<string>
  onHit: (id: string) => void
  side: 'left' | 'right'
  /** When true, show only the left or right half (for single wide image). */
  half?: 'left' | 'right'
}

export function ImageWithOverlay({
  src,
  differences,
  foundIds,
  onHit,
  side,
  half,
}: ImageWithOverlayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const imgRef = useRef<HTMLImageElement | null>(null)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    const img = new Image()
    img.src = src
    imgRef.current = img

    const onLoad = () => {
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const nw = img.naturalWidth
      const nh = img.naturalHeight
      const aspect = half ? (nw / 2) / nh : nw / nh
      const maxW = rect.width
      const maxH = Math.min(420, maxW / aspect)
      setSize({ w: maxW, h: maxH })
    }

    img.addEventListener('load', onLoad)
    if (img.complete) onLoad()
    return () => img.removeEventListener('load', onLoad)
  }, [src, half])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.w <= 0 || size.h <= 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, size.w, size.h)

    const minDim = Math.min(size.w, size.h)
    differences.forEach((d) => {
      if (!foundIds.has(d.id)) return
      const cx = d.x * size.w
      const cy = d.y * size.h
      const r = d.radius * minDim
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.95)'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.stroke()
    })
  }, [size, differences, foundIds])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const rect = wrapper.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height

      for (const d of differences) {
        if (foundIds.has(d.id)) continue
        const dx = x - d.x
        const dy = y - d.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= d.radius) {
          onHit(d.id)
          return
        }
      }
    },
    [differences, foundIds, onHit]
  )

  const imgStyle = half
    ? { width: '200%', height: '100%', objectFit: 'cover' as const, ...(half === 'right' ? { marginLeft: '-100%' } : {}) }
    : { width: '100%', height: 'auto' }

  return (
    <div
      ref={wrapperRef}
      className="relative rounded-lg overflow-hidden border-2 border-dark-600 cursor-crosshair select-none bg-dark-800"
      style={{ maxHeight: 420 }}
      onClick={handleClick}
    >
      <div
        className="relative w-full overflow-hidden bg-dark-700"
        style={{ height: size.h || 280 }}
      >
        <img
          src={src}
          alt={`Scene ${side}`}
          className="block object-cover object-left-top"
          style={{ ...imgStyle, maxHeight: 420 }}
          draggable={false}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ width: size.w, height: size.h, maxHeight: 420 }}
      />
    </div>
  )
}
