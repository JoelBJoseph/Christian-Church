"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import PageHero from "@/components/page-hero"

const timeline = [
  {
    year: "1953",
    text: "Pastor Samuel Reed from Maplewood Community Church started a Sunday school in Brookside.",
  },
  {
    year: "1968",
    text: "After growing steadily, Brookside Community Church became an independent congregation.",
  },
  {
    year: "1997",
    text: "Maplewood Community Church became Horizon Baptist Church after acquiring the Grandview Hall and a parcel of land in Oakridge.",
  },
  {
    year: "2011",
    text: "Horizon launched its first campus, Horizon West (now Horizon Oakridge), marking the start of a multi-campus approach to reach more people with the message of hope and faith.",
  },
  {
    year: "2018",
    text: "Horizon expanded to the east and west. Horizon Lakeside launched at the Riverview Community Centre.",
  },
  {
    year: "2019",
    text: "Horizon Central opened its doors to bring hope and faith to the heart of Maplewood City.",
  },
  {
    year: "2025",
    text: "After years of online services, people from around the world became part of an official campus Horizon Online.",
  },
]

export default function AboutPage() {
  return (
    <SiteLayout>
      <PageHero title="About" imageSrc="/images/lighthouse.jpg" imageAlt="Lighthouse on a coastal cliff" />

      {/* Intro */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-24">
          <h2
            className="text-4xl md:text-5xl mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Learn about life at Edify.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Discover what life at Edify is all about, from our worship and community events to ways you can grow in
            faith and connect with others.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {"Life at Edify is all about connecting with God and with one another. From inspiring worship and engaging events to opportunities to serve and grow, there's a place for everyone here."}
          </p>
        </section>
      </ScrollReveal>

      {/* Meet pastors */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet John
            <br />
            and Jess
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {"Edify is led by John and Jess Applewood, a passionate couple with a heart that's committed to serving our church family and community."}
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
          >
            JOHN AND JESS <ArrowRight size={12} />
          </Link>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.15}>
          <div className="rounded-2xl overflow-hidden relative aspect-square">
            <Image
              src="/images/pastors.jpg"
              alt="Pastors John and Jess Applewood"
              fill
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* Youth camp */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left" className="order-2 md:order-1">
          <div className="rounded-2xl overflow-hidden relative aspect-square">
            <Image
              src="/images/youth-camp.jpg"
              alt="Youth camp activities"
              fill
              className="object-cover"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal direction="right" delay={0.15} className="order-1 md:order-2">
          <p className="text-xs tracking-widest text-muted-foreground mb-2">EDIFY YOUTH CAMP</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Join us for an unforgettable youth camp where fun, friendship, and faith come together. Experience
            exciting activities, inspiring sessions, and team challenges designed to help you grow in your faith.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
          >
            COME ALONG <ArrowRight size={12} />
          </Link>
        </ScrollReveal>
      </section>

      {/* Meet our team / What we believe */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
        <ScrollReveal delay={0}>
          <h3
            className="text-2xl mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet our team
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Meet the individuals who make it all possible. Each team member brings unique gifts, dedication, and a
            desire for helping others grow in faith and community.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
          >
            LEARN MORE <ArrowRight size={12} />
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h3
            className="text-2xl mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What we believe
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {"At the heart of our beliefs is a trust in God's love, Jesus Christ, the authority of Scripture, and the power of God's love to change lives and communities."}
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-xs tracking-widest font-medium hover:gap-3 transition-all"
          >
            STATEMENT OF FAITH <ArrowRight size={12} />
          </Link>
        </ScrollReveal>
      </section>

      {/* History Timeline */}
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
            <p className="text-xs tracking-widest text-center mb-2 text-accent">EST.1953</p>
            <h2
              className="text-3xl md:text-4xl text-center mb-16"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              We have been edifying the body of Christ since 1953.
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
