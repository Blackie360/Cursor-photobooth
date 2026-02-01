'use client'

import { useCallback } from 'react'
import type { ImageTransform } from '@/lib/types'
import styles from './ImageEditor.module.css'

interface ImageEditorProps {
  onImageChange: (transform: ImageTransform | null) => void
}

export function ImageEditor({ onImageChange }: ImageEditorProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        // Create an image to get dimensions
        const img = new Image()
        img.onload = () => {
          onImageChange({
            imageSrc: dataUrl,
            crop: { x: 0, y: 0 },
            zoom: 1,
            croppedAreaPixels: {
              x: 0,
              y: 0,
              width: img.width,
              height: img.height,
            },
          })
        }
        img.src = dataUrl
      }
      reader.readAsDataURL(file)
    },
    [onImageChange]
  )

  const handleRemove = useCallback(() => {
    onImageChange(null)
    // Reset the file input
    const input = document.getElementById('image-upload') as HTMLInputElement
    if (input) input.value = ''
  }, [onImageChange])

  return (
    <div className={styles.uploadArea}>
      <label htmlFor="image-upload" className={styles.uploadLabel}>
        <svg
          className={styles.uploadIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className={styles.uploadText}>Click to Upload Photo</span>
        <span className={styles.uploadHint}>PNG, JPG or JPEG</span>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileChange}
        className={styles.uploadInput}
      />
      <button
        onClick={handleRemove}
        className={styles.removeButton}
        type="button"
      >
        Remove Image
      </button>
    </div>
  )
}
