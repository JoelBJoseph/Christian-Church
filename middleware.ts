import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks/clerk", "/events(.*)", "/photos(.*)", "/videos(.*)", "/prayer(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
        return (await auth()).redirectToSignIn();
    }

    const publicMetadata = sessionClaims?.metadata as { role?: string, isBanned?: boolean } | undefined;
    const role = publicMetadata?.role;
    const isBanned = publicMetadata?.isBanned;

    if (isAdminRoute(request)) {
      if (role !== "ADMIN" || isBanned) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    
    // Check if user is banned for any protected route
    if (isBanned) {
      return (await auth()).redirectToSignIn(); // Or a custom banned page
    }

    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
