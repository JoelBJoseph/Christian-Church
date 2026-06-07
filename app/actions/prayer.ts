"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitPrayerRequest(data: { name: string; email?: string; prayer: string; isPrivate: boolean }) {
    try {
        const prayer = await prisma.prayerRequest.create({
            data: {
                name: data.name,
                email: data.email || null,
                prayer: data.prayer,
                isPrivate: data.isPrivate,
            }
        })
        revalidatePath("/admin")
        return { success: true, data: prayer }
    } catch (error) {
        console.error("Failed to submit prayer request:", error)
        return { success: false, error: "Failed to submit prayer request. Please try again later." }
    }
}
