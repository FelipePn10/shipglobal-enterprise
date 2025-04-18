import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface CustomJWT {
  id?: string;
  type?: 'user' | 'company';
  companyId?: string;
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Get the token from the request
  if (process.env.NODE_ENV === 'development') {
    const headers = new Headers(request.headers);
    headers.set('user-id', 'dev-user-123');
    headers.set('user-type', 'user');
    return NextResponse.next({ request: { headers } });
  }

  // Rest of your existing middleware...
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  }) as CustomJWT | null;

  // Define public routes that don't require authentication
  const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/loginDevs',
    '/auth/register',
    '/api/auth',
    '/test/public',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
  ];

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Allow public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Handle test/public route
  if (pathname === '/test/public') {
    return NextResponse.json({
      status: 'public',
      authenticated: !!token,
      userType: token?.type ?? null,
    });
  }

  // Handle test/protected route
  if (pathname === '/test/protected') {
    if (!token?.id) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    return NextResponse.json({
      status: 'protected',
      user: {
        id: token.id,
        type: token.type,
        companyId: token.companyId ?? null,
      },
    });
  }

  // Redirect to login for unauthenticated users
  if (!token?.id) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Add custom headers for authenticated requests
  const headers = new Headers(request.headers);
  headers.set('user-id', token.id);
  if (token.type === 'company' && token.companyId) {
    headers.set('company-id', token.companyId);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};