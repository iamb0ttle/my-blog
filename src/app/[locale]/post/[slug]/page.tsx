import { notFound } from 'next/navigation';
import { PostContent } from '@/components/PostContent';
import { Sidebar } from '@/components/Sidebar';
import { getPost, getAllPosts } from '@/lib/posts';
import { locales, Locale } from '@/lib/i18n';
import { Giscus } from '@/components/Giscus';
import { FooterServer } from '@/components/FooterServer';
import { StructuredData } from '@/components/StructuredData';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

interface PostPageProps {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const paths: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    posts.forEach((post) => {
      paths.push({
        locale,
        slug: post.slug,
      });
    });
  }

  return paths;
}

export async function generateMetadata({ params: { locale, slug } }: PostPageProps): Promise<Metadata> {
  const post = await getPost(locale, slug);
  
  if (!post) {
    return {
      title: 'Post Not Found - B(H)log',
    };
  }

  const baseUrl = 'https://dev.iambottle.site';
  const siteTitle = 'B(H)log';
  const author = '나병현';
  const url = `${baseUrl}/${locale}/post/${slug}`;
  const ogImage = post.featuredImage 
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`)
    : `${baseUrl}/og-post-image.svg`;
  
  return {
    title: `${post.title} - ${siteTitle}`,
    description: post.excerpt || post.content.slice(0, 160).replace(/[#*`]/g, ''),
    keywords: post.tags || [],
    authors: [{ name: author }],
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160).replace(/[#*`]/g, ''),
      url,
      siteName: siteTitle,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [author],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: url,
      languages: {
        'ko': `${baseUrl}/ko/post/${slug}`,
        'en': `${baseUrl}/en/post/${slug}`,
      },
    },
  };
}

export default async function PostPage({ params: { locale, slug } }: PostPageProps) {
  setRequestLocale(locale);
  
  const post = await getPost(locale, slug);
  const allPosts = await getAllPosts(locale);

  if (!post) {
    notFound();
  }

  return (
    <>
      <StructuredData type="article" locale={locale} post={post} />
      <div className="flex bg-background">
        <div className="flex-shrink-0 sticky top-0 h-screen overflow-hidden">
          <Sidebar locale={locale} posts={allPosts} />
        </div>
        <main className="flex-1 min-w-0">
          <PostContent post={post} locale={locale} />
          <div className="max-w-4xl mx-auto px-4 md:px-6 pt-2 pb-4">
            <Giscus locale={locale} />
          </div>
          <FooterServer locale={locale} />
        </main>
      </div>
    </>
  );
}