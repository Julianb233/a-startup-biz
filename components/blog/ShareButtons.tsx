'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react"

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  }

  const buttons = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: shareLinks.twitter,
      color: 'hover:bg-[#1DA1F2] hover:text-white',
      bgColor: 'bg-[#1DA1F2]/10'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: shareLinks.linkedin,
      color: 'hover:bg-[#0A66C2] hover:text-white',
      bgColor: 'bg-[#0A66C2]/10'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: shareLinks.facebook,
      color: 'hover:bg-[#1877F2] hover:text-white',
      bgColor: 'bg-[#1877F2]/10'
    }
  ]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <span
        className="text-lg font-semibold text-gray-900 dark:text-dark-text"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        Share this article:
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {buttons.map((button) => (
          <motion.a
            key={button.name}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${button.bgColor} ${button.color} transition-all duration-300 border border-gray-200 dark:border-dark-secondary`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button.icon className="w-5 h-5" />
            <span
              className="text-sm font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {button.name}
            </span>
          </motion.a>
        ))}

        <motion.button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 border border-gray-200 dark:border-dark-secondary ${
            copied
              ? 'bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white'
              : 'bg-gray-100 dark:bg-dark-muted hover:bg-[#ff6a1a] hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Copied!
              </span>
            </>
          ) : (
            <>
              <Link2 className="w-5 h-5" />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Copy Link
              </span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
