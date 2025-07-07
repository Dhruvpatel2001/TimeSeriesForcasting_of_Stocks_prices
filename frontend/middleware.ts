import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Get authentication status and role from cookies
  const isAuthenticated = req.cookies.get('isAuthenticated')?.value === 'true';
  const userRole = req.cookies.get('userRole')?.value;

  // Allow access to auth page if not authenticated
  if (req.nextUrl.pathname === '/auth') {
    if (isAuthenticated) {
      const redirectUrl = new URL(
        userRole === 'admin' ? '/admin/dashboard' : '/dashboard',
        req.url
      );
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Redirect root to auth if not authenticated, or to appropriate dashboard if authenticated
  if (req.nextUrl.pathname === '/') {
    if (isAuthenticated) {
      const redirectUrl = new URL(
        userRole === 'admin' ? '/admin/dashboard' : '/dashboard',
        req.url
      );
      return NextResponse.redirect(redirectUrl);
    } else {
      const redirectUrl = new URL('/auth', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/chart', '/insights', '/sentiment', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Check authentication for protected routes
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/auth', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && userRole !== 'admin') {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};