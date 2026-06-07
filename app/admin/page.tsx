"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Trash2, Calendar, ImageIcon, Film, BookOpen, X, Users, 
    Shield, ShieldOff, Ban, CheckCircle, AlertCircle, MapPin, Link as LinkIcon, Tag,
    Upload, Loader2
} from "lucide-react"
import SiteLayout from "@/components/site-layout"
import ScrollReveal from "@/components/scroll-reveal"
import { 
    getEvents, addEvent, deleteEvent, 
    getPhotos, addPhoto, deletePhoto, 
    getVideos, addVideo, deleteVideo, 
    getPrayers, deletePrayer,
    getUsers, updateUserRole, toggleBanUser, deleteUser
} from "@/app/actions/admin"

type Tab = "prayers" | "events" | "photos" | "videos" | "users"

interface PrayerRequest {
    id: number
    name: string
    email: string | null
    prayer: string
    isPrivate: boolean
    createdAt: Date
}

interface EventItem {
    id: number
    title: string
    description: string | null
    date: string | null
    time: string | null
    location: string | null
    imageUrl: string | null
}

interface MediaItem {
    id: number
    title: string
    description: string | null
    url: string
    date: string | null
    category?: string | null
}

interface UserItem {
    id: string
    email: string
    name: string | null
    role: "ADMIN" | "USER"
    isBanned: boolean
}

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size: number }> }[] = [
    { id: "prayers", label: "Prayers", icon: BookOpen },
    { id: "events", label: "Events", icon: Calendar },
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "videos", label: "Videos", icon: Film },
    { id: "users", label: "Users", icon: Users },
]

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("prayers")
    const [prayers, setPrayers] = useState<PrayerRequest[]>([])
    const [events, setEvents] = useState<EventItem[]>([])
    const [photos, setPhotos] = useState<MediaItem[]>([])
    const [videos, setVideos] = useState<MediaItem[]>([])
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {
            if (activeTab === "prayers") {
                const data = await getPrayers()
                setPrayers(data)
            } else if (activeTab === "events") {
                const data = await getEvents()
                setEvents(data)
            } else if (activeTab === "photos") {
                const data = await getPhotos()
                setPhotos(data)
            } else if (activeTab === "videos") {
                const data = await getVideos()
                setVideos(data)
            } else if (activeTab === "users") {
                const data = await getUsers()
                setUsers(data as UserItem[])
            }
        } catch (error: unknown) {
            console.error("Failed to fetch data:", error)
            const message = error instanceof Error ? error.message : "Failed to fetch data. Please check your connection."
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    // Form state
    const [formTitle, setFormTitle] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formDate, setFormDate] = useState("")
    const [formTime, setFormTime] = useState("")
    const [formLocation, setFormLocation] = useState("")
    const [formUrl, setFormUrl] = useState("")
    const [formImageUrl, setFormImageUrl] = useState("")
    const [formCategory, setFormCategory] = useState("")
    const [uploading, setUploading] = useState(false)
    const [uploadedFileUrl, setUploadedFileUrl] = useState("")

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                setUploadedFileUrl(data.url)
                setFormUrl(data.url) // For photos/videos, set the URL field too
                if (activeTab === "events") setFormImageUrl(data.url)
            }
        } catch (error) {
            console.error("Upload failed:", error)
        } finally {
            setUploading(false)
        }
    }

    const handleAdd = async () => {
        if (!formTitle.trim()) return

        try {
            if (activeTab === "events") {
                await addEvent({ 
                    title: formTitle, 
                    description: formDescription,
                    date: formDate, 
                    time: formTime,
                    location: formLocation,
                    imageUrl: formImageUrl
                })
            } else if (activeTab === "photos") {
                await addPhoto({ 
                    title: formTitle, 
                    url: formUrl, 
                    description: formDescription,
                    date: formDate,
                    category: formCategory
                })
            } else if (activeTab === "videos") {
                await addVideo({ 
                    title: formTitle, 
                    url: formUrl, 
                    description: formDescription,
                    date: formDate 
                })
            }
            
            setFormTitle("")
            setFormDescription("")
            setFormDate("")
            setFormTime("")
            setFormLocation("")
            setFormUrl("")
            setFormImageUrl("")
            setFormCategory("")
            setUploadedFileUrl("")
            setShowAddModal(false)
            fetchData()
        } catch (error) {
            console.error("Failed to add item:", error)
        }
    }

    const handleDelete = async (id: number | string) => {
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            if (activeTab === "events") await deleteEvent(id as number)
            else if (activeTab === "photos") await deletePhoto(id as number)
            else if (activeTab === "videos") await deleteVideo(id as number)
            else if (activeTab === "prayers") await deletePrayer(id as number)
            else if (activeTab === "users") await deleteUser(id as string)
            
            fetchData()
        } catch (error) {
            console.error("Failed to delete item:", error)
        }
    }

    const handleRoleChange = async (userId: string, currentRole: "ADMIN" | "USER") => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
        try {
            await updateUserRole(userId, newRole)
            fetchData()
        } catch (error) {
            console.error("Failed to update role:", error)
        }
    }

    const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
        try {
            await toggleBanUser(userId, !currentBanStatus)
            fetchData()
        } catch (error) {
            console.error("Failed to toggle ban status:", error)
        }
    }

    const canAdd = activeTab === "events" || activeTab === "photos" || activeTab === "videos"

    return (
        <SiteLayout>
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

            {/* Tabs */}
            <section className="max-w-5xl mx-auto px-6 mb-8">
                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl mb-6 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                        <button onClick={fetchData} className="text-xs underline font-medium">Retry</button>
                    </div>
                )}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs tracking-widest font-medium transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-foreground text-background"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label.toUpperCase()}
                        </button>
                    ))}
                </div>
            </section>

            {/* Content */}
            <section className="max-w-5xl mx-auto px-6 pb-24">
                {canAdd && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-xl text-xs tracking-widest font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus size={14} /> ADD {activeTab.slice(0, -1).toUpperCase()}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
                    </div>
                ) : (
                <AnimatePresence mode="wait">
                    {/* Prayers */}
                    {activeTab === "prayers" && (
                        <motion.div
                            key="prayers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {prayers.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
                                    <p className="text-sm">No prayer requests yet.</p>
                                </div>
                            ) : (
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
                                                        onClick={() => handleDelete(p.id)}
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
                            )}
                        </motion.div>
                    )}

                    {/* Events */}
                    {activeTab === "events" && (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {events.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Calendar size={40} className="mx-auto mb-4 opacity-40" />
                                    <p className="text-sm">{"No events added yet. Click \"Add Event\" to get started."}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {events.map((e) => (
                                        <div key={e.id} className="bg-secondary rounded-2xl overflow-hidden flex flex-col group border border-transparent hover:border-border transition-all">
                                            {e.imageUrl && (
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img src={e.imageUrl} alt={e.title} className="object-cover w-full h-full" />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="font-bold text-lg leading-tight">{e.title}</h3>
                                                    <button
                                                        onClick={() => handleDelete(e.id)}
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
                            )}
                        </motion.div>
                    )}

                    {/* Photos */}
                    {activeTab === "photos" && (
                        <motion.div
                            key="photos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {photos.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <ImageIcon size={40} className="mx-auto mb-4 opacity-40" />
                                    <p className="text-sm">{"No photos added yet. Click \"Add Photo\" to get started."}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {photos.map((p) => (
                                        <div key={p.id} className="bg-secondary rounded-2xl overflow-hidden group border border-transparent hover:border-border transition-all">
                                            <div className="aspect-[4/5] relative overflow-hidden">
                                                <img src={p.url} alt={p.title} className="object-cover w-full h-full" />
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="bg-background/80 backdrop-blur-sm text-destructive p-2 rounded-full hover:bg-destructive hover:text-white transition-all shadow-lg"
                                                        aria-label="Delete photo"
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
                            )}
                        </motion.div>
                    )}

                    {/* Videos */}
                    {activeTab === "videos" && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {videos.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Film size={40} className="mx-auto mb-4 opacity-40" />
                                    <p className="text-sm">{"No videos added yet. Click \"Add Video\" to get started."}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {videos.map((v) => (
                                        <div key={v.id} className="bg-secondary rounded-2xl overflow-hidden flex flex-col group border border-transparent hover:border-border transition-all">
                                            <div className="aspect-video relative bg-black/10 flex items-center justify-center overflow-hidden">
                                                {v.url.includes("youtube.com") || v.url.includes("youtu.be") ? (
                                                    <iframe 
                                                        src={v.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
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
                                            <div className="p-6">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-bold text-lg leading-tight truncate pr-4">{v.title}</h3>
                                                    <button
                                                        onClick={() => handleDelete(v.id)}
                                                        className="text-muted-foreground hover:text-destructive p-2 rounded-lg hover:bg-destructive/10 transition-all flex-shrink-0"
                                                        aria-label="Delete video"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] tracking-widest font-bold text-muted-foreground uppercase mb-4">
                                                    {v.date && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} className="opacity-50" />
                                                            <span>{v.date}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {v.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic mb-4">
                                                        {v.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 text-[10px] text-accent truncate bg-accent/5 p-2 rounded-lg border border-accent/10">
                                                    <LinkIcon size={12} className="flex-shrink-0" />
                                                    <span className="truncate">{v.url}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Users */}
                    {activeTab === "users" && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {users.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Users size={40} className="mx-auto mb-4 opacity-40" />
                                    <p className="text-sm">No users found.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {users.map((u) => (
                                        <div key={u.id} className={`bg-secondary rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${u.isBanned ? "opacity-60" : ""}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-medium">
                                                    {u.name?.[0] || u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium flex items-center gap-2">
                                                        {u.name || "Unnamed User"}
                                                        {u.role === "ADMIN" && <Shield size={14} className="text-accent" />}
                                                        {u.isBanned && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded uppercase tracking-tighter">Banned</span>}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 self-end md:self-auto">
                                                <button
                                                    onClick={() => handleRoleChange(u.id, u.role)}
                                                    className={`p-2 rounded-lg transition-colors ${u.role === "ADMIN" ? "text-accent hover:bg-accent/10" : "text-muted-foreground hover:bg-foreground/5"}`}
                                                    title={u.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
                                                >
                                                    {u.role === "ADMIN" ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleToggleBan(u.id, u.isBanned)}
                                                    className={`p-2 rounded-lg transition-colors ${u.isBanned ? "text-green-500 hover:bg-green-500/10" : "text-orange-500 hover:bg-orange-500/10"}`}
                                                    title={u.isBanned ? "Unban User" : "Ban User"}
                                                >
                                                    {u.isBanned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(u.id)}
                                                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                )}
            </section>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="bg-background rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                                    Add {activeTab.slice(0, -1)}
                                </h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="add-title" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                        TITLE *
                                    </label>
                                    <input
                                        id="add-title"
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                                        placeholder="Enter title"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="add-description" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                        DESCRIPTION
                                    </label>
                                    <textarea
                                        id="add-description"
                                        value={formDescription}
                                        onChange={(e) => setFormDescription(e.target.value)}
                                        className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-all min-h-[100px] resize-none"
                                        placeholder="Enter detailed description..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="add-date" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                        DATE
                                    </label>
                                    <input
                                        id="add-date"
                                        type="text"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                        placeholder="e.g. 2026-03-20"
                                    />
                                </div>

                                {activeTab === "events" && (
                                    <>
                                        <div>
                                            <label htmlFor="add-time" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                                TIME
                                            </label>
                                            <input
                                                id="add-time"
                                                type="text"
                                                value={formTime}
                                                onChange={(e) => setFormTime(e.target.value)}
                                                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                                placeholder="e.g. 10:00 AM"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="add-location" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                                LOCATION
                                            </label>
                                            <input
                                                id="add-location"
                                                type="text"
                                                value={formLocation}
                                                onChange={(e) => setFormLocation(e.target.value)}
                                                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                                placeholder="Enter location"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <label htmlFor="add-image-url" className="block text-xs tracking-widest font-bold uppercase">
                                                    IMAGE URL
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id="event-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        disabled={uploading}
                                                    />
                                                    <label
                                                        htmlFor="event-upload"
                                                        className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                                                            uploading ? "text-muted-foreground" : "text-accent hover:text-accent/80"
                                                        }`}
                                                    >
                                                        {uploading ? (
                                                            <>
                                                                <Loader2 size={12} className="animate-spin" />
                                                                UPLOADING...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload size={12} />
                                                                UPLOAD FROM DEVICE
                                                            </>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                            <input
                                                id="add-image-url"
                                                type="text"
                                                value={formImageUrl}
                                                onChange={(e) => setFormImageUrl(e.target.value)}
                                                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                                placeholder="Enter image URL"
                                            />
                                            {uploadedFileUrl && (
                                                <p className="text-[10px] text-accent mt-1 flex items-center gap-1">
                                                    <CheckCircle size={10} /> File uploaded successfully
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {(activeTab === "photos" || activeTab === "videos") && (
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="add-url" className="block text-xs tracking-widest font-bold uppercase">
                                                {activeTab === "photos" ? "PHOTO URL" : "VIDEO URL"} *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    accept={activeTab === "photos" ? "image/*" : "video/*"}
                                                    onChange={handleFileUpload}
                                                    disabled={uploading}
                                                />
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                                                        uploading ? "text-muted-foreground" : "text-accent hover:text-accent/80"
                                                    }`}
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 size={12} className="animate-spin" />
                                                            UPLOADING...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload size={12} />
                                                            UPLOAD FROM DEVICE
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                        <input
                                            id="add-url"
                                            type="text"
                                            value={formUrl}
                                            onChange={(e) => setFormUrl(e.target.value)}
                                            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                            placeholder={activeTab === "photos" ? "Enter image URL" : "Enter video URL (e.g. YouTube or direct link)"}
                                        />
                                        {uploadedFileUrl && (
                                            <p className="text-[10px] text-accent mt-1 flex items-center gap-1">
                                                <CheckCircle size={10} /> File uploaded successfully
                                            </p>
                                        )}
                                    </div>
                                )}

                                {activeTab === "photos" && (
                                    <div className="md:col-span-2">
                                        <label htmlFor="add-category" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                            CATEGORY
                                        </label>
                                        <input
                                            id="add-category"
                                            type="text"
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                            placeholder="e.g. Worship, Community, Outreach"
                                        />
                                    </div>
                                )}

                                <div className="md:col-span-2 pt-4">
                                    <button
                                        onClick={handleAdd}
                                        className="w-full bg-foreground text-background py-4 rounded-xl text-xs tracking-widest font-bold hover:opacity-90 transition-opacity uppercase shadow-lg shadow-foreground/10"
                                    >
                                        ADD {activeTab.slice(0, -1).toUpperCase()}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SiteLayout>
    )
}