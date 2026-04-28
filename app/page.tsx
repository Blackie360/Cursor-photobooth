'use client'

import { useEffect, useRef, useState } from 'react'
import { CardPreview } from '@/components/card-preview'
import { CardEditor } from '@/components/card-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Copy,
  Download,
  Linkedin,
  Link2,
  MessageCircle,
  Send,
  Share2,
  Twitter,
} from 'lucide-react'

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

  const buildShareText = () => {
    const cardLabel = title.replace(/^[\s/#]+/, '').trim() || 'Card'
    const tagLine = hashtags.length > 0 ? `\n\n${hashtags.join(' ')}` : ''
    return `Check out my ${cardLabel} card!${tagLine}`
  }

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=640,height=640')
  }

  const handleShareToTwitter = () => {
    const url = buildCustomLink()
    const text = buildShareText()
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(url)}`
    openShareWindow(shareUrl)
    setShareMessage('Opened X (Twitter) share window.')
  }

  const handleShareToLinkedIn = () => {
    const url = buildCustomLink()
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    openShareWindow(shareUrl)
    setShareMessage('Opened LinkedIn share window.')
  }

  const handleShareToWhatsApp = () => {
    const url = buildCustomLink()
    const text = `${buildShareText()}\n${url}`
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    openShareWindow(shareUrl)
    setShareMessage('Opened WhatsApp share window.')
  }

  const handleShareToTelegram = () => {
    const url = buildCustomLink()
    const text = buildShareText()
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url,
    )}&text=${encodeURIComponent(text)}`
    openShareWindow(shareUrl)
    setShareMessage('Opened Telegram share window.')
  }

  const handleNativeShareLink = async () => {
    const url = buildCustomLink()

    if (!navigator.share) {
      setShareMessage('Native sharing is not supported here. Pick a network above.')
      return
    }

    try {
      const cardLabel = title.replace(/^[\s/#]+/, '').trim() || 'Card'
      await navigator.share({
        title: `${cardLabel} card`,
        text: buildShareText(),
        url,
      })
      setShareMessage('')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      setShareMessage('Native share failed. Pick a network above instead.')
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
                  className="h-10 w-full rounded-2xl border-white/10 bg-transparent px-3 text-white hover:bg-white/[0.05] hover:text-white"
                >
                  <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">Copy Locked Link</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-full rounded-2xl border-white/10 bg-transparent px-3 text-white hover:bg-white/[0.05] hover:text-white"
                    >
                      <Link2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">Share Locked Link</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl border-white/10 bg-[#0b0b0b] text-white"
                  >
                    <DropdownMenuLabel className="text-white/60">
                      Share to
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onSelect={handleShareToTwitter}
                      className="cursor-pointer focus:bg-white/[0.06] focus:text-white"
                    >
                      <Twitter className="h-4 w-4 shrink-0" aria-hidden="true" />
                      X (Twitter)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleShareToLinkedIn}
                      className="cursor-pointer focus:bg-white/[0.06] focus:text-white"
                    >
                      <Linkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleShareToWhatsApp}
                      className="cursor-pointer focus:bg-white/[0.06] focus:text-white"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleShareToTelegram}
                      className="cursor-pointer focus:bg-white/[0.06] focus:text-white"
                    >
                      <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                      Telegram
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onSelect={handleNativeShareLink}
                      className="cursor-pointer focus:bg-white/[0.06] focus:text-white"
                    >
                      <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      More…
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </section>
          ) : null}

          <div className="space-y-3">
            <Button
              onClick={handleDownload}
              disabled={!image}
              className="h-[52px] w-full rounded-full bg-white text-base font-semibold text-black hover:bg-white/90"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              disabled={!image || isSharing}
              variant="outline"
              className="h-[52px] w-full rounded-full border-white/15 bg-transparent text-base font-semibold text-white hover:bg-white/[0.06] hover:text-white"
            >
              <Share2 className="h-4 w-4 shrink-0" aria-hidden="true" />
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
