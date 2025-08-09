'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Send, X, TrendingUp, Clock, Tag, BookOpen, Sparkles, Filter } from 'lucide-react'
import { Locale } from '@/lib/i18n'
import { Post } from '@/lib/posts'
import { searchPosts, SearchResult, highlightText, getSearchSnippet } from '@/lib/search'
import { Footer } from './Footer'
import Image from 'next/image';
import Link from 'next/link'

interface ChatInterfaceProps {
  locale: Locale
  posts: Post[]
}

type ViewMode = 'recent' | 'popular' | 'all'
type SortBy = 'date' | 'title' | 'readingTime'

export function ChatInterface({ locale, posts }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('recent')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations('home')

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])))
  
  // Filter and sort posts based on current settings
  const filteredPosts = posts
    .filter(post => {
      if (selectedTags.length === 0) return true
      return selectedTags.some(tag => post.tags?.includes(tag))
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'readingTime':
          return (a.readingTime || 0) - (b.readingTime || 0)
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

  // Get posts based on view mode
  const getDisplayPosts = () => {
    switch (viewMode) {
      case 'recent':
        return filteredPosts.slice(0, 6)
      case 'popular':
        // Note: Popularity might be better based on a different metric, but using readingTime as a proxy
        return [...filteredPosts].sort((a, b) => (b.readingTime || 0) - (a.readingTime || 0)).slice(0, 6)
      case 'all':
        return filteredPosts
      default:
        return filteredPosts.slice(0, 6)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      performSearch(message.trim())
    }
  }

  const performSearch = useCallback((query: string) => {
    setIsSearching(true)
    const results = searchPosts(posts, query)
    setSearchResults(results)
  }, [posts])

  const clearSearch = () => {
    setMessage('')
    setSearchResults([])
    setIsSearching(false)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSelectedTags([])
    // Optionally reset view and sort as well
    // setViewMode('recent')
    // setSortBy('date')
  }

  // Focus search input with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Perform search as user types (debounced)
  useEffect(() => {
    const query = message.trim();
    if (!query) {
        // Only clear results if the user has cleared the input
        if (isSearching) {
            setSearchResults([]);
            setIsSearching(false);
        }
        return;
    }

    const timeoutId = setTimeout(() => {
        performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [message, posts, isSearching, performSearch]);

  return (
    <div className="flex flex-col h-full">
      {/* Simple ChatGPT-style Interface */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-foreground mb-2">
              {locale === 'ko' ? '무엇을 찾고 계신가요?' : 'What are you working on?'}
            </h1>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              <input
                ref={searchInputRef}
                type="text"
                placeholder={locale === 'ko' ? '무엇이든 물어보세요' : 'Ask anything'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label={locale === 'ko' ? '블로그 검색' : 'Search blog'}
                aria-describedby="search-shortcut"
                className="w-full h-14 px-6 pr-16 rounded-2xl border border-border bg-card text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent theme-transition shadow-sm"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                aria-label={locale === 'ko' ? '검색하기' : 'Search'}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center theme-transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {isSearching && searchResults.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result) => (
                <Link
                  key={result.slug}
                  href={`/${locale}/post/${result.slug}`}
                  className="group block p-6 rounded-2xl border border-border hover:border-primary/50 bg-card hover:shadow-lg theme-transition"
                >
                  {result.featuredImage && (
                    <div className="mb-4 -mx-6 -mt-6">
                      <Image
                        src={result.featuredImage}
                        alt={result.title}
                        className="w-full h-40 object-cover rounded-t-2xl"
                        width={500} // Adjust width as needed
                        height={160} // Matches h-40 (40 * 4 for approximate pixel value)
                      />
                    </div>
                  )}
                  <h3 
                    className="font-semibold text-lg mb-2 group-hover:text-primary theme-transition line-clamp-2" 
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.title, message) 
                    }}
                  />
                  <p 
                    className="text-muted-foreground text-sm mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(
                        getSearchSnippet(result.content, message), 
                        message
                      ) 
                    }}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(result.date).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}</span>
                    {result.readingTime && (
                      <span>
                        {locale === 'ko' ? `${result.readingTime}분 읽기` : `${result.readingTime}min read`}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {isSearching && searchResults.length === 0 && message.trim() && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {locale === 'ko' 
                ? `"${message}"에 대한 검색 결과가 없습니다.`
                : `No results found for "${message}".`
              }
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer locale={locale} />
    </div>
  )
}