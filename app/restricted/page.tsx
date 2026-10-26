import Link from "next/link"
import SiteLayout from "@/components/site-layout"

export default function RestrictedPage() {
  return (
    <SiteLayout>
      <section className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Account restricted
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          This account can&apos;t use member features right now. If this is a mistake, contact the church office.
          You can sign out from the menu above.
        </p>
        <Link
          href="/"
          className="text-xs tracking-widest font-medium border border-border px-6 py-3 rounded-full hover:bg-secondary transition-colors"
        >
          RETURN HOME
        </Link>
      </section>
    </SiteLayout>
  )
}
