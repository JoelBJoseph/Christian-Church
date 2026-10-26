import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2, Link as LinkIcon } from "lucide-react"
import { Tab } from "@/app/admin/types"

interface AddItemModalProps {
    isOpen: boolean
    onClose: () => void
    activeTab: Tab
    mode: "add" | "edit"
    onAdd: () => void
    saving?: boolean
    formState: {
        title: string
        setTitle: (val: string) => void
        description: string
        setDescription: (val: string) => void
        date: string
        setDate: (val: string) => void
        time: string
        setTime: (val: string) => void
        location: string
        setLocation: (val: string) => void
        url: string
        setUrl: (val: string) => void
        imageUrl: string
        setImageUrl: (val: string) => void
        category: string
        setCategory: (val: string) => void
    }
    uploading: boolean
    uploadedFileUrl: string
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string | null
}

export function AddItemModal({ 
    isOpen, onClose, activeTab, mode, onAdd, saving = false, formState, uploading, uploadedFileUrl, handleFileUpload, error
}: AddItemModalProps) {
    const needsUrl = activeTab === "photos" || activeTab === "videos"
    const singular = activeTab.slice(0, -1)
    const missingRequired = !formState.title.trim() || (needsUrl && !formState.url.trim())
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
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
                            {mode === "edit" ? "Edit" : "Add"} {singular}
                        </h2>
                        <button
                            onClick={onClose}
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
                                value={formState.title}
                                onChange={(e) => formState.setTitle(e.target.value)}
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
                                value={formState.description}
                                onChange={(e) => formState.setDescription(e.target.value)}
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
                                type="date"
                                value={formState.date}
                                onChange={(e) => formState.setDate(e.target.value)}
                                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
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
                                        value={formState.time}
                                        onChange={(e) => formState.setTime(e.target.value)}
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
                                        value={formState.location}
                                        onChange={(e) => formState.setLocation(e.target.value)}
                                        className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                        placeholder="Enter location"
                                    />
                                </div>
                            </>
                        )}

                        {(activeTab === "photos" || activeTab === "videos") && (
                            <div className="md:col-span-2">
                                <label htmlFor="add-url" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                    {activeTab === "photos" ? "PHOTO URL / UPLOAD" : "VIDEO URL"}
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            id="add-url"
                                            type="text"
                                            value={formState.url}
                                            onChange={(e) => formState.setUrl(e.target.value)}
                                            className="w-full bg-transparent border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                            placeholder={`Paste ${activeTab.slice(0, -1)} URL`}
                                        />
                                    </div>
                                    {activeTab === "photos" && (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className={`flex items-center gap-2 px-4 h-full rounded-xl bg-secondary text-xs font-bold cursor-pointer hover:bg-border transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                                UPLOAD
                                            </label>
                                        </div>
                                    )}
                                </div>
                                {uploadedFileUrl && (
                                    <p className="mt-2 text-[10px] text-accent font-medium truncate">
                                        File uploaded successfully!
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === "photos" && (
                             <div>
                                <label htmlFor="add-category" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                    CATEGORY
                                </label>
                                <input
                                    id="add-category"
                                    type="text"
                                    value={formState.category}
                                    onChange={(e) => formState.setCategory(e.target.value)}
                                    className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                    placeholder="e.g. Worship, Outreach"
                                />
                             </div>
                        )}

                        {activeTab === "events" && (
                            <div className="md:col-span-2">
                                <label htmlFor="event-image" className="block text-xs tracking-widest font-bold mb-2 uppercase">
                                    EVENT COVER IMAGE
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            id="event-image"
                                            type="text"
                                            value={formState.imageUrl}
                                            onChange={(e) => formState.setImageUrl(e.target.value)}
                                            className="w-full bg-transparent border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                                            placeholder="Paste image URL"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="event-image-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <label
                                            htmlFor="event-image-upload"
                                            className={`flex items-center gap-2 px-4 h-full rounded-xl bg-secondary text-xs font-bold cursor-pointer hover:bg-border transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            UPLOAD
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="mt-6 text-sm text-destructive" role="alert">{error}</p>
                    )}

                    <div className="flex gap-3 mt-10">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-xl text-xs tracking-widest font-bold bg-secondary hover:bg-border transition-colors uppercase"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onAdd}
                            disabled={missingRequired || uploading || saving}
                            className="flex-1 px-6 py-4 rounded-xl text-xs tracking-widest font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 uppercase"
                        >
                            {uploading ? "UPLOADING..." : saving ? "SAVING..." : mode === "edit" ? "SAVE CHANGES" : `ADD ${singular.toUpperCase()}`}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
