"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [menuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)

    // If it's a page link (not a hash), navigate to it
    if (!href.startsWith("#")) {
      router.push(href)
      return
    }

    // If we're not on the home page and clicking a hash link, go home first
    if (pathname !== "/") {
      router.push("/" + href)
      return
    }

    // Scroll to element
    const elementId = href.replace("#", "")
    const element = document.getElementById(elementId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.1),0_1px_2px_-1px_rgb(0,0,0,0.1)]"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="/"
                onClick={(e) => handleNavClick(e, "/")}
                className="flex items-center gap-2 group"
              >
                <span className="text-2xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  A Startup Biz
                </span>
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:flex items-center gap-1"
            >
              {navigationLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-4 py-2 text-[15px] font-medium text-black hover:text-[#ff6a1a] transition-colors rounded-md"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>

            {/* Right Side Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              {/* CTA Button */}
              <motion.a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center px-6 py-2.5 bg-[#ff6a1a] text-white font-semibold text-[15px] rounded-md hover:bg-[#e55f17] transition-all shadow-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Get Started
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-black hover:text-[#ff6a1a] rounded-md transition-all"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-40 lg:hidden overflow-y-auto"
            onClick={() => setMenuOpen(false)}
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.15
                  }
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1
                  }
                },
              }}
              className="flex flex-col h-full px-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Logo */}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -20 },
                }}
                className="mb-8"
              >
                <a
                  href="/"
                  onClick={(e) => handleNavClick(e, "/")}
                  className="flex items-center"
                >
                  <span className="text-2xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    A Startup Biz
                  </span>
                </a>
              </motion.div>

              <motion.ul className="space-y-1">
                {navigationLinks.map((link) => (
                  <motion.li
                    key={link.label}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -20 },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="block px-4 py-3 text-base font-medium text-black hover:text-[#ff6a1a] rounded-md transition-colors"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Mobile Actions */}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="mt-8 space-y-4"
              >
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "#contact")}
                  className="block px-6 py-3 bg-[#ff6a1a] text-white font-semibold text-base rounded-md hover:bg-[#e55f17] transition-all text-center shadow-sm"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Get Started
                </a>
              </motion.div>

              {/* Professional Tagline */}
              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 },
                }}
                className="mt-auto mb-8 px-4"
              >
                <p className="text-sm text-slate-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Stop Dreaming. Start Building.
                </p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
