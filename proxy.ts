import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const path = req.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isLoginPage = path === "/login";

    // Not logged in, trying to access protected route
    if (!isLoggedIn && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Logged in but wrong role for admin routes 
    if (isAdminRoute && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Already logged in, trying to visit login page again
    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};