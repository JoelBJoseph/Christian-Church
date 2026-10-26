import { clerkClient } from "@clerk/nextjs/server"

export async function setUserPublicMetadata(
  userId: string,
  metadata: { role: "ADMIN" | "USER"; isBanned: boolean }
) {
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: metadata,
  })
}

export async function deleteClerkUser(userId: string) {
  const client = await clerkClient()
  try {
    await client.users.deleteUser(userId)
  } catch (error) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status: unknown }).status)
        : 0
    if (status !== 404) throw error
  }
}
