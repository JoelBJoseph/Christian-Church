"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import type { ReactNode } from "react"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  )
}
