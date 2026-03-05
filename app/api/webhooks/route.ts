import { headers } from "next/headers"
import { Webhook } from "svix"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
    const payload = await req.text()
    const headerList = await headers()

    const svix_id = headerList.get("svix-id")
    const svix_timestamp = headerList.get("svix-timestamp")
    const svix_signature = headerList.get("svix-signature")

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing headers", { status: 400 })
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

    let event: any

    try {
        event = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        })
    } catch (err) {
        return new Response("Invalid signature", { status: 400 })
    }

    // Handle user creation
    if (event.type === "user.created") {
        const user = event.data

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANT
        )

        await supabase.from("users").upsert({
            clerk_id: user.id,
            email: user.email_addresses[0].email_address,
            role: "normal_user",
        })
    }

    return new Response("OK", { status: 200 })
}