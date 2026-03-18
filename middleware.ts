import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const auth = request.headers.get('authorization')

    if (auth) {
      const [, base64] = auth.split(' ')
      const [user, password] = atob(base64).split(':')
      const adminUser = process.env.ADMIN_USER || 'admin'
      const adminPass = process.env.ADMIN_PASSWORD

      if (adminPass && user === adminUser && password === adminPass) {
        return NextResponse.next()
      }
    }

    return new NextResponse('Acceso no autorizado', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Spider-World Admin"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
