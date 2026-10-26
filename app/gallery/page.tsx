"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Maximize2, Calendar, Tag, X, ChevronLeft, ChevronRight } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"
import { getPhotos, getVideos } from "@/app/actions/admin"
import { SafeImage } from "@/components/safe-image"
import { formatEventDate } from "@/lib/dates"
import { isHttpUrl } from "@/lib/text"
import { toYouTubeEmbedUrl } from "@/lib/youtube"

function isVideoFile(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return ""
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${remainder.toString().padStart(2, "0")}`
}

function groupVideos(videos: MediaItem[]) {
  const groups: { label: string; items: MediaItem[] }[] = []
  for (const video of videos) {
    const label = video.date
      ? formatEventDate(video.date, { month: "long", day: "numeric", year: "numeric" })
      : "Undated"
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(video)
    else groups.push({ label, items: [video] })
  }
  return groups
}

function GalleryVideos({ videos }: { videos: MediaItem[] }) {
  const playerRef = useRef<HTMLVideoElement>(null)
  const [activeId, setActiveId] = useState(videos[0]?.id)
  const [playing, setPlaying] = useState(false)
  const [portrait, setPortrait] = useState(true)
  const [durations, setDurations] = useState<Record<number, string>>({})
  const active = videos.find((video) => video.id === activeId) ?? videos[0]
  const embedUrl = active ? toYouTubeEmbedUrl(active.url) : null
  const groups = groupVideos(videos)

  useEffect(() => {
    if (!playing || embedUrl) return
    void playerRef.current?.play()
  }, [playing, active?.id, embedUrl])

  function choose(id: number) {
    setActiveId(id)
    setPlaying(false)
    setPortrait(true)
  }

  function rememberDuration(id: number, seconds: number) {
    const label = formatDuration(seconds)
    if (!label) return
    setDurations((current) => (current[id] === label ? current : { ...current, [id]: label }))
  }

  if (!active) return null

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-12">
      <div>
        <div className="overflow-hidden rounded-[1.75rem] bg-[#111111] shadow-[0_24px_50px_-28px_rgba(32,59,96,0.55)]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={active.title}
              className="aspect-video h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isVideoFile(active.url) ? (
            <div className={`relative mx-auto ${portrait ? "w-full max-w-[300px]" : "w-full"}`}>
              <video
                key={active.id}
                ref={playerRef}
                src={active.url}
                controls={playing}
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => {
                  const media = event.currentTarget
                  setPortrait(media.videoHeight > media.videoWidth)
                  rememberDuration(active.id, media.duration)
                }}
                onEnded={() => setPlaying(false)}
                className={`w-full bg-black object-contain ${portrait ? "aspect-[9/16]" : "aspect-video"}`}
              />
              {!playing && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/10 to-black/20"
                  aria-label={`Play ${active.title}`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary shadow-lg">
                    <Play size={26} className="ml-1 fill-current" />
                  </span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-secondary p-8 text-center">
              <Play size={40} className="mb-4 text-muted-foreground/30" />
              {isHttpUrl(active.url) ? (
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:underline">
                  Watch video: {active.title}
                </a>
              ) : (
                <p className="font-medium text-muted-foreground">{active.title}</p>
              )}
            </div>
          )}
        </div>
        <div className="px-1 pt-5">
          {active.date && (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              {formatEventDate(active.date, { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
          <h3 className="mt-2 text-3xl leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            {active.title}
          </h3>
          {active.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {videos.length} recordings
        </p>
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((video) => {
                  const selected = video.id === active.id
                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => choose(video.id)}
                      aria-current={selected ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${
                        selected ? "bg-primary text-primary-foreground" : "hover:bg-surface-muted"
                      }`}
                    >
                      <span className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-[#111111]">
                        {isVideoFile(video.url) ? (
                          <video
                            src={video.url}
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={(event) => rememberDuration(video.id, event.currentTarget.duration)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center">
                            <Play size={16} className="text-white" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{video.title}</span>
                        {video.description && (
                          <span className={`mt-1 block truncate text-xs ${selected ? "text-white/70" : "text-muted-foreground"}`}>
                            {video.description}
                          </span>
                        )}
                      </span>
                      {durations[video.id] && (
                        <span className={`shrink-0 text-[11px] tabular-nums ${selected ? "text-white/70" : "text-muted-foreground"}`}>
                          {durations[video.id]}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PhotoLightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: MediaItem[]
  index: number
  onClose: () => void
  onIndex: (index: number) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  const onIndexRef = useRef(onIndex)
  const photo = photos[index]
  const total = photos.length
  onCloseRef.current = onClose
  onIndexRef.current = onIndex

  useEffect(() => {
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current()
      if (event.key === "ArrowRight") onIndexRef.current((index + 1) % total)
      if (event.key === "ArrowLeft") onIndexRef.current((index - 1 + total) % total)
    }

    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
    }
  }, [index, total])

  if (!photo) return null

  function step(direction: number) {
    onIndex((index + direction + total) % total)
  }

  async function maximize() {
    const frame = frameRef.current
    if (!frame) return
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await frame.requestFullscreen()
    } catch {
      // The enlarged view stays open when the browser blocks fullscreen.
    }
  }

  return (
    <div
      ref={frameRef}
      className="fixed inset-0 z-[80] flex bg-[#111111] p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close photo"
      >
        <X size={20} />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          void maximize()
        }}
        className="absolute right-16 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Maximize photo"
      >
        <Maximize2 size={18} />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              step(-1)
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              step(1)
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
        <div className="relative min-h-0 w-full flex-1">
          <SafeImage src={photo.url} alt={photo.title} className="object-contain" sizes="100vw" priority />
        </div>
        <div className="w-full shrink-0 pt-4 text-center text-white">
          {photo.category && (
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{photo.category}</p>
          )}
          <p className="mt-1 text-lg" style={{ fontFamily: "var(--font-heading)" }}>{photo.title}</p>
          <p className="mt-1 text-xs text-white/60">
            {index + 1} of {total}
            {photo.date ? ` · ${formatEventDate(photo.date, { month: "long", year: "numeric" })}` : ""}
          </p>
        </div>
      </div>
    </div>
  )
}

type Tab = "photos" | "videos"

interface MediaItem {
  id: number
  title: string
  description: string | null
  url: string
  date: string | null
  category?: string | null
}

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos")
  const [photos, setPhotos] = useState<MediaItem[]>([])
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [photoIndex, setPhotoIndex] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [photosData, videosData] = await Promise.all([
          getPhotos(),
          getVideos()
        ])
        setPhotos(photosData as MediaItem[])
        setVideos(videosData as MediaItem[])
      } catch (error) {
        console.error("Failed to fetch gallery data:", error)
        setError("The gallery could not be loaded. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <SiteLayout>
      <PageHero title="Gallery" imageSrc="/images/gallery-hero.jpg" imageAlt="Gallery collection" />

      {/* Tab switcher */}
      <ScrollReveal>
        <div className="flex justify-center gap-8 mb-12">
          {(["photos", "videos"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs tracking-widest font-medium pb-2 border-b-2 transition-colors duration-300 uppercase ${
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <AnimatePresence mode="wait">
        {activeTab === "photos" && (
          <motion.section
            key="photos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-6 pb-24"
          >
            {loading ? (
              <div className="text-center py-24">
                <div className="inline-block w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">{error}</p>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">No photos yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setPhotoIndex(index)}
                    aria-label={`View ${photo.title}`}
                    className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary border border-transparent hover:border-border transition-all duration-500 text-left"
                  >
                    <SafeImage
                      src={photo.url}
                      alt=""
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      {photo.category && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag size={12} className="text-accent" />
                          <span className="text-[10px] tracking-widest font-bold uppercase text-accent">{photo.category}</span>
                        </div>
                      )}
                      <h3 className="text-white text-xl font-medium mb-2 leading-tight">{photo.title}</h3>
                      {photo.description && <p className="text-white/70 text-xs mb-4 line-clamp-2">{photo.description}</p>}
                      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/10">
                        {photo.date && (
                          <div className="flex items-center gap-2 text-white/50 text-[10px] tracking-wider uppercase">
                            <Calendar size={12} />
                            <span>{formatEventDate(photo.date, { month: "short", year: "numeric" })}</span>
                          </div>
                        )}
                        <Maximize2 size={16} className="text-white/50 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {activeTab === "videos" && (
          <motion.section
            key="videos"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-6 pb-24"
          >
            {loading ? (
              <div className="text-center py-24">
                <div className="inline-block w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">{error}</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">No videos yet.</p>
              </div>
            ) : (
              <GalleryVideos videos={videos} />
            )}
          </motion.section>
        )}
      </AnimatePresence>
      {photoIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={photoIndex}
          onClose={() => setPhotoIndex(null)}
          onIndex={setPhotoIndex}
        />
      )}
    </SiteLayout>
  )
}
