import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['ko', 'en'] as const;
export const defaultLocale = 'ko' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default
  };
});