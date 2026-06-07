"use server"

import prisma from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

async function isAdmin() {
    try {
        const { userId } = await auth()
        if (!userId) return false
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, isBanned: true }
        })
        
        return user?.role === "ADMIN" && !user.isBanned
    } catch (error) {
        console.error("Auth check failed:", error)
        return false
    }
}

// Events
export async function getEvents() {
    return prisma.event.findMany({
        orderBy: { createdAt: "desc" }
    })
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
    
    const event = await prisma.event.create({
        data
    })
    revalidatePath("/admin")
    revalidatePath("/events")
    return event
}

export async function deleteEvent(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    await prisma.event.delete({
        where: { id }
    })
    revalidatePath("/admin")
}

// Photos
export async function getPhotos() {
    return prisma.photo.findMany({
        orderBy: { createdAt: "desc" }
    })
}

export async function addPhoto(data: { 
    title: string; 
    url: string; 
    description?: string; 
    date?: string; 
    category?: string 
}) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    const photo = await prisma.photo.create({
        data
    })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return photo
}

export async function deletePhoto(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    await prisma.photo.delete({
        where: { id }
    })
    revalidatePath("/admin")
}

// Videos
export async function getVideos() {
    return prisma.video.findMany({
        orderBy: { createdAt: "desc" }
    })
}

export async function addVideo(data: { 
    title: string; 
    url: string; 
    description?: string; 
    date?: string 
}) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    const video = await prisma.video.create({
        data
    })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return video
}

export async function deleteVideo(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    await prisma.video.delete({
        where: { id }
    })
    revalidatePath("/admin")
}

// Prayers (for fetching and deleting)
export async function getPrayers() {
    if (!await isAdmin()) throw new Error("Unauthorized")
    return prisma.prayerRequest.findMany({
        orderBy: { createdAt: "desc" }
    })
}

export async function deletePrayer(id: number) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    await prisma.prayerRequest.delete({
        where: { id }
    })
    revalidatePath("/admin")
}

// Users
export async function getUsers() {
    if (!await isAdmin()) throw new Error("Unauthorized")
    return prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    })
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role }
    })

    // Sync to Clerk metadata
    try {
        const clerk = await import('@clerk/nextjs/server')
        const client = await clerk.clerkClient()
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: role
            }
        })
    } catch (error) {
        console.error("Failed to update Clerk metadata:", error)
    }

    revalidatePath("/admin")
    return updatedUser
}

export async function toggleBanUser(userId: string, isBanned: boolean) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isBanned }
    })

    // Sync to Clerk metadata
    try {
        const clerk = await import('@clerk/nextjs/server')
        const client = await clerk.clerkClient()
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                isBanned: isBanned
            }
        })
    } catch (error) {
        console.error("Failed to update Clerk metadata:", error)
    }

    revalidatePath("/admin")
    return updatedUser
}

export async function deleteUser(userId: string) {
    if (!await isAdmin()) throw new Error("Unauthorized")
    
    // Note: This only deletes from our DB, not Clerk. 
    // Usually you'd want to delete from Clerk too if "ban" means "remove entirely".
    // But since the webhook handles deletions, it's better to keep it in sync.
    await prisma.user.delete({
        where: { id: userId }
    })
    revalidatePath("/admin")
}
