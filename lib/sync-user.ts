import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { setUserPublicMetadata } from "@/lib/clerk"

export async function syncUser() {
  try {
    const user = await currentUser()
    if (!user) return null

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) return null

    const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (existingUser) {
      const current =
        existingUser.email !== email || existingUser.name !== name
          ? await prisma.user.update({
              where: { id: user.id },
              data: { email, name },
            })
          : existingUser

      const publicMetadata = user.publicMetadata as { role?: string; isBanned?: boolean } | undefined
      if (publicMetadata?.role !== current.role || publicMetadata?.isBanned !== current.isBanned) {
        try {
          await setUserPublicMetadata(user.id, {
            role: current.role,
            isBanned: current.isBanned,
          })
        } catch (error) {
          console.error("[Sync] Failed to update Clerk metadata:", error)
        }
      }

      return current
    }

    const userCount = await prisma.user.count()
    const role = userCount === 0 ? "ADMIN" : "USER"

    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email,
        name,
        role,
      },
    })

    try {
      await setUserPublicMetadata(user.id, {
        role,
        isBanned: false,
      })
    } catch (error) {
      console.error("[Sync] Failed to update Clerk metadata:", error)
    }

    return newUser
  } catch (error) {
    console.error("Error syncing user:", error)
    return null
  }
}
