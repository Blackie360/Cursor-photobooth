'use client'

import { useEffect, useRef, useState } from 'react'
import { CardPreview } from '@/components/card-preview'
import { CardEditor } from '@/components/card-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Download, Link2, Share2 } from 'lucide-react'

const DEFAULT_TITLE = '/Nairobi Meetup'
const DEFAULT_HASHTAGS = [
  '#CursorAINairobi',
  '#DevCommunity',
  '#Techmeetup',
  '#buildinpublic',
  '#aicoding',
  '#AI-assisted',
  '#AgentsDevelopment',
]
const DEFAULT_HASHTAGS_TEXT = DEFAULT_HASHTAGS.join('\n')

function parseHashtags(input: string) {
  return input
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => (value.startsWith('#') ? value : `#${value}`))
}

function buildFileName(title: string) {
  const slug = title
    .replace(/^[\s/#]+/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${slug || 'card'}.png`
}

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [shareMessage, setShareMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [isLockedView, setIsLockedView] = useState(false)
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [hashtagsText, setHashtagsText] = useState(DEFAULT_HASHTAGS_TEXT)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hashtags = parseHashtags(hashtagsText)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setIsLockedView(params.get('locked') === '1')

    if (params.has('title')) {
      setTitle(params.get('title') ?? '')
    }

    if (params.has('tags')) {
      const incomingTags = (params.get('tags') ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join('\n')

      setHashtagsText(incomingTags)
    }

    setHasMounted(true)
  }, [])

  const handleImageChange = (nextImage: string | null) => {
    setImage(nextImage)
    setShareMessage('')
  }

  const buildCustomLink = () => {
    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('locked', '1')

    if (title !== DEFAULT_TITLE) {
      url.searchParams.set('title', title)
    }

    const normalizedTags = hashtags.join(',')
    const defaultTags = DEFAULT_HASHTAGS.join(',')
    if (normalizedTags !== defaultTags) {
      url.searchParams.set('tags', normalizedTags)
    }

    return url.toString()
  }

  const makeCardFile = async () => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    if (!blob) return null

    return new File([blob], buildFileName(title), { type: 'image/png' })
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      setShareMessage('')
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = buildFileName(title)
      link.click()
    }
  }

  const handleShare = async () => {
    if (!image || isSharing) return

    const file = await makeCardFile()
    if (!file) return

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      setShareMessage('Share is not supported here. Download the card and post it.')
      return
    }

    try {
      setIsSharing(true)
      setShareMessage('')
      const cardLabel = title.replace(/^[\s/#]+/, '').trim() || 'Card'
      await navigator.share({
        files: [file],
        title: `${cardLabel} card`,
        text: `My ${cardLabel} card`,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      setShareMessage('Share failed. Download the card and post it.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildCustomLink())
      setShareMessage('Locked link copied.')
    } catch {
      setShareMessage('Copy failed. Copy the URL from the address bar instead.')
    }
  }

  const handleShareLink = async () => {
    const url = buildCustomLink()

    if (!navigator.share) {
      setShareMessage('Link sharing is not supported here. Copy the link instead.')
      return
    }

    try {
      const cardLabel = title.replace(/^[\s/#]+/, '').trim() || 'Card'
      await navigator.share({
        title: `${cardLabel} card`,
        url,
      })
      setShareMessage('')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      setShareMessage('Link sharing failed. Copy the locked link instead.')
    }
  }

  const handleReset = () => {
    setImage(null)
    setShareMessage('')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(84,84,84,0.12),transparent_34%),#050505] text-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-10">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur sm:p-6">
          <CardPreview image={image} title={title} hashtags={hashtags} canvasRef={canvasRef} />
        </section>

        <section className="space-y-5 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="space-y-2">
            <p className="text-sm text-white/60">Upload a photo, then download or share it.</p>
          </div>

          <CardEditor setImage={handleImageChange} hasImage={Boolean(image)} />

          {hasMounted && !isLockedView ? (
            <section className="space-y-4 border-t border-white/10 pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-medium text-white/88">Card Settings</h2>
                  <p className="text-sm text-white/50">Edit the title and hashtags, then share the locked link.</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
                  Admin
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-white/70" htmlFor="card-title">
                  Title
                </label>
                <Input
                  id="card-title"
                  name="card_title"
                  autoComplete="off"
                  spellCheck={false}
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setShareMessage('')
                  }}
                  className="h-10 rounded-2xl border-white/10 bg-white/[0.02] text-white shadow-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-white/70" htmlFor="card-tags">
                  Hashtags
                </label>
                <Textarea
                  id="card-tags"
                  name="card_hashtags"
                  autoComplete="off"
                  spellCheck={false}
                  value={hashtagsText}
                  onChange={(event) => {
                    setHashtagsText(event.target.value)
                    setShareMessage('')
                  }}
                  className="min-h-24 rounded-2xl border-white/10 bg-white/[0.02] text-white shadow-none"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="h-10 rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/[0.05] hover:text-white"
                >
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  Copy Locked Link
                </Button>
                <Button
                  onClick={handleShareLink}
                  variant="outline"
                  className="h-10 rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/[0.05] hover:text-white"
                >
                  <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Share Locked Link
                </Button>
              </div>
            </section>
          ) : null}

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              disabled={!image}
              className="h-[52px] w-full rounded-full bg-white text-base font-semibold text-black hover:bg-white/90"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              disabled={!image || isSharing}
              variant="outline"
              className="h-[52px] w-full rounded-full border-white/15 bg-transparent text-base font-semibold text-white hover:bg-white/[0.06] hover:text-white"
            >
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {isSharing ? 'Sharing…' : 'Share image'}
            </Button>
            {image ? (
              <Button
                onClick={handleReset}
                variant="ghost"
                className="h-11 w-full rounded-full text-white/70 hover:bg-white/[0.05] hover:text-white"
              >
                Clear photo
              </Button>
            ) : null}
          </div>

          {shareMessage ? (
            <p aria-live="polite" className="text-sm text-white/55">
              {shareMessage}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
