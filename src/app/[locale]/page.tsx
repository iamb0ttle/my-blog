import { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/posts';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { StructuredData } from '@/components/StructuredData';
import type { Metadata } from 'next';
import { HomePageClient } from '@/components/HomePageClient';

interface HomePageProps {
  params: { locale: Locale };
}

export async function generateMetadata({ params: { locale } }: HomePageProps): Promise<Metadata> {
  const posts = await getAllPosts(locale);
  const latestPost = posts[0];
  const t = await getTranslations({ locale, namespace: 'site' });
  
  const title = t('title');
  const description = t('description');
  const baseUrl = t('baseUrl');
  const author = t('author');
  const ogImage = t('ogImage');
  
  const url = `${baseUrl}/${locale}`;
  
  const finalOgImage = latestPost?.featuredImage || ogImage;
  
  return {
    title,
    description,
    keywords: [
      'blog', 'development', 'programming', 'tech', 'coding',
      '블로그', '개발', '프로그래밍', '기술', '코딩', '엔지니어링'
    ],
    authors: [{ name: author }],
    openGraph: {
      title,
      description,
      url,
      siteName: title,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: `${title} - Technology Stories & Life`,
        },
      ],
    },
    alternates: {
      canonical: url,
      languages: {
        'ko': `${baseUrl}/ko`,
        'en': `${baseUrl}/en`,
      },
    },
  };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  setRequestLocale(locale);
  
  const posts = await getAllPosts(locale);

  return (
    <>
      <StructuredData type="website" locale={locale} />
      <HomePageClient locale={locale} posts={posts} />
    </>
  );
}