"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Calendar, ImageIcon, Film, BookOpen, X } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"

type Tab = "prayers" | "events" | "photos" | "videos"

interface PrayerRequest {
  id: number
  name: string
  email: string
  prayer: string
  isPrivate: boolean
  date: string
}

interface EventItem {
  id: number
  title: string
  date: string
  location: string
}

interface MediaItem {
  id: number
  title: string
  url: string
  date: string
}

const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "prayers", label: "Prayers", icon: BookOpen },
  { id: "events", label: "Events", icon: Calendar },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Film },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prayers")
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [photos, setPhotos] = useState<MediaItem[]>([])
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formLocation, setFormLocation] = useState("")
  const [formUrl, setFormUrl] = useState("")

  const handleAdd = () => {
    if (!formTitle.trim()) return

    if (activeTab === "events") {
      setEvents([...events, { id: Date.now(), title: formTitle, date: formDate, location: formLocation }])
    } else if (activeTab === "photos") {
      setPhotos([...photos, { id: Date.now(), title: formTitle, url: formUrl, date: formDate }])
    } else if (activeTab === "videos") {
      setVideos([...videos, { id: Date.now(), title: formTitle, url: formUrl, date: formDate }])
    }

    setFormTitle("")
    setFormDate("")
    setFormLocation("")
    setFormUrl("")
    setShowAddModal(false)
  }

  const handleDelete = (id: number) => {
    if (activeTab === "events") setEvents(events.filter((e) => e.id !== id))
    else if (activeTab === "photos") setPhotos(photos.filter((p) => p.id !== id))
    else if (activeTab === "videos") setVideos(videos.filter((v) => v.id !== id))
    else if (activeTab === "prayers") setPrayers(prayers.filter((p) => p.id !== id))
  }

  const canAdd = activeTab === "events" || activeTab === "photos" || activeTab === "videos"

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 pt-4 pb-8">
        <ScrollReveal>
          <h1
            className="text-4xl md:text-5xl mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your church content and view prayer requests.
          </p>
        </ScrollReveal>
      </section>

      {/* Tabs */}
      <section className="max-w-5xl mx-auto px-6 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs tracking-widest font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        {canAdd && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl text-xs tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> ADD {activeTab.slice(0, -1).toUpperCase()}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Prayers */}
          {activeTab === "prayers" && (
            <motion.div
              key="prayers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {prayers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="text-sm">No prayer requests yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {prayers.map((p) => (
                    <div key={p.id} className="bg-secondary rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{p.name}</h3>
                          {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{p.date}</span>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Delete prayer request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.prayer}</p>
                      <span
                        className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
                          p.isPrivate ? "bg-accent/10 text-accent" : "bg-border text-muted-foreground"
                        }`}
                      >
                        {p.isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Events */}
          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {events.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="text-sm">{"No events added yet. Click \"Add Event\" to get started."}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {events.map((e) => (
                    <div key={e.id} className="bg-secondary rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{e.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {e.date} {e.location && `\u2022 ${e.location}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Photos */}
          {activeTab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {photos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ImageIcon size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="text-sm">{"No photos added yet. Click \"Add Photo\" to get started."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {photos.map((p) => (
                    <div key={p.id} className="bg-secondary rounded-2xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium">{p.title}</h3>
                          <p className="text-xs text-muted-foreground">{p.date}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {p.url && <p className="text-xs text-accent break-all">{p.url}</p>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Videos */}
          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {videos.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Film size={40} className="mx-auto mb-4 opacity-40" />
                  <p className="text-sm">{"No videos added yet. Click \"Add Video\" to get started."}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {videos.map((v) => (
                    <div key={v.id} className="bg-secondary rounded-2xl p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{v.title}</h3>
                        <p className="text-xs text-muted-foreground">{v.date}</p>
                        {v.url && <p className="text-xs text-accent break-all mt-1">{v.url}</p>}
                      </div>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete video"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="bg-background rounded-2xl p-8 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Add {activeTab.slice(0, -1)}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="add-title" className="block text-xs tracking-widest font-medium mb-2">
                    TITLE *
                  </label>
                  <input
                    id="add-title"
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label htmlFor="add-date" className="block text-xs tracking-widest font-medium mb-2">
                    DATE
                  </label>
                  <input
                    id="add-date"
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="e.g. March 20, 2026"
                  />
                </div>

                {activeTab === "events" && (
                  <div>
                    <label htmlFor="add-location" className="block text-xs tracking-widest font-medium mb-2">
                      LOCATION
                    </label>
                    <input
                      id="add-location"
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Enter location"
                    />
                  </div>
                )}

                {(activeTab === "photos" || activeTab === "videos") && (
                  <div>
                    <label htmlFor="add-url" className="block text-xs tracking-widest font-medium mb-2">
                      URL
                    </label>
                    <input
                      id="add-url"
                      type="text"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                      placeholder="Enter URL"
                    />
                  </div>
                )}

                <button
                  onClick={handleAdd}
                  className="w-full bg-foreground text-background py-3 rounded-xl text-xs tracking-widest font-medium hover:opacity-90 transition-opacity mt-2"
                >
                  ADD {activeTab.slice(0, -1).toUpperCase()}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}
