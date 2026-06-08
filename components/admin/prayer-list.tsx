import { motion } from "framer-motion"
import { BookOpen, Trash2 } from "lucide-react"
import { PrayerRequest } from "@/app/admin/types"

interface PrayerListProps {
    prayers: PrayerRequest[]
    onDelete: (id: number) => void
}

export function PrayerList({ prayers, onDelete }: PrayerListProps) {
    if (prayers.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
            >
                <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">No prayer requests yet.</p>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {prayers.map((p) => (
                <div key={p.id} className="bg-secondary rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="font-medium">{p.name}</h3>
                            {p.email && <p className="text-xs text-muted-foreground">{p.email}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                                {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                            <button
                                onClick={() => onDelete(p.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Delete prayer request"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.prayer}</p>
                    <span
                        className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
                            p.isPrivate ? "bg-accent/10 text-accent" : "bg-border text-muted-foreground"
                        }`}
                    >
                        {p.isPrivate ? "Private" : "Public"}
                    </span>
                </div>
            ))}
        </div>
    )
}
