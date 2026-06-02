import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    const sessionCookie =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const protectedRoutes = ["/dashboard", "/wallet"];
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Redirect ke login jika belum login dan akses halaman protected
    if (isProtected && !sessionCookie) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect ke dashboard jika sudah login dan akses halaman login
    if (pathname === "/" && sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/wallet/:path*"],
};

