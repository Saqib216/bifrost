import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const path = req.nextUrl.pathname;

    const isAdminRoute = path.startsWith("/admin");
    const isEmployeeRoute = path.startsWith("/employee");
    const isLoginPage = path === "/login";
    const isSignupPage = path === "/signup";

    // Not logged in, trying to access protected route
    if (!isLoggedIn && (isAdminRoute || isEmployeeRoute)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Logged in but wrong role for admin routes
    if (isAdminRoute && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL("/employee", req.url));
    }

    // Logged in but wrong role for employee routes
    if (isEmployeeRoute && userRole !== 'EMPLOYEE') {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Already logged in, trying to visit /login or root '/'
    if (isLoggedIn && (isLoginPage || isSignupPage || path === '/')) {
        const redirectPath = userRole === 'ADMIN' ? '/admin' : '/employee';
        return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};