"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

export default function PrayerPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [prayer, setPrayer] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !prayer.trim()) return
    setSubmitted(true)
    setName("")
    setEmail("")
    setPrayer("")
  }

  return (
    <SiteLayout>
      <PageHero title="Prayer" imageSrc="/images/prayer-hero.jpg" imageAlt="Hands in prayer" />

      {/* Intro */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Share your prayer request.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe in the power of prayer. Share your prayer request below and our pastoral team will be praying
            for you. All submissions are kept private and confidential.
          </p>
        </section>
      </ScrollReveal>

      {/* Form */}
      <ScrollReveal>
        <section className="max-w-xl mx-auto px-6 pb-24">
          {submitted ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle size={48} className="mx-auto mb-4 text-accent" />
              <h3
                className="text-2xl mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Thank you for sharing.
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Our team will be praying for you. God bless you.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs tracking-widest font-medium border border-border px-6 py-3 rounded-full hover:bg-secondary transition-colors"
              >
                SUBMIT ANOTHER REQUEST
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="prayer-name" className="block text-xs tracking-widest font-medium mb-2">
                  YOUR NAME *
                </label>
                <input
                  id="prayer-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="prayer-email" className="block text-xs tracking-widest font-medium mb-2">
                  EMAIL (OPTIONAL)
                </label>
                <input
                  id="prayer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="prayer-request" className="block text-xs tracking-widest font-medium mb-2">
                  YOUR PRAYER REQUEST *
                </label>
                <textarea
                  id="prayer-request"
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  required
                  maxLength={2000}
                  rows={6}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all resize-none"
                  placeholder="Share what's on your heart..."
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{prayer.length}/2000</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`w-10 h-6 rounded-full transition-colors duration-300 relative ${
                    isPrivate ? "bg-accent" : "bg-border"
                  }`}
                  role="switch"
                  aria-checked={isPrivate}
                  aria-label="Keep my prayer private"
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 ${
                      isPrivate ? "left-5" : "left-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">Keep my prayer private</span>
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-4 rounded-xl text-xs tracking-widest font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                SUBMIT PRAYER REQUEST <Send size={14} />
              </button>
            </form>
          )}
        </section>
      </ScrollReveal>

      {/* Encouragement */}
      <section className="bg-secondary">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <p className="text-accent italic text-lg mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {'"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."'}
            </p>
            <p className="text-xs tracking-widest text-muted-foreground">PHILIPPIANS 4:6</p>
          </div>
        </ScrollReveal>
      </section>
    </SiteLayout>
  )
}
