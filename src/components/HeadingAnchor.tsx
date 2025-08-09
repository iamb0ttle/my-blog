'use client'

import { Hash as HashIcon } from 'lucide-react'

interface HeadingAnchorProps {
  id: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function HeadingAnchor({ id, className, size = 'lg' }: HeadingAnchorProps) {
  const handleClick = () => {
    window.location.hash = id
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  }

  return (
    <button 
      onClick={handleClick}
      className={className || "opacity-0 group-hover:opacity-100 hover:text-primary"}
    >
      <HashIcon className={`${iconSizes[size]} text-muted-foreground hover:text-primary`} />
    </button>
  )
}