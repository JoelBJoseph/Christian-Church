export type Tab = "prayers" | "events" | "photos" | "videos" | "users"

export interface PrayerRequest {
    id: number
    name: string
    email: string | null
    prayer: string
    isPrivate: boolean
    createdAt: Date
}

export interface EventItem {
    id: number
    title: string
    description: string | null
    date: string | null
    time: string | null
    location: string | null
    imageUrl: string | null
}

export interface MediaItem {
    id: number
    title: string
    description: string | null
    url: string
    date: string | null
    category?: string | null
}

export interface UserItem {
    id: string
    email: string
    name: string | null
    role: "ADMIN" | "USER"
    isBanned: boolean
}
