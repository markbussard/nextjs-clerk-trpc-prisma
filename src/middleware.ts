import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/signin',
    '/signup',
    '/reset-password',
    '/api/webhooks/clerk/user'
  ],
  afterAuth: async (auth, req) => {
    const url = new URL(req.url);
    if (!auth.userId && !auth.isPublicRoute) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    } else if (auth.userId && auth.isPublicRoute) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set('x-url', url.toString());
    requestHeaders.set('x-origin', url.origin);
    requestHeaders.set('x-pathname', url.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)']
};
