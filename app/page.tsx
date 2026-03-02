"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"

const cards = [
  {
    title: "Who Jesus is.",
    desc: "Discover who Jesus is and the impact He can have on your life.",
    link: "/jesus",
    cta: "LEARN MORE",
  },
  {
    title: "Church events.",
    desc: "Explore our events calendar for a wide variety of community activities.",
    link: "/events",
    cta: "EVENTS",
  },
  {
    title: "Prayer requests.",
    desc: "Share your prayer request with our pastoral team. We believe in the power of prayer.",
    link: "/prayer",
    cta: "PRAY",
  },
]

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden -mt-24">
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src="/images/hero-church.jpg"
            alt="Christian Church sanctuary"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center text-background"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1
              className="text-5xl md:text-7xl italic font-medium tracking-tight drop-shadow-lg"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="italic">Christian</span> Church
            </h1>
            <p className="mt-2 text-lg tracking-widest opacity-90">welcome home</p>
          </motion.div>
        </div>
      </section>

      {/* Welcome section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm aspect-3/4 rounded-2xl overflow-hidden">
              <Image
                src="/images/nature-welcome.jpg"
                alt="Peaceful nature scene"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.15}>
          <h2
            className="text-3xl md:text-4xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            A church where
            <br />
            all are welcome.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {"You're invited to a welcoming community where you can belong and find purpose. Whether you're exploring faith, seeking answers to life's big questions, or looking for a new community to grow and thrive, you're welcome at Christian Church."}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm tracking-widest font-medium hover:gap-3 transition-all"
          >
            LEARN ABOUT US <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </section>

      {/* Mission strip */}
      <ScrollReveal>
        <section className="bg-secondary py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <p className="text-sm text-muted-foreground">
              Christian CHURCH is a non-denominational ministry in Muttom, Thdoupuzha since 2000. We strive to LOVE,
              BUILD and REACH.
            </p>
            <div className="text-right">
              <p
                className="text-2xl md:text-3xl leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="font-semibold">Love</span> God.{" "}
                <span className="font-semibold">Faith</span> Build.{" "}
                <span className="font-semibold">Hope</span> Filled.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Vision section */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <div className="rounded-2xl overflow-hidden relative aspect-video">
            <Image
              src="/images/community.jpg"
              alt="Church community gathering"
              fill
              className="object-cover"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.15}>
          <h2 className="text-xs tracking-widest text-muted-foreground mb-4">
            IN THE ROOM, IN THE CITY + IN THE WORLD.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Our vision is to love people, build disciples and keep going online and in person to grow your faith and
            serve others.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm tracking-widest font-medium hover:gap-3 transition-all"
          >
            FIND OUT MORE <ArrowRight size={14} />
          </Link>
        </ScrollReveal>
      </section>

      {/* Three cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 0.1}>
            <div className="flex flex-col gap-3">
              <h3
                className="text-xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
              <Link
                href={card.link}
                className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
              >
                {card.cta} <ArrowRight size={12} />
              </Link>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* See what's on */}
      <ScrollReveal>
        <section className="bg-secondary py-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <h2
              className="text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {"See whats on."}
            </h2>
            <Link
              href="/events"
              className="w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-110 transition-transform duration-300"
              aria-label="View events"
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </SiteLayout>
  )
}
