import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { syncUser } from "@/lib/sync-user"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)",
  "/about(.*)",
  "/jesus(.*)",
  "/events(.*)",
  "/gallery(.*)",
  "/prayer(.*)",
  "/restricted(.*)",
])

const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  const { userId, redirectToSignIn } = await auth()
  const isApi = request.nextUrl.pathname.startsWith("/api/")

  if (!userId) {
    if (isApi) {
      return NextResponse.json({ error: "You need to sign in." }, { status: 401 })
    }
    return redirectToSignIn()
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isBanned: true },
    })

    if (!user) {
      await syncUser()
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isBanned: true },
      })
    }

    if (user?.isBanned) {
      if (isApi) {
        return NextResponse.json({ error: "This account is restricted." }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/restricted", request.url))
    }

    if (isAdminRoute(request) && user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch (error) {
    console.error("[Proxy] Failed to load user:", error)
    if (isApi) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
}
