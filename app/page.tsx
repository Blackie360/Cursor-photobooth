'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FramePreview } from '@/components/frame-preview/FramePreview'
import { PositionControls } from '@/components/position-controls/PositionControls'
import type { ImageTransform } from '@/lib/types'
import { downloadImage } from '@/lib/utils'
import { Download, Upload } from 'lucide-react'

export default function Home () {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const handleRemove = useCallback(() => {
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    const input = document.getElementById('image-upload') as HTMLInputElement
    if (input) input.value = ''
  }, [])

  const handleExport = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return

    setIsExporting(true)
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageData: imageSrc,
          crop,
          zoom,
          croppedAreaPixels
        })
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      await downloadImage(blob, 'cursor-photo-booth.png')
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export image. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [imageSrc, crop, zoom, croppedAreaPixels])

  const transform: ImageTransform | null = imageSrc && croppedAreaPixels
    ? {
        imageSrc,
        crop,
        zoom,
        croppedAreaPixels
      }
    : null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Cursor AI Photo Booth</h1>
          <p className="text-zinc-400 text-lg">
            Upload your photo and create a branded frame
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left side - Upload and Controls */}
          <div className="space-y-6">
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <h2 className="text-2xl font-semibold mb-4">Upload Photo</h2>
              
              {!imageSrc ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-zinc-600 transition-colors"
                >
                  <Upload className="h-12 w-12 text-zinc-500 mb-4" />
                  <span className="text-lg text-zinc-400 mb-2">Click to Upload Photo</span>
                  <span className="text-sm text-zinc-500">PNG, JPG or JPEG</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-64 bg-zinc-900 rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <Button
                    onClick={handleRemove}
                    variant="outline"
                    className="w-full"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </Card>

            {imageSrc && (
              <PositionControls
                zoom={zoom}
                onZoomChange={setZoom}
                onReset={handleReset}
              />
            )}

            {imageSrc && croppedAreaPixels && (
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full h-14 text-lg bg-white text-black hover:bg-zinc-200"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                {isExporting ? 'Exporting...' : 'Download Photo'}
              </Button>
            )}
          </div>

          {/* Right side - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="p-6 bg-zinc-950 border-zinc-800">
              <h2 className="text-2xl font-semibold mb-4">Preview</h2>
              <div className="aspect-[4/5] bg-zinc-900 rounded-lg flex items-center justify-center">
                <FramePreview transform={transform} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
