"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Plus } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

const faqs = [
  {
    q: "The life of Jesus",
    a: "Jesus was born in Bethlehem, grew up in Nazareth, and began his public ministry around age 30. He taught about God's love, performed miracles, and gathered disciples who followed his teachings.",
  },
  {
    q: "The message of Jesus",
    a: "Jesus taught about love, forgiveness, and the Kingdom of God. His core message was that God loves all people and desires a personal relationship with each one of us.",
  },
  {
    q: "Jesus' death and resurrection",
    a: "Jesus was crucified on a Roman cross, died, and was buried. Three days later, He rose from the dead, conquering sin and death and offering eternal life to all who believe.",
  },
  {
    q: "Following Jesus",
    a: "Following Jesus means trusting Him with your life, learning His teachings, and living in a way that reflects His love to others around you.",
  },
  {
    q: "Where do I start?",
    a: "Start by reading the Gospel of John in the Bible, visiting a church community, and talking to someone about your questions and journey of faith.",
  },
]

const ctaCards = [
  {
    href: "/events",
    img: "/images/worship10.jpeg",
    title: "Upcoming Events",
    cta: "WHATS ON",
  },
  {
    href: "/watch",
    img: "/images/music-team.jpg",
    title: "Online Content",
    cta: "WATCH NOW",
  },
]

export default function JesusPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <SiteLayout>
      <PageHero title="Jesus" imageSrc="/images/prayer-light.jpg" imageAlt="Candlelight in a peaceful setting" />

      {/* Content */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-24">
          <h2
            className="text-4xl md:text-5xl mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {"We're all about Jesus."}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {"Jesus was more than a historical figure\u2014He is the Son of God, who came to earth to show us God's love and offer us eternal life through His death and resurrection."}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"The Gospel is the good news that God loves us and offers us a new life in Jesus. Jesus' life, death, and resurrection form the foundation of this Good News."}
          </p>
        </section>
      </ScrollReveal>

      {/* FAQ Accordion */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        {faqs.map((faq, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="border-t border-border">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full py-5 flex items-center justify-between text-left"
                aria-expanded={openIdx === i}
              >
                <span className="text-sm">{faq.q}</span>
                <motion.div animate={{ rotate: openIdx === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <Plus size={16} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pb-5 text-sm text-muted-foreground leading-relaxed overflow-hidden"
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
        <div className="border-t border-border" />
      </section>

      {/* CTA cards */}
      <ScrollReveal>
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <h2
            className="text-3xl text-center mb-12"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Join us and begin your journey.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ctaCards.map((card, i) => (
              <ScrollReveal key={card.href} delay={i * 0.15} direction={i === 0 ? "left" : "right"}>
                <Link href={card.href} className="group relative rounded-2xl overflow-hidden aspect-4/3 block">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-foreground/70 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-background">
                    <p className="text-lg font-medium">{card.title}</p>
                    <p className="text-xs tracking-widest mt-1 inline-flex items-center gap-1">
                      {card.cta} <ArrowRight size={10} />
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </SiteLayout>
  )
}
