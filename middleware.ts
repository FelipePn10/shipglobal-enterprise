import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

interface CustomJWT {
  id?: string;
  type?: "user" | "company";
  companyId?: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  }) as CustomJWT | null;

  const headers = new Headers(request.headers);

  // Rotas públicas
  const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth',
    '/test/public',
    '/_next/static',
    '/_next/image',
    '/favicon.ico'
  ];

  const isPublic = PUBLIC_ROUTES.some(route => 
    route === pathname || 
    pathname.startsWith(route)
  );

  if (isPublic) {
    return NextResponse.next({ request: { headers } });
  }

  // Rota de teste pública
  if (pathname === '/test/public') {
    return NextResponse.json({
      status: 'public',
      authenticated: !!token,
      userType: token?.type
    });
  }

  // Rota de teste protegida
  if (pathname === '/test/protected') {
    if (!token?.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      status: 'protected',
      user: {
        id: token.id,
        type: token.type,
        companyId: token.companyId
      }
    });
  }

  // Verificação de autenticação
  if (!token?.id) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Adiciona headers se autenticado
  headers.set('user-id', token.id);
  if (token.type === 'company' && token.companyId) {
    headers.set('company-id', token.companyId);
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)']
};