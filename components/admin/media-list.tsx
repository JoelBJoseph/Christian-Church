import { motion } from "framer-motion"
import { Trash2, Tag, ImageIcon, Film } from "lucide-react"
import { MediaItem } from "@/app/admin/types"
import Image from "next/image"

interface MediaListProps {
    items: MediaItem[]
    type: "photos" | "videos"
    onDelete: (id: number) => void
}

export function MediaList({ items, type, onDelete }: MediaListProps) {
    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
            >
                {type === "photos" ? <ImageIcon size={40} className="mx-auto mb-4 opacity-40" /> : <Film size={40} className="mx-auto mb-4 opacity-40" />}
                <p className="text-sm">
                    {type === "photos" 
                        ? 'No photos added yet. Click "Add Photo" to get started.' 
                        : 'No videos added yet. Click "Add Video" to get started.'}
                </p>
            </motion.div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((p) => (
                <div key={p.id} className="bg-secondary rounded-2xl overflow-hidden group border border-transparent hover:border-border transition-all">
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted flex items-center justify-center">
                        {type === "photos" ? (
                            <Image 
                                src={p.url} 
                                alt={p.title} 
                                fill 
                                className="object-cover" 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                             <div className="aspect-video relative bg-black/10 flex items-center justify-center overflow-hidden w-full h-full">
                                {p.url.includes("youtube.com") || p.url.includes("youtu.be") ? (
                                    <iframe 
                                        src={p.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                                        className="w-full h-full border-0 pointer-events-none"
                                        tabIndex={-1}
                                    ></iframe>
                                ) : (
                                    <Film size={40} className="text-muted-foreground/20" />
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-background/90 backdrop-blur shadow-xl p-3 rounded-full text-muted-foreground">
                                        <Film size={24} />
                                    </div>
                                </div>
                             </div>
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onDelete(p.id)}
                                className="bg-background/80 backdrop-blur-sm text-destructive p-2 rounded-full hover:bg-destructive hover:text-white transition-all shadow-lg"
                                aria-label={`Delete ${type === "photos" ? "photo" : "video"}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold truncate">{p.title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            {p.category && (
                                <div className="flex items-center gap-1 text-[9px] tracking-widest font-bold uppercase text-accent">
                                    <Tag size={10} />
                                    <span>{p.category}</span>
                                </div>
                            )}
                            {p.date && (
                                <span className="text-[9px] text-muted-foreground uppercase tracking-widest ml-auto">{p.date}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
