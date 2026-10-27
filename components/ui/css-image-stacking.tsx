"use client"

import { useEffect, type ReactNode } from "react"
import { ReactLenis, useLenis } from "lenis/react"
import { ChevronDown, Maximize2 } from "lucide-react"
import { SafeImage } from "@/components/safe-image"
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable"

export type StackingCard = {
  id: string | number
  src: string
  alt: string
  title: string
  eyebrow?: string | null
  detail?: ReactNode
}

const NAV_OFFSET = "6rem"

function cardWidth(index: number, total: number, fit: "cover" | "contain") {
  const start = fit === "contain" ? 32 : 54
  const end = fit === "contain" ? 48 : 86
  if (total <= 1) return Math.round((start + end) / 2)
  const step = (end - start) / (total - 1)
  return Math.round(start + index * step)
}

function ScrollLock({ locked }: { locked: boolean }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    if (locked) lenis.stop()
    else lenis.start()
  }, [lenis, locked])

  return null
}

export default function CssImageStacking({
  heading,
  items,
  fit = "cover",
  onOpen,
  scrollLocked = false,
}: {
  heading: string
  items: StackingCard[]
  fit?: "cover" | "contain"
  onOpen?: (index: number) => void
  scrollLocked?: boolean
}) {
  if (items.length === 0) return null

  return (
    <ReactLenis root options={{ lerp: 0.12, smoothWheel: true }}>
      <ScrollLock locked={scrollLocked} />
      <div className="bg-background text-foreground">
        <section className="sticky top-24 grid h-[58vh] w-full place-content-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#203B6014_1px,transparent_1px),linear-gradient(to_bottom,#203B6014_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <h2
            className="relative max-w-3xl px-8 text-center text-4xl leading-[1.15] tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {heading}
          </h2>
        </section>

        <section className="w-full">
          {items.map((item, index) => {
            const width = cardWidth(index, items.length, fit)
            const extraTop = Math.min(index, 6) * 8
            const frameStyle =
              fit === "contain"
                ? { width: `min(${width}vw, calc(64vh * 0.75))` }
                : { width: `${width}%` }
            return (
              <div
                key={item.id}
                className="w-full bg-background sm:sticky"
                style={{ top: `calc(${NAV_OFFSET} + ${extraTop}px)` }}
              >
                <figure className="flex min-h-[100svh] w-full items-center justify-center px-4 py-10 sm:px-6">
                  <div className="mx-auto w-full" style={frameStyle}>
                    <div
                      className={`overflow-hidden rounded-md bg-white ${
                        index > 0
                          ? "shadow-[0_-8px_24px_4px_rgba(17,17,17,0.18),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                          : "shadow-[0_8px_30px_-12px_rgba(17,17,17,0.25)]"
                      }`}
                    >
                      <div
                        className={`relative w-full bg-white ${
                          fit === "contain" ? "aspect-[3/4]" : "h-[68vh]"
                        }`}
                      >
                        {onOpen ? (
                          <button
                            type="button"
                            onClick={() => onOpen(index)}
                            aria-label={`View ${item.alt}`}
                            className="absolute inset-0 z-[1]"
                          >
                            <SafeImage
                              src={item.src}
                              alt={item.alt}
                              className={fit === "contain" ? "object-contain" : "object-cover"}
                              sizes={fit === "contain" ? "420px" : "(max-width: 768px) 90vw, 70vw"}
                              priority={index === 0}
                            />
                            <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111]/70 text-white">
                              <Maximize2 size={16} />
                            </span>
                          </button>
                        ) : (
                          <SafeImage
                            src={item.src}
                            alt={item.alt}
                            className={fit === "contain" ? "object-contain" : "object-cover"}
                            sizes={fit === "contain" ? "420px" : "(max-width: 768px) 90vw, 70vw"}
                            priority={index === 0}
                          />
                        )}
                      </div>

                      <Expandable expandBehavior="push">
                        {({ isExpanded }) => (
                          <div className="bg-background">
                            <ExpandableTrigger className="flex items-start justify-between gap-4 px-5 py-4 text-left">
                              <span>
                                {item.eyebrow && (
                                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                    {item.eyebrow}
                                  </span>
                                )}
                                <span
                                  className="block text-xl leading-tight md:text-2xl"
                                  style={{ fontFamily: "var(--font-heading)" }}
                                >
                                  {item.title}
                                </span>
                              </span>
                              <ChevronDown
                                size={18}
                                className={`mt-1 shrink-0 text-muted-foreground transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </ExpandableTrigger>
                            <ExpandableContent preset="slide-up">
                              <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                                {item.detail}
                              </div>
                            </ExpandableContent>
                          </div>
                        )}
                      </Expandable>
                    </div>
                  </div>
                </figure>
              </div>
            )
          })}
        </section>

        <footer className="relative z-10 grid min-h-[40vh] place-content-center bg-background">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
            Christian Church
          </p>
        </footer>
      </div>
    </ReactLenis>
  )
}
