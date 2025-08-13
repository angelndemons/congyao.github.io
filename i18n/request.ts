import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from '../i18n';

export default getRequestConfig(async ({locale}) => {
  console.log('Request config - incoming locale:', locale);
  
  // Ensure locale is lowercase and valid
  const resolved = (locale ?? defaultLocale).toLowerCase() as (typeof locales)[number];
  console.log('Request config - resolved locale:', resolved);
  
  if (!locales.includes(resolved)) {
    console.log('Request config - invalid locale, using default:', defaultLocale);
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default
    };
  }
  
  console.log('Request config - loading messages for locale:', resolved);
  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default
  };
});
