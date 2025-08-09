'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useRef } from 'react'
import { Locale } from '@/lib/i18n'

interface GiscusProps {
  locale?: Locale
}

export function Giscus({ locale = 'ko' }: GiscusProps) {
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  // Cleanup function to remove existing giscus
  const cleanupGiscus = () => {
    const existingScript = ref.current?.querySelector('script')
    const existingIframe = ref.current?.querySelector('iframe')
    const existingWidget = ref.current?.querySelector('.giscus')
    
    if (existingScript) existingScript.remove()
    if (existingIframe) existingIframe.remove()  
    if (existingWidget) existingWidget.remove()
  }

  useEffect(() => {
    if (!ref.current) return
    
    cleanupGiscus()

    const scriptElem = document.createElement('script')
    scriptElem.src = 'https://giscus.app/client.js'
    scriptElem.async = true
    scriptElem.crossOrigin = 'anonymous'

    scriptElem.setAttribute('data-repo', 'iamb0ttle/my-blog-comments')
    scriptElem.setAttribute('data-repo-id', 'R_kgDOPadatw')
    scriptElem.setAttribute('data-category', 'Announcements')
    scriptElem.setAttribute('data-category-id', 'DIC_kwDOPadat84Ct7xs')
    scriptElem.setAttribute('data-mapping', 'pathname')
    scriptElem.setAttribute('data-strict', '0')
    scriptElem.setAttribute('data-reactions-enabled', '1')
    scriptElem.setAttribute('data-emit-metadata', '0')
    scriptElem.setAttribute('data-input-position', 'bottom')
    scriptElem.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    scriptElem.setAttribute('data-lang', locale === 'ko' ? 'ko' : 'en')

    ref.current.appendChild(scriptElem)
  }, [locale, theme])


  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div ref={ref} />
    </div>
  )
}