import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1
          className="mb-4 text-6xl font-medium text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="text-xs tracking-widest font-medium border border-border px-6 py-3 rounded-full hover:bg-secondary transition-colors text-foreground"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  )
}
