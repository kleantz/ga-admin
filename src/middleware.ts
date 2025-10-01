import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login'
  
  // Get the token from cookies (TODO: implement real authentication)
  const token = request.cookies.get('auth-token')?.value || ''
  
  // Redirect authenticated users away from login page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Redirect unauthenticated users to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)',
  ],
}

