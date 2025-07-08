import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, we'll just allow all requests through
  // In a production app, you might want to check for JWT tokens in cookies
  // and validate them here for protected routes

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
