import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

// Match all non-static, non-API routes
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
