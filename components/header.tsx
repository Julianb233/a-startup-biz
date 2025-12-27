"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, FileText, Scale, Calculator, BookOpen, Bot, Users, Globe, TrendingUp, Briefcase, UserCheck, Server, Share2, Search, Headphones, GraduationCap, PenTool, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { UserMenu } from "./user-menu"
import CartButton from "./cart-button"

const serviceCategories = [
  {
    name: "Business Formation",
    services: [
      { slug: "ein-filing", title: "EIN Filing", icon: FileText },
      { slug: "legal-services", title: "Legal Services", icon: Scale },
    ]
  },
  {
    name: "Financial",
    services: [
      { slug: "accounting-services", title: "Accounting", icon: Calculator },
      { slug: "bookkeeping", title: "Bookkeeping", icon: BookOpen },
      { slug: "business-analytics", title: "Analytics", icon: BarChart3 },
    ]
  },
  {
    name: "Technology",
    services: [
      { slug: "ai-solutions", title: "AI Solutions", icon: Bot },
      { slug: "crm-implementation", title: "CRM Implementation", icon: Users },
      { slug: "website-development", title: "Web Development", icon: Globe },
      { slug: "it-services", title: "IT Services", icon: Server },
    ]
  },
  {
    name: "Marketing",
    services: [
      { slug: "marketing-strategy", title: "Marketing Strategy", icon: TrendingUp },
      { slug: "social-media", title: "Social Media", icon: Share2 },
      { slug: "seo-services", title: "SEO Services", icon: Search },
      { slug: "content-creation", title: "Content Creation", icon: PenTool },
    ]
  },
  {
    name: "Operations & Growth",
    services: [
      { slug: "business-strategy", title: "Business Strategy", icon: Briefcase },
      { slug: "hr-solutions", title: "HR Solutions", icon: UserCheck },
      { slug: "virtual-assistants", title: "Virtual Assistants", icon: Headphones },
      { slug: "business-coaching", title: "Business Coaching", icon: GraduationCap },
    ]
  },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
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

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/contact" },
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
          <div className="flex items-center justify-between h-24">
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
                <Image
                  src="/logo.webp"
                  alt="A Startup Biz"
                  width={360}
                  height={100}
                  className="h-20 w-auto object-contain"
                  priority
                />
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
                link.label === "Services" ? (
                  <div key={link.label} ref={servicesRef} className="relative">
                    <motion.button
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium transition-colors rounded-md ${
                        pathname?.startsWith('/services') ? 'text-[#ff6a1a]' : 'text-black hover:text-[#ff6a1a]'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Services
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
                        >
                          {/* Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

                          <div className="grid grid-cols-3 gap-6">
                            {serviceCategories.map((category) => (
                              <div key={category.name}>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                  {category.name}
                                </h4>
                                <ul className="space-y-1">
                                  {category.services.map((service) => {
                                    const Icon = service.icon
                                    return (
                                      <li key={service.slug}>
                                        <a
                                          href={`/services/${service.slug}`}
                                          onClick={(e) => {
                                            handleNavClick(e, `/services/${service.slug}`)
                                            setServicesOpen(false)
                                          }}
                                          className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 hover:text-[#ff6a1a] hover:bg-orange-50 rounded-md transition-colors group"
                                        >
                                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#ff6a1a]" />
                                          {service.title}
                                        </a>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* View All Services */}
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <a
                              href="/services"
                              onClick={(e) => {
                                handleNavClick(e, "/services")
                                setServicesOpen(false)
                              }}
                              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-[#ff6a1a] hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              View All Services
                              <ChevronDown className="w-4 h-4 -rotate-90" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
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
                )
              ))}
            </motion.nav>

            {/* Right Side Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              {/* Cart Button */}
              <div className="hidden sm:block">
                <CartButton />
              </div>

              {/* User Menu - Shows Sign In/Get Started when logged out, User avatar when logged in */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>

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
                  <Image
                    src="/logo.webp"
                    alt="A Startup Biz"
                    width={360}
                    height={100}
                    className="h-20 w-auto object-contain"
                  />
                </a>
              </motion.div>

              <motion.ul className="space-y-1">
                {navigationLinks.map((link) => (
                  link.label === "Services" ? (
                    <motion.li
                      key={link.label}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 },
                      }}
                    >
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-black hover:text-[#ff6a1a] rounded-md transition-colors"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Services
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="py-2 pl-4 space-y-4">
                              {serviceCategories.map((category) => (
                                <div key={category.name}>
                                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                                    {category.name}
                                  </h4>
                                  <ul className="space-y-1">
                                    {category.services.map((service) => {
                                      const Icon = service.icon
                                      return (
                                        <li key={service.slug}>
                                          <a
                                            href={`/services/${service.slug}`}
                                            onClick={(e) => {
                                              handleNavClick(e, `/services/${service.slug}`)
                                              setMobileServicesOpen(false)
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-[#ff6a1a] hover:bg-orange-50 rounded-md transition-colors"
                                          >
                                            <Icon className="w-4 h-4 text-gray-400" />
                                            {service.title}
                                          </a>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              ))}
                              <a
                                href="/services"
                                onClick={(e) => {
                                  handleNavClick(e, "/services")
                                  setMobileServicesOpen(false)
                                }}
                                className="block px-4 py-2 text-sm font-medium text-[#ff6a1a] hover:bg-orange-50 rounded-md transition-colors"
                              >
                                View All Services →
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ) : (
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
                  )
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
                <div className="flex justify-center">
                  <UserMenu />
                </div>
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
