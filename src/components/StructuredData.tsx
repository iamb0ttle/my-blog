import { Post } from '@/lib/posts'
import { Locale } from '@/lib/i18n'

interface StructuredDataProps {
  type: 'website' | 'article' | 'profile'
  locale: Locale
  post?: Post
}

export function StructuredData({ type, locale, post }: StructuredDataProps) {
  const baseUrl = 'https://dev.iambottle.site'
  const siteTitle = 'B(H)log'
  const siteDescription = locale === 'ko'
    ? 'Dev Stories & Life - 개발 이야기와 일상'
    : 'Dev Stories & Life - A blog sharing development stories and daily life'
  
  let structuredData: any = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      structuredData = {
        ...structuredData,
        '@type': 'WebSite',
        name: siteTitle,
        description: siteDescription,
        url: `${baseUrl}/${locale}`,
        author: {
          '@type': 'Person',
          name: '나병현',
          url: `${baseUrl}/${locale}/about`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/${locale}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
      break

    case 'article':
      if (post) {
        const articleStructured: any = {
          ...structuredData,
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt || post.content.slice(0, 160).replace(/[#*`]/g, ''),
          url: `${baseUrl}/${locale}/post/${post.slug}`,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            '@type': 'Person',
            name: '나병현',
            url: `${baseUrl}/${locale}/about`,
          },
          publisher: {
            '@type': 'Organization',
            name: siteTitle,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/og-image.svg`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/${locale}/post/${post.slug}`,
          },
          keywords: post.tags?.join(', '),
        }

        if (post.featuredImage) {
          articleStructured.image = {
            '@type': 'ImageObject',
            url: post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`,
            width: 1200,
            height: 630,
          }
        }

        structuredData = articleStructured
      }
      break

    case 'profile':
      structuredData = {
        ...structuredData,
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'B(H)log',
          description: locale === 'ko' 
            ? '웹 개발과 사용자 경험에 열정을 가진 풀스택 개발자'
            : 'Full-stack developer passionate about web development and user experience',
          url: `${baseUrl}/${locale}/about`,
          jobTitle: locale === 'ko' ? '풀스택 개발자' : 'Full-stack Developer',
          knowsAbout: [
            'JavaScript',
            'TypeScript', 
            'React',
            'Next.js',
            'Node.js',
            'Web Development',
          ],
        },
      }
      break
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}