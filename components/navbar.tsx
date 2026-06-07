"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs'
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "PRAYER", href: "/prayer" },
  { label: "JESUS", href: "/jesus" },
  { label: "ABOUT", href: "/about" },
  { label: "EVENTS", href: "/events" },
  { label: "GALLERY", href: "/gallery" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
      <nav className="fixed top-4 left-4 right-4 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14 bg-background/90 backdrop-blur-sm border border-border rounded-xl shadow-sm">

          {/* Logo */}
          <Link
              href="/"
              className="text-xl tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="italic font-medium">Christian</span>
            <span className="font-light"> Church</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-xs tracking-widest font-medium transition-colors duration-300 hover:text-foreground",
                        pathname === link.href
                            ? "text-foreground"
                            : "text-muted-foreground"
                    )}
                >
                  {link.label}
                </Link>
            ))}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-xs tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors">
                  SIGN IN
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-foreground text-background px-4 py-2 rounded-full text-[10px] tracking-widest font-bold hover:opacity-90 transition-opacity">
                  SIGN UP
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          {/* Mobile Toggle */}
          <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden bg-background/95 backdrop-blur-sm border border-border rounded-2xl mt-2 mx-2 overflow-hidden shadow-sm"
              >
                <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
                  {navLinks.map((link, i) => (
                      <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                      >
                        <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block text-sm tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                  ))}
                  <div className="pt-2 flex flex-col gap-4">
                    <Show when="signed-out">
                      <SignInButton mode="modal">
                        <button className="text-left text-sm tracking-widest font-medium text-muted-foreground hover:text-foreground transition-colors">
                          SIGN IN
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="w-full bg-foreground text-background py-3 rounded-xl text-xs tracking-widest font-medium hover:opacity-90 transition-opacity text-center">
                          SIGN UP
                        </button>
                      </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                      <div className="flex items-center gap-2">
                        <UserButton />
                        <span className="text-sm tracking-widest font-medium text-muted-foreground">MY ACCOUNT</span>
                      </div>
                    </Show>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </nav>
  )
}