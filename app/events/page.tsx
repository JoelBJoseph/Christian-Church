"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

type Tab = "upcoming" | "past"

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-24">
      <p className="text-muted-foreground text-lg">No {label} events at this time.</p>
    </div>
  )
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming")

  return (
    <SiteLayout>
      <PageHero title="Events" imageSrc="/images/abstract-art.jpg" imageAlt="Abstract art" />

      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-12 text-center">
          <h2
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Events at Edify.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Events at Edify are designed to bring our community together, deepen your faith, and celebrate life in
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
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto px-6 pb-24"
        >
          <EmptyState label={activeTab} />
        </motion.section>
      </AnimatePresence>
    </SiteLayout>
  )
}
