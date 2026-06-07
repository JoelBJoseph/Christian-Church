"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Calendar, Clock } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"
import { getEvents } from "@/app/actions/admin"

type Tab = "upcoming" | "past"

interface EventItem {
  id: number
  title: string
  description: string | null
  date: string | null
  time: string | null
  location: string | null
  imageUrl: string | null
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-24">
      <p className="text-muted-foreground text-lg">No {label} events at this time.</p>
    </div>
  )
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming")
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getEvents()
        setEvents(data as EventItem[])
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter events (assuming for now that any event with a date in the past is past)
  // Since date is a string, this is simplified. In a real app, we'd use Date objects.
  const filteredEvents = events.filter(event => {
    if (!event.date) return activeTab === "upcoming"
    
    try {
      const eventDate = new Date(event.date)
      if (isNaN(eventDate.getTime())) return activeTab === "upcoming"
      
      const isPast = eventDate < new Date()
      return activeTab === "past" ? isPast : !isPast
    } catch {
      return activeTab === "upcoming"
    }
  })

  return (
    <SiteLayout>
      <PageHero title="Events" imageSrc="/images/abstract-art.jpg" imageAlt="Abstract art" />

      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-12 text-center">
          <h2
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Events at Christian Church.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Events at our church are designed to bring our community together, deepen your faith, and celebrate life in
            Christ. Join us and be part of something truly meaningful.
          </p>
        </section>
      </ScrollReveal>

      {/* Tab switcher */}
      <ScrollReveal>
        <div className="flex justify-center gap-8 mb-12">
          {(["upcoming", "past"] as Tab[]).map((tab) => (
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
        <motion.section
          key={activeTab + (loading ? "-loading" : "-loaded")}
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
          ) : filteredEvents.length === 0 ? (
            <EmptyState label={activeTab} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="group bg-secondary rounded-[2.5rem] overflow-hidden flex flex-col h-full border border-transparent hover:border-border transition-all duration-500">
                  {event.imageUrl && (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      {event.date && (
                        <span className="bg-foreground text-background text-[10px] tracking-widest font-bold px-3 py-1 rounded-full uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="space-y-3 mt-auto pt-6 border-t border-border/50">
                      {event.date && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
                          <Calendar size={14} className="text-foreground/40" />
                          <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
                          <Clock size={14} className="text-foreground/40" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
                          <MapPin size={14} className="text-foreground/40" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </SiteLayout>
  )
}
