import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { setUserPublicMetadata } from '@/lib/clerk'

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

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses?.[0]?.email_address
    if (!id || !email) {
      return new Response('Webhook received', { status: 200 })
    }

    const name = `${first_name ?? ''} ${last_name ?? ''}`.trim()
    const userId = id

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    const userCount = existingUser ? 1 : await prisma.user.count()
    const role = existingUser?.role ?? (userCount === 0 ? 'ADMIN' : 'USER')
    const isBanned = existingUser?.isBanned ?? false

    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        name,
        role,
        isBanned,
      },
      update: {
        email,
        name,
      },
    })

    try {
      await setUserPublicMetadata(userId, { role, isBanned })
    } catch (metadataError) {
      console.error('[Clerk Webhook] Error updating metadata:', metadataError)
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
      try {
        await prisma.user.delete({
          where: { id },
        })
      } catch (error) {
        const missing =
          typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2025'
        if (!missing) {
          console.error(`[Webhook] Error deleting user ${id}:`, error)
        }
      }
    }
  }

  return new Response('Webhook received', { status: 200 })
}
