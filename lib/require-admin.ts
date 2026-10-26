import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function requireAdmin(): Promise<
  { ok: true; userId: string } | { ok: false; error: string; status: 401 | 403 }
> {
  try {
    const { userId } = await auth()
    if (!userId) return { ok: false, error: "You need to sign in.", status: 401 }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isBanned: true },
    })

    if (!user || user.role !== "ADMIN" || user.isBanned) {
      return { ok: false, error: "You don't have permission to do that.", status: 403 }
    }

    return { ok: true, userId }
  } catch (error) {
    console.error("[Auth] Admin check failed:", error)
    return { ok: false, error: "You don't have permission to do that.", status: 403 }
  }
}
