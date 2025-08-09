import { Post } from '@/lib/posts'
import { Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'

interface StructuredDataProps {
  type: 'website' | 'article' | 'profile'
  locale: Locale
  post?: Post
}

export async function StructuredData({ type, locale, post }: StructuredDataProps) {
  const tSite = await getTranslations('site')
  const tAbout = await getTranslations('about')
  const tContact = await getTranslations('contact')

  const baseUrl = tSite('baseUrl')            
  const siteTitle = tSite('title')            
  const siteDescription = tSite('description')
  const authorName = tSite('author')          
  const ogImage = tSite('ogImage')            

  let structuredData: any = {
    '@context': 'https://schema.org',
    inLanguage: locale,
  }

  switch (type) {
    case 'website': {
      structuredData = {
        ...structuredData,
        '@type': 'WebSite',
        name: siteTitle,
        description: siteDescription,
        url: `${baseUrl}/${locale}`,
        author: {
          '@type': 'Person',
          name: authorName,
          url: `${baseUrl}/${locale}/about`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/${locale}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
      break
    }

    case 'article': {
      if (post) {
        const description =
          post.excerpt ||
          post.content.slice(0, 160).replace(/[#*`]/g, '')

        structuredData = {
          ...structuredData,
          '@type': 'BlogPosting',
          headline: post.title,
          description,
          url: `${baseUrl}/${locale}/post/${post.slug}`,
          datePublished: post.date,
          dateModified: post.date,
          author: {
            '@type': 'Person',
            name: authorName,
            url: `${baseUrl}/${locale}/about`,
          },
          publisher: {
            '@type': 'Organization',
            name: siteTitle,
            logo: {
              '@type': 'ImageObject',
              url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/${locale}/post/${post.slug}`,
          },
          keywords: post.tags?.join(', '),
          image: post.featuredImage
            ? {
                '@type': 'ImageObject',
                url: post.featuredImage.startsWith('http')
                  ? post.featuredImage
                  : `${baseUrl}${post.featuredImage}`,
                width: 1200,
                height: 630,
              }
            : undefined,
        }
      }
      break
    }

    case 'profile': {
      
      const bio = tAbout('bio')
      structuredData = {
        ...structuredData,
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: authorName,
          description: bio,
          url: `${baseUrl}/${locale}/about`,
          sameAs: [
            tContact('github'),
            tContact('linkedin'),
            `mailto:${tContact('email')}`,
          ],
        },
      }
      break
    }
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
