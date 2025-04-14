import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl.pathname;

    // Ensure the auth() function is awaited
    const { userId } = await auth();

    console.log(userId); // Log userId for debugging

    // Protect /dashboard and sub-routes
    if (!userId && url.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    // Redirect authenticated users away from auth routes
    if (userId && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!.*\\..*|_next).*)",
        "/(api|trpc)(.*)",
        "/dashboard(.*)",
        "/",
        "/auth/sign-in",
        "/auth/sign-up",
    ],
};
