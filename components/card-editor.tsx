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
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-describedby="photo-help"
            onChange={handleImageUpload}
            className="peer sr-only"
          />
          <label
            htmlFor="photo"
            className="group block touch-manipulation cursor-pointer rounded-[28px] border border-dashed border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] px-8 py-12 text-center transition-[background-color,border-color,box-shadow,transform] hover:border-[color:var(--brand-peach)] hover:bg-accent peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/70 text-[var(--brand-sun)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors group-hover:border-[color:var(--brand-peach)] group-hover:text-[var(--brand-peach)]">
                <span className="text-2xl">+</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {hasImage ? 'Replace Photo' : 'Upload Photo'}
                </p>
                <p id="photo-help" className="text-sm text-muted-foreground">
                  PNG, JPG, or WEBP
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
