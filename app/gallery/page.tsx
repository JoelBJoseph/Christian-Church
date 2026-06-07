"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Play, Maximize2, Calendar, Tag } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"
import { getPhotos, getVideos } from "@/app/actions/admin"

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [photosData, videosData] = await Promise.all([
          getPhotos(),
          getVideos()
        ])
        setPhotos(photosData as MediaItem[])
        setVideos(videosData as MediaItem[])
      } catch (error) {
        console.error("Failed to fetch gallery data:", error)
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
            ) : photos.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">No photos yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary border border-transparent hover:border-border transition-all duration-500">
                    <Image 
                      src={photo.url} 
                      alt={photo.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
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
                            <span>{new Date(photo.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        )}
                        <Maximize2 size={16} className="text-white/50 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
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
            className="max-w-4xl mx-auto px-6 pb-24"
          >
            {loading ? (
              <div className="text-center py-24">
                <div className="inline-block w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-lg">No videos yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {videos.map((video) => (
                  <div key={video.id} className="group space-y-6">
                    <div className="aspect-video rounded-[2.5rem] overflow-hidden bg-secondary relative border border-transparent hover:border-border transition-all duration-500 shadow-sm">
                      {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
                        <iframe 
                          src={video.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                          className="w-full h-full border-0"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-secondary/50">
                          <Play size={40} className="text-muted-foreground/30 mb-4" />
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
                            Watch Video: {video.title}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-2">
                        {video.date && (
                          <div className="flex items-center gap-2 text-muted-foreground text-[10px] tracking-widest font-bold uppercase">
                            <Calendar size={12} className="text-foreground/40" />
                            <span>{new Date(video.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl md:text-3xl mb-3 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>{video.title}</h3>
                      {video.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}
