import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // skip api, admin, Next internals and files with an extension
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)']
};