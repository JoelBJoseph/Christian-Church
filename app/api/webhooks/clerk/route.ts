import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    console.error('CRITICAL: SIGNING_SECRET is missing from environment variables.')
    console.log('To fix this, go to Clerk Dashboard -> Webhooks -> [Your Webhook] and copy the "Signing Secret".')
    console.log('Then add it to your .env file as SIGNING_SECRET=whsec_...')
    return new Response('Error: SIGNING_SECRET is missing. Check server logs for instructions.', { status: 500 })
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification failed', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type
  console.log(`Webhook received: ${eventType} for user ${id}`)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0].email_address
    const name = `${first_name ?? ''} ${last_name ?? ''}`.trim()

    console.log(`Syncing user in DB: ${id} (${email})`)
    
    // For user.created, we might want to set the role
    // For user.updated, we probably don't want to overwrite it if it's already ADMIN
    
    const userCount = await prisma.user.count()
    const role = userCount === 0 ? 'ADMIN' : 'USER'
    
    const existingUser = await prisma.user.findUnique({
      where: { id: id as string }
    })

    const finalRole = existingUser?.role || role
    const finalIsBanned = existingUser?.isBanned || false

    await prisma.user.upsert({
      where: { id: id as string },
      create: {
        id: id as string,
        email,
        name,
        role: finalRole,
      },
      update: {
        email,
        name,
      },
    })

    // Also sync to Clerk metadata for middleware access
    try {
      const clerk = await import('@clerk/nextjs/server')
      const client = await clerk.clerkClient()
      await client.users.updateUserMetadata(id as string, {
        publicMetadata: {
          role: finalRole,
          isBanned: finalIsBanned
        }
      })
    } catch (metadataError) {
      console.error('Error updating Clerk metadata:', metadataError)
    }
    console.log(`User synced successfully: ${id}`)
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    console.log(`Deleting user from DB: ${id}`)
    try {
      await prisma.user.delete({
        where: { id: id as string },
      })
      console.log(`User deleted successfully: ${id}`)
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
      // If user not found, that's fine
    }
  }

  return new Response('Webhook received', { status: 200 })
}
