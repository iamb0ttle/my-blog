'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X, Mail, ExternalLink, ChevronLeft, ChevronRight, Home, Github, Linkedin, ChevronDown, ChevronUp } from 'lucide-react'
import { Locale } from '@/lib/i18n'
import { Post } from '@/lib/posts'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import Image from 'next/image'
import Link from 'next/link'

interface SidebarProps {
  locale: Locale
  posts: Post[]
  onMobileToggle?: (isOpen: boolean) => void
}

const MIN_WIDTH = 240
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 320
const COLLAPSED_WIDTH = 64 // 4rem

export function Sidebar({ locale, posts, onMobileToggle }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())
  const sidebarRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('sidebar')

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebar-width')
    const savedCollapsed = localStorage.getItem('sidebar-collapsed') === 'true'

    setIsCollapsed(savedCollapsed)

    if (savedWidth && !savedCollapsed) {
      const width = parseInt(savedWidth, 10)
      setSidebarWidth(Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH)))
    }

    if (posts.length > 0) {
      const latestYear = new Date(Math.max(...posts.map(post => new Date(post.date).getTime()))).getFullYear().toString()
      setExpandedYears(new Set([latestYear]))
    }

    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [posts])

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    localStorage.setItem('sidebar-collapsed', String(newCollapsedState))
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile || isCollapsed) return
    e.preventDefault()
    setIsDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [isMobile, isCollapsed])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const newWidth = e.clientX

    const clampedWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH))
    setSidebarWidth(clampedWidth)
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''


      if (sidebarRef.current) {
        localStorage.setItem('sidebar-width', sidebarRef.current.style.width)
      }
    }
  }, [isDragging])


  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  
  const postsByYearAndMonth = posts.reduce((acc, post) => {
    const date = new Date(post.date)
    const year = date.getFullYear().toString()
    const month = date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', { 
      month: 'long' 
    })
    const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!acc[year]) acc[year] = {}
    if (!acc[year][monthKey]) acc[year][monthKey] = { name: month, posts: [] }
    acc[year][monthKey].posts.push(post)
    return acc
  }, {} as Record<string, Record<string, { name: string, posts: Post[] }>>)


  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev)
      if (newSet.has(year)) {
        newSet.delete(year)
        setExpandedMonths(prevMonths => {
          const newMonthSet = new Set(prevMonths)
          Object.keys(postsByYearAndMonth[year] || {}).forEach(monthKey => {
            newMonthSet.delete(monthKey)
          })
          return newMonthSet
        })
      } else {
        newSet.add(year)
      }
      return newSet
    })
  }

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev)
      if (newSet.has(monthKey)) {
        newSet.delete(monthKey)
      } else {
        newSet.add(monthKey)
      }
      return newSet
    })
  }

  const toggleMobileSidebar = () => {
    const newState = !isMobileOpen
    setIsMobileOpen(newState)
    onMobileToggle?.(newState)
    
    // Add/remove class from body for CSS-based push effect
    if (typeof document !== 'undefined') {
      if (newState) {
        document.body.classList.add('sidebar-mobile-open')
      } else {
        document.body.classList.remove('sidebar-mobile-open')
      }
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-background border border-border shadow-sm"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>


      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          flex-shrink-0 h-full 
          bg-background border-r border-border
          flex flex-col
          absolute md:static top-0 left-0 z-50
          ${isMobile ? 'h-full' : ''}
          transform transition-transform duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isMobile && !isCollapsed ? 'w-80' : ''}
        `}
        style={{
          width: isMobile ? undefined : (isCollapsed ? `${COLLAPSED_WIDTH}px` : `${sidebarWidth}px`),
          transition: 'width 0.15s ease-out',
        }}
      >
        {/* Contents inside Sidebar */}
        <div className="flex flex-col h-full overflow-hidden">
          {isCollapsed ? (
            /* --- Collapsed State --- */
            <div className="flex flex-col items-center justify-between h-full py-4">
               <div>
                  <Link
                    href={`/${locale}`}
                    className="p-3 block rounded-lg hover:bg-accent theme-transition"
                    title={locale === 'ko' ? '홈으로 가기' : 'Go to home'}
                  >
                    <Home className="h-5 w-5" />
                  </Link>
                </div>
                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-lg bg-background border border-border shadow-sm hover:bg-accent theme-transition"
                    title={locale === 'ko' ? '사이드바 펼치기' : 'Expand sidebar'}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-center space-y-2">
                    <ThemeToggle />
                    <LanguageToggle currentLocale={locale} hideText={true} />
                </div>
            </div>
          ) : (
            /* --- Expanded State --- */
            <>
              {/* Desktop Collapse Button */}
              <button
                onClick={toggleCollapse}
                className="hidden md:block absolute -right-3 top-6 z-10 p-1 rounded-full bg-background border border-border shadow-sm hover:bg-accent"
                title={locale === 'ko' ? '사이드바 접기' : 'Collapse sidebar'}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Logo and Blog Title */}
              <div className="flex-shrink-0 p-4">
                <Link
                  href={`/${locale}`}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/logo-black.svg"
                      alt="B(H)log Logo"
                      className="w-8 h-8 block dark:hidden"
                      width={32}
                      height={32}
                    />
                    <Image
                      src="/logo-white.svg"
                      alt="B(H)log Logo"
                      className="w-8 h-8 hidden dark:block"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">B(H)log</h1>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'ko' ? '기술적인 이야기와 일상' : 'Technology Stories & Life'}
                    </p>
                  </div>
                </Link>
              </div>

              {/* Menu Items */}
              <div className="flex-shrink-0 px-3 pb-4 space-y-1">
                <Link href={`/${locale}/about`} className="flex items-center space-x-3 text-sm font-medium hover:bg-accent rounded-lg p-2 theme-transition">
                  <span>{t('about')}</span>
                </Link>
                <div className="flex items-center justify-between p-2">
                  <span className="text-xs text-muted-foreground font-medium">Settings</span>
                  <div className="flex items-center space-x-1"><ThemeToggle /><LanguageToggle currentLocale={locale} /></div>
                </div>
              </div>

              <div className="h-4"></div>
              <div className="flex-shrink-0 px-4 py-2 border-y border-border">
                <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Chats</h2>
              </div>
              
              {/* Posts List */}
              <div className="flex-1 overflow-y-auto p-4 sidebar-scroll">
                <div className="space-y-3">
                  {Object.entries(postsByYearAndMonth)
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))
                    .map(([year, months]) => (
                      <div key={year} className="space-y-2">
                        {/* Year Header - Collapsible */}
                        <button
                          onClick={() => toggleYear(year)}
                          className="flex items-center justify-between w-full text-left p-2 rounded-lg hover:bg-accent/50 theme-transition group"
                          aria-expanded={expandedYears.has(year)}
                        >
                          <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                            {year}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              ({Object.values(months).reduce((total, month) => total + month.posts.length, 0)})
                            </span>
                            {expandedYears.has(year) ? (
                              <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                            )}
                          </div>
                        </button>

                        {/* Months - Only show if year is expanded */}
                        {expandedYears.has(year) && (
                          <div className="ml-4 space-y-2 sidebar-collapsible">
                            {Object.entries(months)
                              .sort(([a], [b]) => b.localeCompare(a)) // Sort months by key (YYYY-MM)
                              .map(([monthKey, monthData]) => (
                                <div key={monthKey} className="space-y-1">
                                  {/* Month Header - Collapsible */}
                                  <button
                                    onClick={() => toggleMonth(monthKey)}
                                    className="flex items-center justify-between w-full text-left p-1.5 rounded-md hover:bg-accent/30 theme-transition group"
                                    aria-expanded={expandedMonths.has(monthKey)}
                                  >
                                    <h4 className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                                      {monthData.name}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-muted-foreground">
                                        ({monthData.posts.length})
                                      </span>
                                      {expandedMonths.has(monthKey) ? (
                                        <ChevronUp className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                                      ) : (
                                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                                      )}
                                    </div>
                                  </button>

                                  {/* Posts - Only show if month is expanded */}
                                  {expandedMonths.has(monthKey) && (
                                    <div className="ml-3 space-y-1 sidebar-collapsible">
                                      {monthData.posts
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((post) => (
                                          <Link
                                            key={post.slug}
                                            href={`/${locale}/post/${post.slug}`}
                                            className="block p-2 rounded-md hover:bg-accent hover:text-accent-foreground theme-transition"
                                            onClick={() => {
                                              setIsMobileOpen(false)
                                              onMobileToggle?.(false)
                                              document.body.classList.remove('sidebar-mobile-open')
                                            }}
                                          >
                                            <div className="text-sm font-medium truncate">{post.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {new Date(post.date).toLocaleDateString(
                                                locale === 'ko' ? 'ko-KR' : 'en-US',
                                                { month: 'short', day: 'numeric' }
                                              )}
                                            </div>
                                          </Link>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  {posts.length === 0 && <div className="text-sm text-muted-foreground">{t('noPosts')}</div>}
                </div>
              </div>

              {/* Footer Links */}
              <div className="flex-shrink-0 p-4 border-t border-border">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{t('contact')}</p>
                  <a href="https://github.com/iamb0ttle" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground theme-transition">
                    <Github className="h-4 w-4" /><span className="text-sm">{t('github')}</span><ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                  <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground theme-transition">
                    <Linkedin className="h-4 w-4" /><span className="text-sm">{t('linkedin')}</span><ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                  <a href="mailto:nbhyun0329@gmail.com" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground theme-transition">
                    <Mail className="h-4 w-4" /><span className="text-sm">{t('email')}</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Resize Handle */}
        {!isCollapsed && !isMobile && (
          <div
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize group"
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full theme-transition group-hover:bg-primary/20" />
          </div>
        )}
      </div>
    </>
  )
}