'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { Plus, Minus, RotateCcw } from 'lucide-react'

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isDark, setIsDark] = useState(false)
  const [zoom, setZoom] = useState(1.1) // Default zoom level
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 })

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'))
      }
    }
    
    checkDarkMode()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
    }
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!chart) return

    const renderDiagram = async () => {
      try {
        // Theme configuration based on current mode
        const lightTheme = {
          theme: 'base' as const,
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#3b82f6',
            lineColor: '#6b7280',
            secondaryColor: '#f3f4f6',
            tertiaryColor: '#ffffff',
            background: '#ffffff',
            mainBkg: '#ffffff',
            secondBkg: '#f3f4f6',
            tertiaryBkg: '#ffffff',
            // Increase text size
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: '16px'
          }
        }

        const darkTheme = {
          theme: 'dark' as const,
          themeVariables: {
            primaryColor: '#60a5fa',
            primaryTextColor: '#f9fafb',
            primaryBorderColor: '#60a5fa',
            lineColor: '#9ca3af',
            secondaryColor: '#374151',
            tertiaryColor: '#1f2937',
            background: '#111827',
            mainBkg: '#1f2937',
            secondBkg: '#374151',
            tertiaryBkg: '#1f2937',
            // Increase text size
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: '16px'
          }
        }

        // Initialize mermaid with appropriate theme
        mermaid.initialize({
          startOnLoad: false,
          ...(isDark ? darkTheme : lightTheme),
          // Increase diagram size
          flowchart: {
            nodeSpacing: 50,
            rankSpacing: 80,
            padding: 20
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 20,
            actorMargin: 50,
            width: 200,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35
          }
        })

        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`
        const { svg } = await mermaid.render(id, chart)
        setSvg(svg)
        setError('')
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
        setSvg('')
      }
    }

    renderDiagram()
  }, [chart, isDark])

  // Zoom control functions
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3)) // Max zoom 3x
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5)) // Min zoom 0.5x
  }

  const handleResetZoom = () => {
    setZoom(1.1) // Reset to default
    setScrollPos({ x: 0, y: 0 }) // Reset scroll position
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - scrollPos.x, y: e.clientY - scrollPos.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setScrollPos({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200 text-sm">
          Mermaid Error: {error}
        </p>
        <pre className="mt-2 text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 p-2 rounded overflow-x-auto">
          {chart}
        </pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="mb-4 p-8 bg-muted/30 rounded-lg border border-border animate-pulse">
        <div className="text-center text-muted-foreground">
          Loading diagram...
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6 relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white dark:bg-slate-800 rounded-lg border border-border shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-muted/50 rounded-t-lg transition-colors"
          title="Zoom In"
          disabled={zoom >= 3}
        >
          <Plus className="h-4 w-4 text-foreground" />
        </button>
        <div className="px-2 py-1 text-xs text-muted-foreground text-center border-t border-b border-border">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-muted/50 transition-colors"
          title="Zoom Out"
          disabled={zoom <= 0.5}
        >
          <Minus className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-muted/50 rounded-b-lg transition-colors border-t border-border"
          title="Reset Zoom & Center"
        >
          <RotateCcw className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Scrollable container for zoomed content */}
      <div 
        className="overflow-auto bg-white dark:bg-slate-900 rounded-lg border border-border min-h-[300px] max-h-[600px]"
        style={{
          cursor: zoom > 1 && isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default'
        }}
      >
        <div 
          ref={ref}
          className="flex justify-center p-6 md:p-8 w-full transition-transform duration-200 ease-out select-none"
          style={{ 
            transform: `scale(${zoom}) translate(${scrollPos.x}px, ${scrollPos.y}px)`,
            transformOrigin: 'center',
            minWidth: zoom > 1 ? `${100 * zoom}%` : '100%',
            minHeight: zoom > 1 ? `${300 * zoom}px` : '300px'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  )
}