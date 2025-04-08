import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth/login', '/api/auth'];
const AUTH_ROUTES = ['/auth/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso direto a arquivos estáticos
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') || 
      pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('next-auth.session-token')?.value;

  // Redirecionar para login se não autenticado
  if (!PUBLIC_ROUTES.includes(pathname) && !sessionToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar para dashboard se autenticado tentando acessar login
  if (AUTH_ROUTES.includes(pathname) && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)']
};