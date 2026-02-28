"use client"

import { motion } from "framer-motion"
import ScrollReveal from "@/components/scroll-reveal"
import Image from "next/image"

interface PageHeroProps {
  title: string
  imageSrc: string
  imageAlt: string
}

export default function PageHero({ title, imageSrc, imageAlt }: PageHeroProps) {
  return (
    <section className="flex justify-center pb-12">
      <ScrollReveal>
        <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg">
          <motion.div
            className="relative w-full h-full"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.h1
              className="text-5xl md:text-6xl italic font-medium tracking-tight text-white drop-shadow-md"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {title}
            </motion.h1>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
