// middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';
import type { NextRequestWithAuth } from 'next-auth/middleware';

// This function enhances the middleware with custom logic
export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    // Get the pathname of the requested page
    const path = request.nextUrl.pathname;

    // Get the token from the session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Define public routes that don't require authentication
    const publicRoutes = ['/', '/auth/signin', '/api/auth'];
    
    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) => 
      path.startsWith(route) || path === route
    );

    // Allow access to public routes without authentication
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Protected routes logic
    if (!token) {
      // If there's no token and trying to access protected route,
      // redirect to signin page with a return URL
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(signInUrl);
    }

    // Subscription check for premium routes
    if (path.startsWith('/premium')) {
      // You can add additional checks here for subscription status
      // Example: Check if user has active subscription
      const hasSubscription = token.subscriptionStatus === 'active';
      
      if (!hasSubscription) {
        // Redirect to subscription page if no active subscription
        return NextResponse.redirect(
          new URL('/subscription', request.url)
        );
      }
    }

    // If all checks pass, continue to the requested page
    return NextResponse.next();
  },
  {
    // Configure middleware options
    callbacks: {
      // Return true to allow the request to continue
      authorized: ({ token }) => !!token,
    },
    pages: {
      // Configure custom pages
      signIn: '/auth/signin',
      error: '/auth/error',
    },
  }
);

// Configure which routes to run middleware on
export const config = {
  // Define routes that should trigger the middleware
  matcher: [
    // Match all routes except public ones
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    // Specifically protect these routes
    '/dashboard/:path*',
    '/premium/:path*',
    '/api/protected/:path*',
  ],
};