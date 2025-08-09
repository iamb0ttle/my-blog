import { MDXRemote } from 'next-mdx-remote/rsc'
import { Post } from '@/lib/posts'
import { Locale } from '@/lib/i18n'
import { getTranslations } from 'next-intl/server'
import { Calendar, Clock, Hash, CheckCircle, AlertTriangle, Info, XCircle, ExternalLink, Copy, BookOpen, Lightbulb, AlertCircle, Zap, Quote, FileText, Link2, Hash as HashIcon } from 'lucide-react'
import { ReactNode } from 'react'
import * as React from 'react'
import { HeadingAnchor } from './HeadingAnchor'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkGemoji from 'remark-gemoji'
import remarkToc from 'remark-toc'
import remarkUnwrapImages from 'remark-unwrap-images'
import Image from 'next/image';
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeExternalLinks from 'rehype-external-links'

import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'

interface PostContentProps {
  post: Post
  locale: Locale
}

const CustomAlert = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'error' | 'success', children: ReactNode }) => {
  const configs = {
    info: {
      icon: <Info className="h-4 w-4" />,
      className: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4" />,
      className: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
    },
    error: {
      icon: <XCircle className="h-4 w-4" />,
      className: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
    },
    success: {
      icon: <CheckCircle className="h-4 w-4" />,
      className: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
    }
  }

  return (
    <div className={`p-4 rounded-lg border mb-4 theme-transition ${configs[type].className}`}>
      <div className="flex items-start space-x-3">
        {configs[type].icon}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

const CustomCard = ({ title, description, children }: { title?: string, description?: string, children: ReactNode }) => (
  <div className="border border-border bg-card text-card-foreground rounded-lg p-6 mb-4 shadow-sm dark:shadow-none theme-transition">
    {title && <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>}
    {description && <p className="text-muted-foreground mb-4">{description}</p>}
    <div>{children}</div>
  </div>
)

const CustomBadge = ({ variant = 'default', children }: { variant?: 'default' | 'secondary' | 'destructive' | 'outline', children: ReactNode }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground shadow-sm',
    outline: 'border border-input bg-background text-foreground'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium theme-transition ${variants[variant]}`}>
      {children}
    </span>
  )
}

const CustomCallout = ({ type = 'note', children }: { type?: 'note' | 'tip' | 'warning' | 'danger', children: ReactNode }) => {
  const configs = {
    note: {
      icon: <BookOpen className="h-4 w-4" />,
      className: 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500 text-blue-900 dark:text-blue-100'
    },
    tip: {
      icon: <Lightbulb className="h-4 w-4" />,
      className: 'bg-green-50 dark:bg-green-950/30 border-l-green-500 text-green-900 dark:text-green-100'
    },
    warning: {
      icon: <AlertCircle className="h-4 w-4" />,
      className: 'bg-yellow-50 dark:bg-yellow-950/30 border-l-yellow-500 text-yellow-900 dark:text-yellow-100'
    },
    danger: {
      icon: <Zap className="h-4 w-4" />,
      className: 'bg-red-50 dark:bg-red-950/30 border-l-red-500 text-red-900 dark:text-red-100'
    }
  }

  return (
    <div className={`border-l-4 p-4 mb-4 rounded-r-lg theme-transition ${configs[type].className}`}>
      <div className="flex items-start space-x-3">
        {configs[type].icon}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

const CustomDetails = ({ summary, children }: { summary?: string, children: ReactNode }) => (
  <details className="mb-4 border border-border rounded-lg theme-transition group">
    <summary className="p-4 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-medium text-foreground flex items-center gap-2 theme-transition">
      <FileText className="h-4 w-4" />
      {summary || 'Details'}
    </summary>
    <div className="p-4 pt-0 border-t border-border/50 text-muted-foreground">{children}</div>
  </details>
)

const CustomCodeBlock = ({ language, title, children }: { language?: string, title?: string, children: ReactNode }) => (
  <div className="mb-4 rounded-lg border border-border overflow-hidden">
    {title && (
      <div className="bg-muted/50 dark:bg-muted/30 px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{title}</span>
        <div className="flex items-center gap-2">
          {language && <span className="text-xs text-muted-foreground bg-background dark:bg-background/50 px-2 py-1 rounded">{language}</span>}
          <button className="text-muted-foreground hover:text-foreground theme-transition">
            <Copy className="h-3 w-3" />
          </button>
        </div>
      </div>
    )}
    <pre className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto text-sm">
      <code className="text-slate-800 dark:text-slate-200">{children}</code>
    </pre>
  </div>
)

const CustomQuote = ({ author, children }: { author?: string, children: ReactNode }) => (
  <blockquote className="relative mt-6 border-l-4 border-primary pl-6 py-4 bg-muted/30 dark:bg-muted/10 rounded-r-lg theme-transition">
    <Quote className="absolute top-2 left-2 h-4 w-4 text-primary/50" />
    <div className="italic text-muted-foreground mb-2">{children}</div>
    {author && (
      <footer className="text-sm text-muted-foreground/80">
        — {author}
      </footer>
    )}
  </blockquote>
)

const CustomFootnoteReference = ({ href, children, ...props }: any) => (
  <sup>
    <a
      href={href}
      className="text-primary text-xs px-1 py-0.5 rounded bg-primary/10 hover:bg-primary/20 theme-transition no-underline"
      {...props}
    >
      {children}
    </a>
  </sup>
)

const CustomFootnoteDefinition = ({ id, children }: any) => (
  <div id={id} className="text-sm text-muted-foreground border-t border-border pt-2 mt-4">
    <div className="flex gap-2">
      <Link2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  </div>
)

const CustomDefinitionList = ({ children }: any) => (
  <dl className="mb-4 space-y-2">{children}</dl>
)

const CustomDefinitionTerm = ({ children }: any) => (
  <dt className="font-semibold text-foreground">{children}</dt>
)

const CustomDefinitionDescription = ({ children }: any) => (
  <dd className="ml-4 text-muted-foreground pl-4 border-l-2 border-muted">{children}</dd>
)

export async function PostContent({ post, locale }: PostContentProps) {
  const t = await getTranslations('post')
  
  const components = {
    // Custom Components
    Alert: CustomAlert,
    Card: CustomCard,
    Badge: CustomBadge,
    Callout: CustomCallout,
    Details: CustomDetails,
    CodeBlock: CustomCodeBlock,
    Quote: CustomQuote,
    
    FootnoteRef: CustomFootnoteReference,
    FootnoteDef: CustomFootnoteDefinition,
    
    // Definition Lists (enhanced styling)
    dl: CustomDefinitionList,
    dt: CustomDefinitionTerm,
    dd: CustomDefinitionDescription,
    
    h1: ({ children, id, ...props }: any) => (
      <h1 id={id} className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-foreground scroll-mt-24 group leading-tight" {...props}>
        <div className="flex items-center gap-2">
          {children}
          {id && <HeadingAnchor id={id} size="lg" />}
        </div>
      </h1>
    ),
    h2: ({ children, id, ...props }: any) => (
      <h2 id={id} className="text-2xl font-semibold mt-6 mb-3 text-foreground scroll-mt-24 group" {...props}>
        <div className="flex items-center gap-2">
          {children}
          {id && <HeadingAnchor id={id} size="md" />}
        </div>
      </h2>
    ),
    h3: ({ children, id, ...props }: any) => (
      <h3 id={id} className="text-xl font-medium mt-4 mb-2 text-foreground scroll-mt-24 group" {...props}>
        <div className="flex items-center gap-2">
          {children}
          {id && <HeadingAnchor id={id} size="sm" />}
        </div>
      </h3>
    ),
    h4: ({ children, id, ...props }: any) => (
      <h4 id={id} className="text-lg font-medium mt-4 mb-2 text-foreground scroll-mt-24" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, id, ...props }: any) => (
      <h5 id={id} className="text-base font-medium mt-3 mb-2 text-foreground scroll-mt-24" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, id, ...props }: any) => (
      <h6 id={id} className="text-sm font-medium mt-3 mb-2 text-foreground scroll-mt-24" {...props}>
        {children}
      </h6>
    ),
    
    // Text elements
    p: ({ children }: any) => (
      <p className="mb-4 leading-7 text-muted-foreground">{children}</p>
    ),
    
    // Lists with enhanced styling
    ul: ({ children }: any) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground marker:text-primary">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground marker:text-primary marker:font-medium">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-7">{children}</li>
    ),
    
    // Emphasis with better contrast
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    
    // Code with better dark mode support
    code: ({ children, className }: any) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="relative rounded bg-muted dark:bg-muted/70 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground border border-border/50">
            {children}
          </code>
        )
      }
      return <code className={className}>{children}</code>
    },
    
    pre: ({ children, ...props }: any) => (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-border p-4 text-sm" {...props}>
        {children}
      </pre>
    ),
    
    a: ({ href, children, ...props }: any) => {
      const isExternal = href?.startsWith('http')
      const isFootnoteRef = href?.startsWith('#')
      const isHeaderLink = props.className?.includes('header-link') || 
                           props.className?.includes('anchor') ||
                           (href?.startsWith('#') && typeof children === 'object')
      
      if (isHeaderLink || (href?.startsWith('#') && React.isValidElement(children))) {
        return <span {...props}>{children}</span>
      }
      
      if (props.className?.includes('footnote-ref') || 
          (typeof children === 'string' && /^\d+$/.test(children) && isFootnoteRef)) {
        return (
          <sup>
            <a
              href={href}
              className="text-primary text-xs px-1 py-0.5 rounded bg-primary/10 hover:bg-primary/20 theme-transition no-underline"
              {...props}
            >
              {children}
            </a>
          </sup>
        )
      }
      
      return (
        <a 
          href={href} 
          className={`text-primary underline underline-offset-4 hover:text-primary/80 theme-transition ${
            isExternal ? 'inline-flex items-center gap-1' : ''
          } ${
            isFootnoteRef ? 'no-underline' : ''
          }`}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
          {isExternal && <ExternalLink className="h-3 w-3" />}
        </a>
      )
    },
    
    blockquote: ({ children }: any) => (
      <CustomQuote>{children}</CustomQuote>
    ),
    
    table: ({ children }: any) => (
      <div className="mb-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse bg-card">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-muted/50 dark:bg-muted/30">{children}</thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y divide-border">{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="hover:bg-muted/25 dark:hover:bg-muted/20 theme-transition">{children}</tr>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-3 text-left font-semibold text-foreground border-r border-border last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-3 text-muted-foreground border-r border-border last:border-r-0">
        {children}
      </td>
    ),
    
    img: ({ src, alt, title, ...props }: any) => (
      <figure className="mb-4">
        <Image
          src={src}
          alt={alt}
          title={title}
          className="max-w-full h-auto rounded-lg border border-border shadow-sm dark:shadow-none"
          width={800} // Added width
          height={600} // Added height
          {...props}
        />
        {(title || alt) && (
          <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
            {title || alt}
          </figcaption>
        )}
      </figure>
    ),
    
    // Horizontal Rule
    hr: () => (
      <hr className="my-8 border-border" />
    ),
    
    // Task Lists (GFM) with better styling
    input: ({ type, checked, ...props }: any) => {
      if (type === 'checkbox') {
        return (
          <input 
            type="checkbox" 
            checked={checked} 
            className="mr-2 accent-primary scale-110" 
            disabled
            {...props}
          />
        )
      }
      return <input type={type} {...props} />
    },
    
    // Keyboard shortcuts
    kbd: ({ children }: any) => (
      <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
        {children}
      </kbd>
    ),
    
    // Mark/highlight
    mark: ({ children }: any) => (
      <mark className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded text-foreground">
        {children}
      </mark>
    ),
    
    // Subscript and superscript
    sub: ({ children }: any) => (
      <sub className="text-xs">{children}</sub>
    ),
    sup: ({ children }: any) => (
      <sup className="text-xs">{children}</sup>
    ),
    
    // Math components with better dark mode
    math: ({ children }: any) => (
      <span className="katex-inline dark:invert-0">{children}</span>
    ),
    
    // Details/Summary with enhanced styling
    details: ({ children }: any) => (
      <details className="mb-4 border border-border rounded-lg bg-card">
        {children}
      </details>
    ),
    summary: ({ children }: any) => (
      <summary className="p-4 cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/30 font-medium text-foreground theme-transition border-b border-border">
        {children}
      </summary>
    ),
  }

  // Split content by h1 tags to create chat bubbles
  const sections = post.content.split(/(?=^# )/gm)
    .filter(Boolean)
    .filter(section => {
      const cleanSection = section.trim()
      return cleanSection.length > 0 && cleanSection !== '' && cleanSection !== '#'
    })

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-2">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8 -mx-4 md:-mx-6">
          <Image
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-xl"
            width={800} // Added width
            height={256} // Matches h-64 (64 * 4 for approximate pixel value)
          />
        </div>
      )}
      
      {/* Post Header */}
      <header className="mb-8 text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} {t('minutes')}</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground border border-border/50 theme-transition"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Chat-style Content */}
      <div className="space-y-6">
        {sections.map((section, index) => {
          const isUser = index % 2 === 0
          const cleanSection = section.trim()
          
          return (
            <div
              key={index}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-6 py-4 theme-transition shadow-sm
                  ${
                    isUser
                      ? 'bg-card text-card-foreground ml-8 border-2 border-primary'
                      : 'bg-card text-card-foreground mr-8 border-2 border-border'
                  }
                `}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MDXRemote 
                    source={cleanSection}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [
                          remarkGfm,
                          remarkMath,
                          remarkGemoji,
                          [remarkToc, { heading: 'Table of Contents', maxDepth: 3 }],
                          remarkUnwrapImages,
                        ],
                        rehypePlugins: [
                          rehypeSlug,
                          [rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }],
                          rehypeKatex,
                          [rehypeHighlight, { detect: true, ignoreMissing: true }],
                        ],
                      },
                    }}
                    components={components}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}