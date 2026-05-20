import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/auth/login'];
const AUTH_COOKIE = 'auth_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/dashboard/issues', request.url));
  }

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
