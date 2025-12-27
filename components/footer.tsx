"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { FOOTER_NAVIGATION } from "@/lib/site-config"

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] pt-16 pb-8 px-4 md:px-8 border-t border-[#1a1a1a]">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                A Startup Biz
              </h3>
              <p className="text-sm text-[#ff6a1a] font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Stop Dreaming. Start Building.
              </p>
              <p className="text-sm text-[#c0c0c0] leading-relaxed mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Expert business consulting to turn your startup vision into reality.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#ff6a1a] hover:border-[#ff6a1a] transition-all group"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-[#c0c0c0] group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#ff6a1a] hover:border-[#ff6a1a] transition-all group"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-5 h-5 text-[#c0c0c0] group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center hover:bg-[#ff6a1a] hover:border-[#ff6a1a] transition-all group"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5 text-[#c0c0c0] group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {FOOTER_NAVIGATION.services.title}
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAVIGATION.services.items.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-[#c0c0c0] hover:text-[#ff6a1a] transition-colors text-sm font-medium"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {FOOTER_NAVIGATION.company.title}
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAVIGATION.company.items.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-[#c0c0c0] hover:text-[#ff6a1a] transition-colors text-sm font-medium"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contact
            </h4>
            <p className="text-sm text-[#c0c0c0] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Ready to turn your startup dream into reality? Let's talk.
            </p>

            {/* CTA Button */}
            <motion.div>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#e55f17] transition-colors text-sm shadow-lg"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Get Started
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>

            {/* Email */}
            <div className="mt-6">
              <p className="text-sm text-[#c0c0c0]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Email us at{" "}
                <a
                  href="mailto:Astartupbiz@gmail.com"
                  className="text-[#ff6a1a] hover:text-[#e55f17] font-semibold"
                >
                  Astartupbiz@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a2a2a] pt-8">
          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#c0c0c0] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              © {new Date().getFullYear()} A Startup Biz. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm text-[#c0c0c0]">
              {FOOTER_NAVIGATION.legal.items.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="hover:text-[#ff6a1a] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <p className="text-xs text-[#c0c0c0] leading-relaxed text-center md:text-left max-w-4xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              A Startup Biz provides professional business consulting services to help entrepreneurs and startups succeed.
              Results may vary based on individual circumstances and market conditions. We work collaboratively with clients to develop customized strategies.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
