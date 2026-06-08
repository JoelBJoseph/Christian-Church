import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function syncUser() {
    try {
        const user = await currentUser()
        if (!user) return null

        console.log(`[Sync] Syncing user: ${user.id} (${user.emailAddresses[0]?.emailAddress})`)

        const email = user.emailAddresses[0]?.emailAddress
        if (!email) return null

        const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: user.id }
        })

        if (existingUser) {
            // Update if needed (optional, but keeps things in sync)
            if (existingUser.email !== email || existingUser.name !== name) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { email, name }
                })
                return existingUser
            }
            // Still sync metadata for existing users just in case
            const publicMetadata = user.publicMetadata as { role?: string, isBanned?: boolean } | undefined;
            console.log(`[Sync] Existing user role in DB: ${existingUser.role}, role in Clerk: ${publicMetadata?.role}`)
            
            if (publicMetadata?.role !== existingUser.role || publicMetadata?.isBanned !== existingUser.isBanned) {
                try {
                    const clerk = await import('@clerk/nextjs/server')
                    const client = await clerk.clerkClient()
                    await client.users.updateUserMetadata(user.id, {
                        publicMetadata: {
                            role: existingUser.role,
                            isBanned: existingUser.isBanned
                        }
                    })
                } catch (e) {
                    console.error("[Sync] Failed to update Clerk metadata:", e);
                }
            }
            return existingUser
        }

        // First user is ADMIN
        const userCount = await prisma.user.count()
        const role = userCount === 0 ? "ADMIN" : "USER"

        const newUser = await prisma.user.create({
            data: {
                id: user.id,
                email,
                name,
                role
            }
        })

        // Sync to Clerk metadata
        try {
            const clerk = await import('@clerk/nextjs/server')
            const client = await clerk.clerkClient()
            await client.users.updateUserMetadata(user.id, {
                publicMetadata: {
                    role: role,
                    isBanned: false
                }
            })
        } catch (metadataError) {
            console.error('Error updating Clerk metadata during sync:', metadataError)
        }

        return newUser
    } catch (error) {
        console.error("Error syncing user:", error)
        return null
    }
}
