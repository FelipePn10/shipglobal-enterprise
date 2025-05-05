// import { NextResponse, type NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// interface CustomJWT {
//   id?: string;
//   type?: 'user' | 'company';
//   companyId?: string | null;
//   email?: string | null;
//   name?: string | null;
// }

// export async function middleware(request: NextRequest) {
//   const { pathname, origin } = request.nextUrl;

//   // Modo de desenvolvimento - atalho para testes
//   if (process.env.NODE_ENV === 'development') {
//     const devHeaders = new Headers(request.headers);
//     devHeaders.set('user-id', 'dev-user-123');
//     devHeaders.set('user-type', 'user');
//     return NextResponse.next({ request: { headers: devHeaders } });
//   }

//   // Obtém o token do next-auth
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//     secureCookie: process.env.NODE_ENV === 'production',
//   }) as CustomJWT | null;

//   // Rotas públicas que não requerem autenticação
//   const PUBLIC_ROUTES = [
//     '/',
//     '/auth/login',
//     '/auth/register',
//     '/auth/error',
//     '/api/auth', // Covers /api/auth/register-user
//     '/_next/static',
//     '/_next/image',
//     '/favicon.ico',
//   ];

//   const isPublicRoute = PUBLIC_ROUTES.some(route => 
//     pathname === route || pathname.startsWith(route)
//   );

//   // Permite acesso a rotas públicas
//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   // Redireciona usuários não autenticados para o login
//   if (!token?.id) {
//     const loginUrl = new URL('/auth/login', origin);
//     loginUrl.searchParams.set('callbackUrl', pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Adiciona cabeçalhos personalizados para HAPPENEDrequisições autenticadas
//   const headers = new Headers(request.headers);
//   headers.set('user-id', token.id);
//   headers.set('user-type', token.type || 'user');

//   if (token.type === 'user' && token.companyId) {
//     headers.set('company-id', token.companyId);
//   }

//   if (token.type === 'company') {
//     headers.set('company-id', token.id);
//   }

//   if (pathname.startsWith('/dashboard/company') && token.type !== 'company') {
//     return NextResponse.redirect(new URL('/dashboard', origin));
//   }

//   if (pathname.startsWith('/dashboard/admin') && token.type !== 'user') {
//     return NextResponse.redirect(new URL('/dashboard', origin));
//   }

//   return NextResponse.next({ request: { headers } });
// }

// export const config = {
//   matcher: [
//     '/((?!api/trpc|_next/static|_next/image|favicon.ico|public).*)',
//   ],
// };