"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

/**
 * Shared authentication check for admin actions.
 * Ensures the user is logged in, has the ADMIN role, and is not banned.
 */
async function isAdmin() {
    try {
        const { userId } = await auth()
        console.log(`[Admin Action] Checking admin status for user: ${userId}`);
        if (!userId) return false
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, isBanned: true }
        })
        
        console.log(`[Admin Action] User role in DB: ${user?.role}, isBanned: ${user?.isBanned}`);
        return user?.role === "ADMIN" && !user.isBanned
    } catch (error) {
        console.error("[Auth] Admin check failed:", error)
        return false
    }
}

// --- Events ---

export async function getEvents() {
    try {
        return await prisma.event.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("[Events] Failed to fetch events:", error)
        throw new Error("Failed to load events")
    }
}

export async function addEvent(data: { 
    title: string; 
    description?: string; 
    date?: string; 
    time?: string; 
    location?: string; 
    imageUrl?: string 
}) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        const event = await prisma.event.create({ data })
        revalidatePath("/admin")
        revalidatePath("/events")
        return event
    } catch (error) {
        console.error("[Events] Failed to add event:", error)
        throw new Error("Failed to create event")
    }
}

export async function deleteEvent(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        await prisma.event.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/events")
    } catch (error) {
        console.error("[Events] Failed to delete event:", error)
        throw new Error("Failed to delete event")
    }
}

// --- Photos ---

export async function getPhotos() {
    try {
        return await prisma.photo.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("[Photos] Failed to fetch photos:", error)
        throw new Error("Failed to load photos")
    }
}

export async function addPhoto(data: { 
    title: string; 
    url: string; 
    description?: string; 
    date?: string; 
    category?: string 
}) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        const photo = await prisma.photo.create({ data })
        revalidatePath("/admin")
        revalidatePath("/gallery")
        return photo
    } catch (error) {
        console.error("[Photos] Failed to add photo:", error)
        throw new Error("Failed to create photo")
    }
}

export async function deletePhoto(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        await prisma.photo.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/gallery")
    } catch (error) {
        console.error("[Photos] Failed to delete photo:", error)
        throw new Error("Failed to delete photo")
    }
}

// --- Videos ---

export async function getVideos() {
    try {
        return await prisma.video.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("[Videos] Failed to fetch videos:", error)
        throw new Error("Failed to load videos")
    }
}

export async function addVideo(data: { 
    title: string; 
    url: string; 
    description?: string; 
    date?: string 
}) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        const video = await prisma.video.create({ data })
        revalidatePath("/admin")
        revalidatePath("/gallery")
        return video
    } catch (error) {
        console.error("[Videos] Failed to add video:", error)
        throw new Error("Failed to create video")
    }
}

export async function deleteVideo(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        await prisma.video.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/gallery")
    } catch (error) {
        console.error("[Videos] Failed to delete video:", error)
        throw new Error("Failed to delete video")
    }
}

// --- Prayers ---

export async function getPrayers() {
    if (!await isAdmin()) throw new Error("Unauthorized")
    try {
        return await prisma.prayerRequest.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("[Prayers] Failed to fetch prayers:", error)
        throw new Error("Failed to load prayer requests")
    }
}

export async function deletePrayer(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        await prisma.prayerRequest.delete({ where: { id } })
        revalidatePath("/admin")
    } catch (error) {
        console.error("[Prayers] Failed to delete prayer:", error)
        throw new Error("Failed to delete prayer request")
    }
}

// --- Users ---

export async function getUsers() {
    if (!await isAdmin()) throw new Error("Unauthorized")
    try {
        return await prisma.user.findMany({
            orderBy: { createdAt: "desc" }
        })
    } catch (error) {
        console.error("[Users] Failed to fetch users:", error)
        throw new Error("Failed to load users")
    }
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        // Sync to Clerk metadata
        try {
            const clerk = await import('@clerk/nextjs/server')
            const client = await clerk.clerkClient()
            await client.users.updateUserMetadata(userId, {
                publicMetadata: { role }
            })
        } catch (error) {
            console.error(`[Clerk] Failed to update role for user ${userId}:`, error)
        }

        revalidatePath("/admin")
        return updatedUser
    } catch (error) {
        console.error(`[Users] Failed to update role for user ${userId}:`, error)
        throw new Error("Failed to update user role")
    }
}

export async function toggleBanUser(userId: string, isBanned: boolean) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isBanned }
        })

        // Sync to Clerk metadata
        try {
            const clerk = await import('@clerk/nextjs/server')
            const client = await clerk.clerkClient()
            await client.users.updateUserMetadata(userId, {
                publicMetadata: { isBanned }
            })
        } catch (error) {
            console.error(`[Clerk] Failed to toggle ban for user ${userId}:`, error)
        }

        revalidatePath("/admin")
        return updatedUser
    } catch (error) {
        console.error(`[Users] Failed to toggle ban for user ${userId}:`, error)
        throw new Error("Failed to update user status")
    }
}

export async function deleteUser(userId: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    try {
        // Note: This only deletes from our DB. Webhook handles Clerk deletions.
        await prisma.user.delete({ where: { id: userId } })
        revalidatePath("/admin")
    } catch (error) {
        console.error(`[Users] Failed to delete user ${userId}:`, error)
        throw new Error("Failed to delete user")
    }
}
