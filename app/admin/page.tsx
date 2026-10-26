"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, AlertCircle } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import SiteLayout from "@/components/site-layout"
import { 
    getEvents, addEvent, updateEvent, deleteEvent, 
    getPhotos, addPhoto, updatePhoto, deletePhoto, 
    getVideos, addVideo, updateVideo, deleteVideo, 
    getPrayers, deletePrayer,
    getUsers, updateUserRole, toggleBanUser, deleteUser
} from "@/app/actions/admin"

import { Tab, PrayerRequest, EventItem, MediaItem, UserItem } from "./types"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminTabs } from "@/components/admin/admin-tabs"
import { PrayerList } from "@/components/admin/prayer-list"
import { EventList } from "@/components/admin/event-list"
import { MediaList } from "@/components/admin/media-list"
import { UserList } from "@/components/admin/user-list"
import { AddItemModal } from "@/components/admin/add-item-modal"
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/uploads"

export default function AdminPage() {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState<Tab>("prayers")
    const [prayers, setPrayers] = useState<PrayerRequest[]>([])
    const [events, setEvents] = useState<EventItem[]>([])
    const [photos, setPhotos] = useState<MediaItem[]>([])
    const [videos, setVideos] = useState<MediaItem[]>([])
    const [users, setUsers] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formError, setFormError] = useState<string | null>(null)

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

    useEffect(() => {
        setShowAddModal(false)
        setEditingId(null)
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!ALLOWED_IMAGE_TYPES[file.type]) {
            setFormError("Use a JPEG, PNG, WebP, or GIF image.")
            return
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            setFormError("Image must be 5MB or smaller.")
            return
        }

        setUploading(true)
        setFormError(null)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
            const data = await res.json()
            if (!res.ok || !data.url) {
                setFormError(typeof data.error === "string" ? data.error : "Upload failed.")
                return
            }
            setUploadedFileUrl(data.url)
            setFormUrl(data.url)
            if (activeTab === "events") setFormImageUrl(data.url)
        } catch (error) {
            console.error("Upload failed:", error)
            setFormError("Upload failed.")
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setFormTitle("")
        setFormDescription("")
        setFormDate("")
        setFormTime("")
        setFormLocation("")
        setFormUrl("")
        setFormImageUrl("")
        setFormCategory("")
        setUploadedFileUrl("")
    }

    const closeModal = () => {
        setFormError(null)
        setShowAddModal(false)
        setEditingId(null)
        resetForm()
    }

    const dateValue = (value: string | null) =>
        value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : ""

    const openAdd = () => {
        resetForm()
        setEditingId(null)
        setFormError(null)
        setShowAddModal(true)
    }

    const openEdit = (item: EventItem | MediaItem) => {
        resetForm()
        setEditingId(item.id)
        setFormError(null)
        setFormTitle(item.title)
        setFormDescription(item.description ?? "")
        setFormDate(dateValue(item.date))
        if ("time" in item) {
            setFormTime(item.time ?? "")
            setFormLocation(item.location ?? "")
            setFormImageUrl(item.imageUrl ?? "")
        }
        if ("url" in item) {
            setFormUrl(item.url)
            setFormCategory(item.category ?? "")
        }
        setShowAddModal(true)
    }

    const handleAdd = async () => {
        if (!formTitle.trim()) return
        if ((activeTab === "photos" || activeTab === "videos") && !formUrl.trim()) {
            setFormError("Add a URL or upload a file first.")
            return
        }

        setFormError(null)
        setSaving(true)
        const id = editingId

        try {
            const result = activeTab === "events"
                ? id !== null
                    ? await updateEvent(id, {
                        title: formTitle,
                        description: formDescription,
                        date: formDate,
                        time: formTime,
                        location: formLocation,
                        imageUrl: formImageUrl
                    })
                    : await addEvent({
                        title: formTitle,
                        description: formDescription,
                        date: formDate,
                        time: formTime,
                        location: formLocation,
                        imageUrl: formImageUrl
                    })
                : activeTab === "photos"
                ? id !== null
                    ? await updatePhoto(id, {
                        title: formTitle,
                        url: formUrl,
                        description: formDescription,
                        date: formDate,
                        category: formCategory
                    })
                    : await addPhoto({
                        title: formTitle,
                        url: formUrl,
                        description: formDescription,
                        date: formDate,
                        category: formCategory
                    })
                : activeTab === "videos"
                ? id !== null
                    ? await updateVideo(id, {
                        title: formTitle,
                        url: formUrl,
                        description: formDescription,
                        date: formDate
                    })
                    : await addVideo({
                        title: formTitle,
                        url: formUrl,
                        description: formDescription,
                        date: formDate
                    })
                : null

            if (!result?.success) {
                setFormError(result?.error ?? "Failed to save item.")
                return
            }
            
            closeModal()
            fetchData()
        } catch (error) {
            console.error("Failed to save item:", error)
            setFormError("Failed to save item.")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number | string) => {
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            const result = activeTab === "events"
                ? await deleteEvent(id as number)
                : activeTab === "photos"
                ? await deletePhoto(id as number)
                : activeTab === "videos"
                ? await deleteVideo(id as number)
                : activeTab === "prayers"
                ? await deletePrayer(id as number)
                : await deleteUser(id as string)

            if (!result.success) {
                setError(result.error)
                return
            }
            
            fetchData()
        } catch (error) {
            console.error("Failed to delete item:", error)
            setError("Failed to delete item.")
        }
    }

    const handleRoleChange = async (userId: string, currentRole: "ADMIN" | "USER") => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
        try {
            const result = await updateUserRole(userId, newRole)
            if (!result.success) {
                setError(result.error)
                return
            }
            fetchData()
        } catch (error) {
            console.error("Failed to update role:", error)
            setError("Failed to update role.")
        }
    }

    const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
        try {
            const result = await toggleBanUser(userId, !currentBanStatus)
            if (!result.success) {
                setError(result.error)
                return
            }
            fetchData()
        } catch (error) {
            console.error("Failed to toggle ban status:", error)
            setError("Failed to update user status.")
        }
    }

    const canAdd = activeTab === "events" || activeTab === "photos" || activeTab === "videos"

    return (
        <SiteLayout>
            <AdminHeader />

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
                <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </section>

            <section className="max-w-5xl mx-auto px-6 pb-24">
                {canAdd && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={openAdd}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs tracking-widest font-medium hover:opacity-90 transition-opacity"
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
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "prayers" && <PrayerList prayers={prayers} onDelete={handleDelete} />}
                            {activeTab === "events" && <EventList events={events} onEdit={openEdit} onDelete={handleDelete} />}
                            {activeTab === "photos" && <MediaList items={photos} type="photos" onEdit={openEdit} onDelete={handleDelete} />}
                            {activeTab === "videos" && <MediaList items={videos} type="videos" onEdit={openEdit} onDelete={handleDelete} />}
                            {activeTab === "users" && (
                                <UserList 
                                    users={users}
                                    currentUserId={user?.id}
                                    onRoleChange={handleRoleChange} 
                                    onToggleBan={handleToggleBan} 
                                    onDelete={handleDelete} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </section>

            <AddItemModal 
                isOpen={showAddModal}
                onClose={closeModal}
                error={formError}
                activeTab={activeTab}
                mode={editingId === null ? "add" : "edit"}
                onAdd={handleAdd}
                saving={saving}
                formState={{
                    title: formTitle, setTitle: setFormTitle,
                    description: formDescription, setDescription: setFormDescription,
                    date: formDate, setDate: setFormDate,
                    time: formTime, setTime: setFormTime,
                    location: formLocation, setLocation: setFormLocation,
                    url: formUrl, setUrl: setFormUrl,
                    imageUrl: formImageUrl, setImageUrl: setFormImageUrl,
                    category: formCategory, setCategory: setFormCategory
                }}
                uploading={uploading}
                uploadedFileUrl={uploadedFileUrl}
                handleFileUpload={handleFileUpload}
            />
        </SiteLayout>
    )
}
