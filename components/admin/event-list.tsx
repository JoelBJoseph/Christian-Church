import { motion } from "framer-motion"
import { Calendar, MapPin, Trash2 } from "lucide-react"
import { EventItem } from "@/app/admin/types"
import Image from "next/image"

interface EventListProps {
    events: EventItem[]
    onDelete: (id: number) => void
}

export function EventList({ events, onDelete }: EventListProps) {
    if (events.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
            >
                <Calendar size={40} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">{"No events added yet. Click \"Add Event\" to get started."}</p>
            </motion.div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((e) => (
                <div key={e.id} className="bg-secondary rounded-2xl overflow-hidden flex flex-col group border border-transparent hover:border-border transition-all">
                    {e.imageUrl && (
                        <div className="aspect-video relative overflow-hidden">
                            <Image 
                                src={e.imageUrl} 
                                alt={e.title} 
                                fill 
                                className="object-cover" 
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    )}
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-lg leading-tight">{e.title}</h3>
                            <button
                                onClick={() => onDelete(e.id)}
                                className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all"
                                aria-label="Delete event"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {e.date && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                                    <Calendar size={12} className="opacity-50" />
                                    <span>{e.date} {e.time && `@ ${e.time}`}</span>
                                </div>
                            )}
                            {e.location && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                                    <MapPin size={12} className="opacity-50" />
                                    <span>{e.location}</span>
                                </div>
                            )}
                        </div>
                        {e.description && (
                            <p className="mt-4 text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                                {e.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
