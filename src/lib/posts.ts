import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Locale } from './i18n'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  content: string
  readingTime: number
  featuredImage?: string
}

const postsDirectory = path.join(process.cwd(), 'content')

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export async function getAllPosts(locale: Locale): Promise<Post[]> {
  const localeDirectory = path.join(postsDirectory, locale)
  
  if (!fs.existsSync(localeDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(localeDirectory)
  
  const posts = fileNames
    .filter(name => name.endsWith('.mdx'))
    .map(name => {
      const slug = name.replace(/\.mdx$/, '')
      const post = getPostSync(locale, slug)
      return post
    })
    .filter(Boolean) as Post[]

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(locale: Locale, slug: string): Promise<Post | null> {
  return getPostSync(locale, slug)
}

function getPostSync(locale: Locale, slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, locale, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt,
      tags: data.tags || [],
      content,
      readingTime: calculateReadingTime(content),
      featuredImage: data.featuredImage
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

