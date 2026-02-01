'use client'

import { useCallback } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface PositionControlsProps {
  zoom: number
  onZoomChange: (zoom: number) => void
  onReset: () => void
  disabled?: boolean
}

export function PositionControls ({
  zoom,
  onZoomChange,
  onReset,
  disabled = false
}: PositionControlsProps) {
  const handleZoomIn = useCallback(() => {
    onZoomChange(Math.min(zoom + 0.1, 3))
  }, [zoom, onZoomChange])

  const handleZoomOut = useCallback(() => {
    onZoomChange(Math.max(zoom - 0.1, 0.5))
  }, [zoom, onZoomChange])

  const handleSliderChange = useCallback((values: number[]) => {
    onZoomChange(values[0])
  }, [onZoomChange])

  return (
    <div className="space-y-6 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-200">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={disabled || zoom <= 0.5}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={disabled || zoom >= 3}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Slider
          value={[zoom]}
          onValueChange={handleSliderChange}
          min={0.5}
          max={3}
          step={0.1}
          disabled={disabled}
          className="w-full"
        />
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <Button
          onClick={onReset}
          disabled={disabled}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Position
        </Button>
      </div>
    </div>
  )
}
