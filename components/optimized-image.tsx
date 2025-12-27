import Image, { ImageProps } from 'next/image'

/**
 * OptimizedImage component that uses WebP format with fallback
 * Automatically serves .webp versions of images when available
 */
interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  fallbackSrc?: string
}

export function OptimizedImage({ src, fallbackSrc, ...props }: OptimizedImageProps) {
  // Convert PNG/JPG to WebP path
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')

  // Use WebP as primary source, original as fallback
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <Image
        src={fallbackSrc || src}
        {...props}
      />
    </picture>
  )
}

/**
 * Hook to get optimized image src
 */
export function useOptimizedImage(src: string): string {
  // Check if WebP is supported (most modern browsers)
  const isWebPSupported = typeof window !== 'undefined' &&
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0

  if (isWebPSupported) {
    return src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  }

  return src
}
