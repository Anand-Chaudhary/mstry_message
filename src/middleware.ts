import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Public paths that don't require authentication
    const isPublicPath = 
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'

    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is not logged in and tries to access protected pages, redirect to sign-in
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)' // Protect all routes except Next.js system routes
    ]
}