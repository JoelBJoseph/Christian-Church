import Link from "next/link"
import Image from "next/image"

const footerLinks = [
  { label: "PRAYER", href: "/prayer" },
  { label: "JESUS", href: "/jesus" },
  { label: "ABOUT US", href: "/about" },
  { label: "EVENTS", href: "/events" },
  { label: "GALLERY", href: "/gallery" },
]

export default function Footer() {
  return (
    <footer className="border-t border-border" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-sm text-muted-foreground">+91 94950 93427</p>
          <p className="text-sm text-muted-foreground">christianchurch@gmail.com</p>
          <p className="text-sm text-muted-foreground mt-2">
            MICHAEL ANNA CHAMAKKALAYIL TOWNSHIP,
            <br />
            SUPPLY CO. ROAD
            <br />
            MUTTOM, THODUPUZHA
          </p>
          <p className="text-sm text-muted-foreground">KERALA - 685587</p>
          <p className="mt-4 flex items-center gap-2 italic text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            <Image src="/logo.png" alt="" width={447} height={449} className="h-9 w-9" />
            <span>
              <span className="italic">Christian</span> Church
            </span>
          </p>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Footer navigation">
          <p className="text-xs tracking-widest font-medium text-muted-foreground mb-3">LINKS</p>
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-end justify-start md:justify-end">
          <p
            className="text-2xl md:text-3xl leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Leading people to become fully devoted followers of Christ.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-6 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CHRISTIAN CHURCH</p>
        <div className="flex gap-2" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-accent" />
        </div>
      </div>
    </footer>
  )
}
