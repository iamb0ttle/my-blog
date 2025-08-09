'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [locale, setLocale] = useState<'ko' | 'en'>('ko')
  
  useEffect(() => {
    const browserLanguage = navigator.language
    const detectedLocale = browserLanguage.startsWith('en') ? 'en' : 'ko'
    setLocale(detectedLocale)
  }, [])

  const content = {
    ko: {
      title: '페이지를 찾을 수 없습니다',
      description: '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
      homeButton: '홈으로 돌아가기',
      backButton: '이전 페이지로',
      helpText: '찾고 계신 콘텐츠가 있으신가요?',
      searchText: '검색을 통해 원하는 게시글을 찾아보세요'
    },
    en: {
      title: 'Page Not Found',
      description: 'The page you are looking for might have been removed, moved, or is temporarily unavailable.',
      homeButton: 'Go Home',
      backButton: 'Go Back',
      helpText: 'Looking for specific content?',
      searchText: 'Use search to find the posts you want'
    }
  }

  const t = content[locale]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* 404 Numbers */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-muted-foreground/20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl md:text-2xl">BH</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {t.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Home className="h-4 w-4" />
            <span>{t.homeButton}</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-border bg-card text-card-foreground rounded-xl hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.backButton}</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            {t.helpText}
          </p>
          <Link
            href={`/${locale}`}
            className="text-primary hover:text-primary/80 underline underline-offset-4 text-sm font-medium"
          >
            {t.searchText}
          </Link>
        </div>
      </div>
    </div>
  )
}

