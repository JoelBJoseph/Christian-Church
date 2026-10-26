"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/require-admin"
import { deleteClerkUser, setUserPublicMetadata } from "@/lib/clerk"
import { cleanMediaUrl, optionalText, requiredText, ValidationError } from "@/lib/text"

type ActionResult = { success: true } | { success: false; error: string }

function failure(error: unknown, fallback: string): ActionResult {
  if (error instanceof ValidationError) {
    return { success: false, error: error.message }
  }
  console.error(fallback, error)
  return { success: false, error: fallback }
}

function denied(error: string): ActionResult {
  return { success: false, error }
}

async function guardOwnAccount(actorId: string, targetId: string, change: {
  role?: "ADMIN" | "USER"
  isBanned?: boolean
  deleted?: boolean
}) {
  if (actorId === targetId) {
    throw new ValidationError("You can't change your own account.")
  }

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { role: true },
  })
  if (!target) throw new ValidationError("User not found.")

  const removesAdmin =
    target.role === "ADMIN" && (change.deleted || change.isBanned === true || change.role === "USER")

  if (removesAdmin) {
    const otherAdmins = await prisma.user.count({
      where: { role: "ADMIN", isBanned: false, NOT: { id: targetId } },
    })
    if (otherAdmins === 0) {
      throw new ValidationError("Keep at least one active admin.")
    }
  }
}

export async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[Events] Failed to fetch events:", error)
    throw new Error("Failed to load events")
  }
}

function eventInput(data: {
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  imageUrl?: string
}) {
  return {
    title: requiredText(data.title, 200, "Title"),
    description: optionalText(data.description, 5000, "Description"),
    date: optionalText(data.date, 40, "Date"),
    time: optionalText(data.time, 40, "Time"),
    location: optionalText(data.location, 200, "Location"),
    imageUrl: cleanMediaUrl(data.imageUrl),
  }
}

export async function addEvent(data: {
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  imageUrl?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.event.create({ data: eventInput(data) })
    revalidatePath("/admin")
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to create event")
  }
}

export async function updateEvent(id: number, data: {
  title: string
  description?: string
  date?: string
  time?: string
  location?: string
  imageUrl?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.event.update({ where: { id }, data: eventInput(data) })
    revalidatePath("/admin")
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to update event")
  }
}

export async function deleteEvent(id: number): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.event.delete({ where: { id } })
    revalidatePath("/admin")
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to delete event")
  }
}

export async function getPhotos() {
  try {
    return await prisma.photo.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[Photos] Failed to fetch photos:", error)
    throw new Error("Failed to load photos")
  }
}

function photoInput(data: {
  title: string
  url: string
  description?: string
  date?: string
  category?: string
}) {
  return {
    title: requiredText(data.title, 200, "Title"),
    url: cleanMediaUrl(data.url, true) ?? "",
    description: optionalText(data.description, 5000, "Description"),
    date: optionalText(data.date, 40, "Date"),
    category: optionalText(data.category, 80, "Category"),
  }
}

export async function addPhoto(data: {
  title: string
  url: string
  description?: string
  date?: string
  category?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.photo.create({ data: photoInput(data) })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to create photo")
  }
}

export async function updatePhoto(id: number, data: {
  title: string
  url: string
  description?: string
  date?: string
  category?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.photo.update({ where: { id }, data: photoInput(data) })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to update photo")
  }
}

export async function deletePhoto(id: number): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.photo.delete({ where: { id } })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to delete photo")
  }
}

export async function getVideos() {
  try {
    return await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[Videos] Failed to fetch videos:", error)
    throw new Error("Failed to load videos")
  }
}

function videoInput(data: {
  title: string
  url: string
  description?: string
  date?: string
}) {
  return {
    title: requiredText(data.title, 200, "Title"),
    url: cleanMediaUrl(data.url, true) ?? "",
    description: optionalText(data.description, 5000, "Description"),
    date: optionalText(data.date, 40, "Date"),
  }
}

export async function addVideo(data: {
  title: string
  url: string
  description?: string
  date?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.video.create({ data: videoInput(data) })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to create video")
  }
}

export async function updateVideo(id: number, data: {
  title: string
  url: string
  description?: string
  date?: string
}): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.video.update({ where: { id }, data: videoInput(data) })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to update video")
  }
}

export async function deleteVideo(id: number): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.video.delete({ where: { id } })
    revalidatePath("/admin")
    revalidatePath("/gallery")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to delete video")
  }
}

export async function getPrayers() {
  const admin = await requireAdmin()
  if (!admin.ok) throw new Error("Unauthorized")

  try {
    return await prisma.prayerRequest.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[Prayers] Failed to fetch prayers:", error)
    throw new Error("Failed to load prayer requests")
  }
}

export async function deletePrayer(id: number): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await prisma.prayerRequest.delete({ where: { id } })
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to delete prayer request")
  }
}

export async function getUsers() {
  const admin = await requireAdmin()
  if (!admin.ok) throw new Error("Unauthorized")

  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[Users] Failed to fetch users:", error)
    throw new Error("Failed to load users")
  }
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER"): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await guardOwnAccount(admin.userId, userId, { role })
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    try {
      await setUserPublicMetadata(userId, {
        role: updatedUser.role,
        isBanned: updatedUser.isBanned,
      })
    } catch (error) {
      console.error(`[Clerk] Failed to update role for user ${userId}:`, error)
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to update user role")
  }
}

export async function toggleBanUser(userId: string, isBanned: boolean): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await guardOwnAccount(admin.userId, userId, { isBanned })
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    })

    try {
      await setUserPublicMetadata(userId, {
        role: updatedUser.role,
        isBanned: updatedUser.isBanned,
      })
    } catch (error) {
      console.error(`[Clerk] Failed to toggle ban for user ${userId}:`, error)
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to update user status")
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin.ok) return denied(admin.error)

  try {
    await guardOwnAccount(admin.userId, userId, { deleted: true })
    await deleteClerkUser(userId)
    try {
      await prisma.user.delete({ where: { id: userId } })
    } catch (error) {
      const missing =
        typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2025"
      if (!missing) throw error
    }
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    return failure(error, "Failed to delete user")
  }
}
