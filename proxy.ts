import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)", 
  "/api/webhooks/clerk", 
  "/events(.*)", 
  "/photos(.*)", 
  "/videos(.*)", 
  "/prayer(.*)",
  "/favicon.ico"
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export const proxyMiddleware = async (auth: any, request: any) => {
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  
  console.log(`[Proxy] Path: ${request.nextUrl.pathname}, UserID: ${userId}`);
  
  if (!userId) {
    return (await auth()).redirectToSignIn();
  }

  const publicMetadata = sessionClaims?.metadata as { role?: string, isBanned?: boolean } | undefined;
  const role = publicMetadata?.role;
  const isBanned = publicMetadata?.isBanned;

  console.log(`[Proxy] Role: ${role}, IsBanned: ${isBanned}`);

  if (isBanned) {
    return (await auth()).redirectToSignIn();
  }

  if (isAdminRoute(request)) {
    if (role !== "ADMIN") {
      console.log(`[Proxy] Access Denied for /admin: Role is ${role}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export default clerkMiddleware(async (auth, request) => {
  return proxyMiddleware(auth, request);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
