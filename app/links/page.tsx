"use client"

import { motion } from "framer-motion"
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  MessageCircle,
  ExternalLink,
  LogIn,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/toryzweigle",
    icon: Linkedin,
    color: "bg-[#0077B5]",
    hoverColor: "hover:bg-[#006097]"
  },
  {
    name: "Twitter / X",
    url: "https://twitter.com/astartupbiz",
    icon: Twitter,
    color: "bg-black",
    hoverColor: "hover:bg-gray-800"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/astartupbiz",
    icon: Facebook,
    color: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#1565D8]"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/astartupbiz",
    icon: Instagram,
    color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]",
    hoverColor: "hover:opacity-90"
  }
]

const actionLinks = [
  {
    name: "Book a Clarity Call",
    description: "$1,000 • 90-minute strategy session",
    url: "/quote",
    icon: Calendar,
    primary: true
  },
  {
    name: "Browse Services",
    description: "17 business services to help you grow",
    url: "/services",
    icon: Briefcase,
    primary: false
  },
  {
    name: "Contact Us",
    description: "Get in touch with our team",
    url: "/contact",
    icon: MessageCircle,
    primary: false
  },
  {
    name: "Email Us",
    description: "hello@astartupbiz.com",
    url: "mailto:hello@astartupbiz.com",
    icon: Mail,
    primary: false,
    external: true
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Profile Section */}
          <motion.div variants={itemVariants} className="text-center">
            {/* Logo/Avatar */}
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#ff6a1a] flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">ASB</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">A Startup Biz</h1>
            <p className="text-gray-600 mt-1">Business Clarity & Vetted Service Partners</p>

            {/* Tory intro */}
            <p className="text-sm text-gray-500 mt-3 max-w-xs mx-auto">
              46+ years of experience building 100+ businesses.
              Get unstuck with Tory Zweigle.
            </p>
          </motion.div>

          {/* Login/Register Buttons */}
          <motion.div variants={itemVariants} className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#ff6a1a] text-[#ff6a1a] rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            <Link
              href="/register"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff6a1a] text-white rounded-xl font-semibold hover:bg-[#e55a0a] transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Link>
          </motion.div>

          {/* Action Links */}
          <motion.div variants={itemVariants} className="space-y-3">
            {actionLinks.map((link, index) => (
              <motion.div
                key={link.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={`block w-full p-4 rounded-xl transition-all shadow-sm hover:shadow-md ${
                    link.primary
                      ? "bg-[#ff6a1a] text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      link.primary ? "bg-white/20" : "bg-orange-100"
                    }`}>
                      <link.icon className={`w-5 h-5 ${link.primary ? "text-white" : "text-[#ff6a1a]"}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold flex items-center gap-2">
                        {link.name}
                        {link.external && <ExternalLink className="w-4 h-4 opacity-60" />}
                      </div>
                      <div className={`text-sm ${link.primary ? "text-white/80" : "text-gray-500"}`}>
                        {link.description}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <p className="text-center text-sm text-gray-500 mb-4">Connect with us</p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full ${social.color} ${social.hoverColor} flex items-center justify-center text-white shadow-md transition-all`}
                  title={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Partner CTA */}
          <motion.div variants={itemVariants} className="pt-4">
            <Link
              href="/get-approved"
              className="block w-full p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl text-center hover:from-gray-700 hover:to-gray-800 transition-all shadow-md"
            >
              <div className="font-semibold">Become a Partner</div>
              <div className="text-sm text-gray-300">Earn commissions on referrals</div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pt-6">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} A Startup Biz, LLC
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">
                Terms
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
