'use client'

import { useEffect, useState } from 'react'

interface ImageCropperProps {
  image: string | null
  onCropChange: (cropData: { x: number; y: number; scale: number }) => void
  fitMode?: 'fit' | 'fill'
}

export function ImageCropper({ image, onCropChange }: ImageCropperProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setOffsetX(0)
    setOffsetY(0)
    setScale(1)
    onCropChange({ x: 0, y: 0, scale: 1 })
  }, [image, onCropChange])

  const handleOffsetXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newX = parseFloat(e.target.value)
    setOffsetX(newX)
    onCropChange({ x: newX, y: offsetY, scale })
  }

  const handleOffsetYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newY = parseFloat(e.target.value)
    setOffsetY(newY)
    onCropChange({ x: offsetX, y: newY, scale })
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value)
    setScale(newScale)
    onCropChange({ x: offsetX, y: offsetY, scale: newScale })
  }

  if (!image) return null

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-white">
          Position: Horizontal ({offsetX.toFixed(1)})
        </label>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={offsetX}
          onChange={handleOffsetXChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-white">
          Position: Vertical ({offsetY.toFixed(1)})
        </label>
        <input
          type="range"
          min="-200"
          max="200"
          step="5"
          value={offsetY}
          onChange={handleOffsetYChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-white">
          Zoom ({scale.toFixed(2)}x)
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.1"
          value={scale}
          onChange={handleScaleChange}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10"
        />
      </div>

      <button
        onClick={() => {
          setOffsetX(0)
          setOffsetY(0)
          setScale(1)
          onCropChange({ x: 0, y: 0, scale: 1 })
        }}
        className="w-full rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.1]"
      >
        Reset framing
      </button>
    </div>
  )
}
