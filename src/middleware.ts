import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const isAuth = req.cookies.has("is-authenticated");
  const isLoginPage = req.nextUrl.pathname.match(/^\/(ar|en)\/login/) || req.nextUrl.pathname === '/login';

  if (!isAuth && !isLoginPage) {
    const localeMatch = req.nextUrl.pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  if (isAuth && isLoginPage) {
    const localeMatch = req.nextUrl.pathname.match(/^\/(ar|en)/);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
