import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Locale } from '@/lib/i18n';
import { Sidebar } from '@/components/Sidebar';
import { getAllPosts } from '@/lib/posts';
import { AboutContent } from '@/components/AboutContent';
import { StructuredData } from '@/components/StructuredData';
import type { Metadata } from 'next';

interface AboutPageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const siteT = await getTranslations({ locale, namespace: 'site' });
  const aboutT = await getTranslations({ locale, namespace: 'about' });
  
  const siteTitle = siteT('title');
  const baseUrl = 'https://blog.iambottle.site'; // Hard-coded to ensure consistency
  
  const title = `${aboutT('title')} - ${siteTitle}`;
  const description = aboutT('description');
  const url = `${baseUrl}/${locale}/about`;
  
  return {
    title,
    description,
    openGraph: {
      title: aboutT('title'),
      description,
      url,
      siteName: siteTitle,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'profile',
      images: [
        {
          url: `${baseUrl}/og-about-image.svg`,
          width: 1200,
          height: 630,
          alt: `${aboutT('title')} ${siteTitle}`,
          type: 'image/svg+xml',
        },
      ],
    },
    alternates: {
      canonical: url,
      languages: {
        'ko': `${baseUrl}/ko/about`,
        'en': `${baseUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  setRequestLocale(locale);
  
  const allPosts = await getAllPosts(locale);

  return (
    <>
      <StructuredData type="profile" locale={locale} />
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar locale={locale} posts={allPosts} />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <AboutContent locale={locale} />
        </main>
      </div>
    </>
  );
}