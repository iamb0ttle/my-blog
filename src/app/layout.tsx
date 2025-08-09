import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

// Site configuration from messages
const SITE_CONFIG = {
  baseUrl: 'https://blog.iambottle.site',
  title: 'B(H)log',
  description: 'Dev Stories & Life - 개발 이야기와 일상',
  author: '나병현',
  ogImage: '/og-image.svg'
}

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: ['개발', 'blog', 'development', 'programming', 'tech'],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.baseUrl,
    siteName: SITE_CONFIG.title,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.title} - Dev Stories & Life`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}