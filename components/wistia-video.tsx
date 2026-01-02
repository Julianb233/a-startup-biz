"use client"

import Script from "next/script"

export default function WistiaVideo() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            See How We Help Entrepreneurs
          </h2>

          {/* Wistia Player */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Script
              src="https://fast.wistia.com/player.js"
              strategy="lazyOnload"
            />
            <Script
              src="https://fast.wistia.com/embed/kono7sttzg.js"
              strategy="lazyOnload"
              type="module"
            />
            <style jsx>{`
              :global(wistia-player[media-id='kono7sttzg']:not(:defined)) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/kono7sttzg/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 177.78%;
              }
            `}</style>
            {/* @ts-expect-error - Wistia custom element */}
            <wistia-player media-id="kono7sttzg" aspect="0.5625"></wistia-player>
          </div>
        </div>
      </div>
    </section>
  )
}
