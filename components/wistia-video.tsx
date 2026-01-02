"use client"

import Script from "next/script"
import { useState, useEffect } from "react"

export default function WistiaVideo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            See How We Help Entrepreneurs
          </h2>

          {/* Wistia Player - only render after hydration */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            {mounted ? (
              <>
                <Script
                  src="https://fast.wistia.com/player.js"
                  strategy="lazyOnload"
                />
                <Script
                  src="https://fast.wistia.com/embed/kono7sttzg.js"
                  strategy="lazyOnload"
                  type="module"
                />
                {/* Wistia custom element */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: '<wistia-player media-id="kono7sttzg" aspect="0.5625"></wistia-player>'
                  }}
                />
              </>
            ) : (
              /* Placeholder during SSR/hydration */
              <div
                className="bg-gray-200 dark:bg-gray-700 animate-pulse"
                style={{ paddingTop: '177.78%' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
