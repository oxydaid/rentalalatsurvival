import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'
  const session = request.cookies.get('admin_session')

  if (isAdminPath && !isLoginPath && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginPath && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: '/admin/:path*',
}
