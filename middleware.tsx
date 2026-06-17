import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // полный путь куда хотел пользователь
    const redirectTo = pathname + search;

    // берём именно access_token
    const accessToken = request.cookies.get("access_token")?.value;

    // если нет токена → редирект на логин
    if (!accessToken) {
        const loginUrl = new URL("/auth/login", request.url);

        loginUrl.searchParams.set("redirect", redirectTo);

        console.log("🔒 No token → redirect:", redirectTo);

        // return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/students/:path*", "/teaching/lessonView/:path*"],
};
