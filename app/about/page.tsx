"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

const timeline = [
  {
    year: "Sunday Service",
    text: "Every Sunday at 9:00 AM – 11:45 AM",
  },
  {
    year: "Fasting Prayer",
    text: "Every Friday at 9:00 AM – 12:00 PM",
  },
  {
    year: "Sunday School",
    text: "Every Sunday at 12:00 PM – 12:30 PM",
  },
  {
    year: "Youth Meeting",
    text: "2nd Sunday of every month at 12:00 PM – 12:30 PM",
  },
  {
    year: "Women's Meeting",
    text: "4th Sunday of every month at 12:00 PM – 12:30 PM",
  },
]

export default function AboutPage() {
  return (
      <SiteLayout>
        <PageHero title="About Us" imageSrc="/images/lighthouse.jpg" imageAlt="Church Worship" />

        {/* Intro */}
        <ScrollReveal>
          <section className="max-w-2xl mx-auto px-6 py-24">
            <h2
                className="text-4xl md:text-5xl mb-8"
                style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Vision
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To touch the world with the Glory and Power of the Gospel of Jesus Christ.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are a non-denominational ministry built on the Word of God, called to be signs and
              wonders for the Lord.
              <br/><br/>
              Empowered by the Holy Spirit (Acts 1:8), we boldly witness to the death and resurrection of
              Jesus Christ so that all who believe may receive wholeness in spirit, soul, and body.
              <br/><br/>
              We disciple believers to stand victorious on God’s Word and equip others to live complete and
              triumphant lives in Christ.
            </p>
          </section>
        </ScrollReveal>

        {/* Our Pastor */}
        <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <h2
                className="text-3xl mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Pastor
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Our church is led by a devoted servant of God with a heart for prayer,
              discipleship, and the teaching of the Word. With a passion for seeing
              lives transformed through the power of Jesus Christ, our pastor is
              committed to guiding the church in truth, faith, and spiritual growth.
              <br /><br />
              Through faithful leadership and reliance on the Holy Spirit, our pastor
              equips believers to stand firm on the Word of God and walk in victory
              every day.
            </p>
            <Link
                href="#"
                className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
            >
              LEARN MORE <ArrowRight size={12} />
            </Link>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.15}>
            <div className="rounded-2xl overflow-hidden relative aspect-square">
              <Image
                  src="/images/pastors.jpg"
                  alt="Senior Pastor"
                  fill
                  className="object-cover"
              />
            </div>
          </ScrollReveal>
        </section>

        {/* What We Do */}
        <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left" className="order-2 md:order-1">
            <div className="rounded-2xl overflow-hidden relative aspect-square">
              <Image
                  src="/images/youth-camp.jpg"
                  alt="Church Worship Gathering"
                  fill
                  className="object-cover"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.15} className="order-1 md:order-2">
            <p className="text-xs tracking-widest text-muted-foreground mb-2">WHAT WE DO</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We act on Acts 1:8 — empowered by the Holy Spirit to be witnesses of
              Jesus Christ to the ends of the earth.
              <br /><br />
              By the love of God the Father, the grace of His Son Jesus, and the power
              of the Holy Spirit, we proclaim salvation, healing, restoration, and
              wholeness through the finished work of Calvary.
            </p>
            <Link
                href="#"
                className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
            >
              JOIN US <ArrowRight size={12} />
            </Link>
          </ScrollReveal>
        </section>

        {/* Our Belief & Who We Are */}
        <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
          <ScrollReveal>
            <h3
                className="text-2xl mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Belief
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              The Bible is the inspired and only infallible and authoritative written
              Word of God.
              <br /><br />
              We believe in one God, eternally existent in three Persons:
              <br />
              God the Father
              <br />
              God the Son
              <br />
              God the Holy Spirit
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3
                className="text-2xl mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
            >
              Who We Are
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are a non-denominational ministry built on the Word of God,
              committed to raising disciples who stand victorious in Christ.
              Our mission is to demonstrate God&#39;s power, love, and transforming
              grace to this generation and beyond.
            </p>
          </ScrollReveal>
        </section>

        {/* Vision Timeline Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
                src="/images/history-bg.jpg"
                alt=""
                fill
                className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-background">
            <ScrollReveal>
              <p className="text-xs tracking-widest text-center mb-2 text-accent">OUR FOUNDATION</p>
              <h2
                  className="text-3xl md:text-4xl text-center mb-16"
                  style={{ fontFamily: "var(--font-heading)" }}
              >
                Rooted in the Word. Empowered by the Spirit. Sent to the Nations.
              </h2>
            </ScrollReveal>

            <div className="flex flex-col gap-12">
              {timeline.map((item, i) => (
                  <ScrollReveal key={item.year} delay={i * 0.08}>
                    <div className="text-center">
                      <p className="text-xs tracking-widest text-accent mb-2">{item.year}</p>
                      <p className="text-sm opacity-80 max-w-md mx-auto">{item.text}</p>
                    </div>
                  </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </SiteLayout>
  )
}