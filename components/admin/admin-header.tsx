import ScrollReveal from "@/components/scroll-reveal"

export function AdminHeader() {
    return (
        <section className="max-w-5xl mx-auto px-6 pt-4 pb-8">
            <ScrollReveal>
                <h1
                    className="text-4xl md:text-5xl mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage your church content and view prayer requests.
                </p>
            </ScrollReveal>
        </section>
    )
}
