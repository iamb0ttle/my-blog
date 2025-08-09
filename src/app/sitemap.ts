import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { locales } from '@/lib/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.iambottle.site'
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/ko`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ko/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly', 
      priority: 0.8,
    },
  ]

  const postPages: MetadataRoute.Sitemap = []
  
  for (const locale of locales) {
    const posts = await getAllPosts(locale)
    
    posts.forEach((post) => {
      postPages.push({
        url: `${baseUrl}/${locale}/post/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  }

  return [...staticPages, ...postPages]
}