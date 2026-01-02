"use client"

import { useState, useEffect } from "react"

export default function WistiaVideo() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            See How We Help Entrepreneurs
          </h2>

          {/* Wistia Video - Standard iframe embed for reliability */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative w-full" style={{ paddingTop: '177.78%' }}>
              {/* Loading placeholder */}
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500">
                    <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Wistia iframe embed - more stable than custom web component */}
              <iframe
                src="https://fast.wistia.net/embed/iframe/kono7sttzg?seo=true&videoFoam=false"
                title="A Startup Biz Introduction Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
