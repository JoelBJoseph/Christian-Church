"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { MapPin, Calendar, Clock, ChevronDown } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"
import { getEvents } from "@/app/actions/admin"
import { formatEventDate, isPastEventDate } from "@/lib/dates"
import { SafeImage } from "@/components/safe-image"
import { Expandable, ExpandableContent, ExpandableTrigger } from "@/components/ui/expandable"

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

function StackedEvent({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.96])

  return (
    <div
      ref={ref}
      className="sticky pb-4"
      style={{
        top: `calc(6.25rem + ${Math.min(index, 5) * 14}px)`,
        zIndex: index + 1,
      }}
    >
      <motion.div style={{ scale, transformOrigin: "top center" }}>
        {children}
      </motion.div>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border bg-white px-6 py-20 text-center">
      <p className="text-lg text-muted-foreground">No {label} events at this time.</p>
    </div>
  )
}

function EventCard({
  event,
  expanded,
  onToggle,
}: {
  event: EventItem
  expanded: boolean
  onToggle: () => void
}) {
  const dateLabel = event.date
    ? formatEventDate(event.date, { month: "long", day: "numeric", year: "numeric" })
    : null

  return (
    <Expandable expanded={expanded} onToggle={onToggle} expandBehavior="push">
      {({ isExpanded }) => (
        <article className="grid overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-[0_22px_40px_-32px_rgba(32,59,96,0.45)] sm:grid-cols-[240px_minmax(0,1fr)]">
          {event.imageUrl && (
            <ExpandableTrigger
              className="relative aspect-[4/5] bg-surface-muted sm:row-span-2 sm:aspect-auto sm:min-h-[300px]"
              aria-label={`${isExpanded ? "Hide" : "Show"} details for ${event.title}`}
            >
              <div className="absolute inset-3 sm:inset-4">
                <div className="relative h-full w-full">
                  <SafeImage
                    src={event.imageUrl}
                    alt=""
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, 240px"
                  />
                </div>
              </div>
            </ExpandableTrigger>
          )}
          <ExpandableTrigger
            className="flex items-start justify-between gap-4 px-6 py-6 text-left sm:py-7 sm:pr-7"
            aria-label={`${isExpanded ? "Hide" : "Show"} details for ${event.title}`}
          >
            <span>
              {dateLabel && (
                <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  {dateLabel}
                </span>
              )}
              <h3
                className="mt-2 text-2xl leading-tight md:text-[1.75rem]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {event.title}
              </h3>
              {event.description && (
                <span className={`mt-3 block text-sm leading-relaxed text-muted-foreground ${isExpanded ? "" : "line-clamp-2"}`}>
                  {event.description}
                </span>
              )}
            </span>
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-primary">
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </span>
          </ExpandableTrigger>
          <ExpandableContent preset="slide-up">
            <div className="grid gap-3 px-6 pb-6 sm:pr-7">
              {dateLabel && (
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Calendar size={15} className="shrink-0 text-accent" />
                  <span>{formatEventDate(event.date!, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Clock size={15} className="shrink-0 text-accent" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-start gap-3 text-sm text-foreground/80">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-accent" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </ExpandableContent>
        </article>
      )}
    </Expandable>
  )
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming")
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const data = (await getEvents()) as EventItem[]
        setEvents(data)
        const hasUpcoming = data.some((event) => !event.date || !isPastEventDate(event.date))
        if (!hasUpcoming && data.length > 0) setActiveTab("past")
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setError("Events could not be loaded. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredEvents = events
    .filter((event) => {
      if (!event.date) return activeTab === "upcoming"
      const past = isPastEventDate(event.date)
      return activeTab === "past" ? past : !past
    })
    .sort((a, b) => {
      const left = a.date ?? ""
      const right = b.date ?? ""
      return activeTab === "past" ? right.localeCompare(left) : left.localeCompare(right)
    })

  function selectTab(tab: Tab) {
    setActiveTab(tab)
    setOpenId(null)
  }

  return (
    <SiteLayout>
      <PageHero title="Events" imageSrc="/images/abstract-art.jpg" imageAlt="Abstract art" />

      <ScrollReveal>
        <section className="mx-auto max-w-xl px-6 pb-8 text-center">
          <p className="leading-relaxed text-muted-foreground">
            Prayer, fasting, and worship at Christian Church. Open a gathering for the time and place.
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mb-12 flex justify-center gap-8">
          {(["upcoming", "past"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`border-b-2 pb-2 text-xs font-medium uppercase tracking-widest transition-colors duration-300 ${
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-3xl px-6 pb-24"
        >
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="text-lg text-muted-foreground">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState label={activeTab} />
          ) : (
            <div>
              {filteredEvents.map((event, index) => (
                <StackedEvent key={event.id} index={index}>
                  <EventCard
                    event={event}
                    expanded={openId === event.id}
                    onToggle={() => setOpenId((current) => (current === event.id ? null : event.id))}
                  />
                </StackedEvent>
              ))}
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </SiteLayout>
  )
}
