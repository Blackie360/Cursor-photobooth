'use client'

import { useEffect, useRef } from 'react'
import type { ImageTransform } from '@/lib/types'
import styles from './FramePreview.module.css'

interface FramePreviewProps {
  transform: ImageTransform | null
}

export function FramePreview ({ transform }: FramePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match template
    canvas.width = 800
    canvas.height = 1000

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Load and draw frame template
    const frameImg = new Image()
    frameImg.src = '/frame-template.png'
    
    frameImg.onload = () => {
      // If we have a user image, composite it
      if (transform?.imageSrc) {
        const userImg = new Image()
        userImg.src = transform.imageSrc
        
        userImg.onload = () => {
          // Draw user's image in the photo area (100, 150, 600x600)
          const photoX = 100
          const photoY = 150
          const photoSize = 600

          // Calculate crop area
          const { croppedAreaPixels } = transform
          
          // First, draw black background
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, 800, 1000)
          
          // Draw the cropped and scaled user image in the photo area
          ctx.drawImage(
            userImg,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            photoX,
            photoY,
            photoSize,
            photoSize
          )

          // Draw frame overlay on top
          ctx.drawImage(frameImg, 0, 0, 800, 1000)
        }
      } else {
        // Just draw the frame (shows placeholder)
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, 800, 1000)
        ctx.drawImage(frameImg, 0, 0, 800, 1000)
      }
    }
  }, [transform])

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </div>
  )
}
