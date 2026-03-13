import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtectedAdminRoute = pathname.startsWith('/admin');

  if (isProtectedAdminRoute) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Redirect to login if no token is present
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
