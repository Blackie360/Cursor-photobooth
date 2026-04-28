'use client'

import { ChangeEvent } from 'react'

interface CardEditorProps {
  setImage: (image: string | null) => void
  hasImage: boolean
}

export function CardEditor({
  setImage,
  hasImage,
}: CardEditorProps) {
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="relative">
          <input
            id="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="photo"
            className="block w-full cursor-pointer rounded-[24px] border border-dashed border-white/20 bg-white/[0.03] px-8 py-12 text-center transition-colors hover:border-white/40 hover:bg-white/[0.05]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <span className="text-2xl">+</span>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {hasImage ? 'Replace photo' : 'Upload photo'}
                </p>
                <p className="text-sm text-white/55">PNG, JPG or WEBP</p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
