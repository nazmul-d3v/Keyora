import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL('/login', req.url);
  const response = NextResponse.redirect(url);

  // Expire any existing NextAuth cookies
  response.cookies.set('next-auth.session-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('__Secure-next-auth.session-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('next-auth.csrf-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('next-auth.callback-url', '', { maxAge: 0, path: '/' });

  return response;
}
