import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const publicRoutes = ['/auth/login', '/error']
  const protectedRoutes = ['/profile']
  let isPublicRoute = false;

  publicRoutes.map((route) => {
    if (request.nextUrl.pathname.startsWith(route)) {
      isPublicRoute = true;
    }
  });

  if (request.nextUrl.pathname == '/') {
    isPublicRoute = true
  }

  if (isPublicRoute) {
    return NextResponse.next()
  } else {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

    let isProtectedRoute = false;

    protectedRoutes.map((route) => {
      if (request.nextUrl.pathname.startsWith(route)) {
        isProtectedRoute = true;
      }
    });

    if (isProtectedRoute) {
      return NextResponse.next()
    }
    
    // Check the role and redirect based on the role
    switch (token.role) {
      case 'member':
        if (!request.nextUrl.pathname.startsWith("/member")) {
          return NextResponse.redirect(new URL("/error/unauthorized", request.url));
        }
        break;
      case 'vip':
        if (!request.nextUrl.pathname.startsWith("/vip")) {
          return NextResponse.redirect(new URL("/error/unauthorized", request.url));
        }
        break;
        case 'admin':
          if (!request.nextUrl.pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/error/unauthorized", request.url));
          }
          break;
      default:
        return NextResponse.redirect(new URL("/error/unauthorized", request.url));
    }
  }
}

export const config = {
  matcher: [
    // Match all routes except the ones that start with /login and api and the static folder
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|uploads).*)',
  ],
};