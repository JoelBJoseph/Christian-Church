"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { optionalEmail, requiredText, ValidationError } from "@/lib/text"

export async function submitPrayerRequest(data: {
  name: string
  email?: string
  prayer: string
  isPrivate: boolean
}) {
  try {
    const name = requiredText(data.name, 100, "Name")
    const prayer = requiredText(data.prayer, 2000, "Prayer request")
    const email = optionalEmail(data.email)
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isBanned: true },
      })
      if (user?.isBanned) {
        return { success: false as const, error: "This account can't submit prayer requests." }
      }
    }

    await prisma.prayerRequest.create({
      data: {
        userId: userId ?? null,
        name,
        email,
        prayer,
        isPrivate: Boolean(data.isPrivate),
      },
    })

    revalidatePath("/admin")
    return { success: true as const }
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false as const, error: error.message }
    }
    console.error("Failed to submit prayer request:", error)
    return { success: false as const, error: "Failed to submit prayer request. Please try again later." }
  }
}
