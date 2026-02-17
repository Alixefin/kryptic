import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Convex handles auth client-side via ConvexAuthProvider.
// Middleware only handles basic route rewrites if needed.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
