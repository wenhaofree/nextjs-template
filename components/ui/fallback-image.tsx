'use client'

import Image from 'next/image'
import { useState } from 'react'

interface FallbackImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function FallbackImage({ src, alt, className }: FallbackImageProps) {
  const [error, setError] = useState(false)
  
  const fallbackSrc = '/placeholder.png'

  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        width={1200}
        height={800}
        className="object-cover w-full h-full"
        onError={() => setError(true)}
        priority
      />
    </div>
  )
} 