"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

type Tab = "photos" | "videos"

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photos")

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
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No photos yet.</p>
            </div>
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
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No videos yet.</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </SiteLayout>
  )
}
