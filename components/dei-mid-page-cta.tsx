export function MidPageCTA() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const applySection = document.querySelector('#apply')
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="relative bg-gradient-to-br from-teal-50 to-white border border-teal-200 rounded-xl overflow-hidden shadow-lg">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 via-transparent to-teal-50/50" />

        {/* Content */}
        <div className="relative px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Text */}
          <div className="text-center md:text-left flex-1">
            <h3 className="text-slate-900 text-2xl md:text-3xl font-bold mb-3">
              Join 247 Facilities Already Earning
            </h3>
            <p className="text-slate-600 text-base md:text-lg mb-4">
              15-Minute Demo • Start Earning in 48 Hours
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No setup fees</span>
              </div>
            </div>
          </div>

          {/* Right side - CTA Button */}
          <div className="flex flex-col gap-3">
            <a
              href="#apply"
              onClick={handleClick}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg text-base whitespace-nowrap transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Schedule Demo
            </a>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <span>or call</span>
              <a
                href="tel:+19498064468"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                (949) 806-4468
              </a>
            </div>
          </div>
        </div>

        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
      </div>
    </section>
  )
}
