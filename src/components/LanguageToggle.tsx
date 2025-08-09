'use client'

import { Languages } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { Locale, locales } from '@/lib/i18n'

interface LanguageToggleProps {
  currentLocale: Locale
  hideText?: boolean
}

export function LanguageToggle({ currentLocale, hideText = false }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = () => {
    const newLocale = currentLocale === 'ko' ? 'en' : 'ko'
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={handleLanguageChange}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 theme-transition"
    >
      <Languages className={`h-4 w-4 ${!hideText ? 'mr-1' : ''}`} />
      {!hideText && (
        <span className="text-xs font-medium">
          {currentLocale.toUpperCase()}
        </span>
      )}
      <span className="sr-only">Toggle language</span>
    </button>
  )
}