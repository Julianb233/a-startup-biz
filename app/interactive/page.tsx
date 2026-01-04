"use client"

import Image from "next/image"
import Link from "next/link"

export default function InteractivePage() {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Section 1: Big Logo */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative w-[80vw] max-w-[800px] aspect-[3/1]">
          <Image
            src="/images/a-startup-biz-logo.webp"
            alt="A Startup Biz"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Section 2: H1 - The Question */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black to-orange-950/20">
        <h1 className="text-[clamp(2rem,6vw,5rem)] font-black text-center leading-tight">
          <span className="text-white">Are you an </span>
          <span className="text-orange-500">entrepreneur</span>
          <br />
          <span className="text-white">or a </span>
          <span className="text-white/60">wantrepreneur</span>
          <span className="text-white">?</span>
        </h1>
      </section>

      {/* Section 3: H2 - Supporting Text */}
      <section className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-orange-950/20 to-black">
        <div className="max-w-3xl text-center">
          <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-bold text-white mb-6">
            Clear guidance from <span className="text-orange-500">lived experience</span> — not theory.
          </h2>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
            46+ years of building businesses from the ground up.
            Real answers to real problems. No fluff, no filler.
          </p>
        </div>
      </section>

      {/* Section 4: Tory's Profile Image */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            Meet <span className="text-orange-500">Tory</span>
          </h2>
          <p className="text-lg text-white/70">Serial Entrepreneur & Business Mentor</p>
        </div>
        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[533px] rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_60px_rgba(255,106,26,0.3)]">
          <Image
            src="/images/tory-profile.jpg"
            alt="Tory R. Zweigle"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Section 5: Business Stats */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-black to-orange-950/30">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-12">
            The <span className="text-orange-500">Startup Boom</span> Is Real
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-black/60 border border-orange-500/30 rounded-2xl p-8 text-center">
              <div className="text-5xl md:text-6xl font-black text-orange-500 mb-2">4.7M</div>
              <div className="text-lg text-white/80">New businesses started every year</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-black/60 border border-orange-500/30 rounded-2xl p-8 text-center">
              <div className="text-5xl md:text-6xl font-black text-orange-500 mb-2">+57%</div>
              <div className="text-lg text-white/80">Growth since 2019</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-black/60 border border-orange-500/30 rounded-2xl p-8 text-center">
              <div className="text-5xl md:text-6xl font-black text-orange-500 mb-2">90%</div>
              <div className="text-lg text-white/80">Fail within first 5 years</div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Don&apos;t become a statistic. Get guidance from someone who&apos;s been there.
            </p>
            <Link
              href="https://astartupbiz.com/#contact"
              className="inline-block px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
            >
              Book Your Clarity Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-white/60">© 2026 A Startup Biz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
