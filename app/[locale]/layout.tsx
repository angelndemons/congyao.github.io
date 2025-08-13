import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales} from '../../i18n';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = locale.toLowerCase();
  if (resolvedLocale === 'zh') {
    return {
      title: '姚丛 - 美国律师（知识产权、协议、人工智能）',
      description: '专注于知识产权，协议和人工智能的美国律师'
    };
  }
  return {
    title: 'Cong Yao - Biotech Attorney',
    description: 'Biotech Attorney Specializing in IP, Agreements, and AI'
  };
}

export default async function LocaleLayout(
  {children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}
) {
  const {locale} = await params;
  
  // Validate locale and ensure it's lowercase
  const resolvedLocale = locale.toLowerCase();
  if (!locales.includes(resolvedLocale as (typeof locales)[number])) {
    notFound();
  }

  // Set the request locale so message loading resolves correctly
  setRequestLocale(resolvedLocale);

  // Load messages explicitly based on the resolved locale
  const messages = (await import(`../../messages/${resolvedLocale}.json`)).default;

  return (
    <html lang={resolvedLocale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={resolvedLocale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
