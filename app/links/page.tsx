'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Calendar,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Users,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
} from 'lucide-react';

const links = [
  {
    title: 'Book a Free Consultation',
    description: 'Schedule a 30-minute discovery call',
    href: '/book-call',
    icon: Calendar,
    highlight: true,
  },
  {
    title: 'Our Services',
    description: 'LLC Formation, EIN Filing, Websites & More',
    href: '/services',
    icon: Briefcase,
  },
  {
    title: 'Get a Quote',
    description: 'Custom pricing for your needs',
    href: '/contact',
    icon: FileText,
  },
  {
    title: 'Start Your Business',
    description: 'Complete onboarding process',
    href: '/onboarding/intake',
    icon: Globe,
  },
  {
    title: 'Become a Partner',
    description: 'Earn commissions on referrals',
    href: '/become-partner',
    icon: Users,
  },
  {
    title: 'Chat With Us',
    description: 'Get instant answers',
    href: '/#chat',
    icon: MessageCircle,
  },
];

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/astartupbiz', icon: Instagram },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/astartupbiz', icon: Linkedin },
  { name: 'Twitter', href: 'https://twitter.com/astartupbiz', icon: Twitter },
  { name: 'Facebook', href: 'https://facebook.com/astartupbiz', icon: Facebook },
  { name: 'YouTube', href: 'https://youtube.com/@astartupbiz', icon: Youtube },
];

const contactInfo = [
  { label: 'Email', value: 'hello@astartupbiz.com', href: 'mailto:hello@astartupbiz.com', icon: Mail },
  { label: 'Phone', value: '(555) 123-4567', href: 'tel:+15551234567', icon: Phone },
  { label: 'Website', value: 'astartupbiz.com', href: 'https://astartupbiz.com', icon: Globe },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-12">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Logo/Avatar */}
          <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-orange-500 bg-white shadow-xl shadow-orange-500/20">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="text-3xl font-bold text-white">ASB</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">A Startup Biz</h1>
          <p className="text-gray-400 text-sm mb-4">
            Expert Business Consulting for Entrepreneurs
          </p>

          {/* Tagline */}
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm text-orange-400 border border-orange-500/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Available for new clients
          </div>
        </motion.div>

        {/* Main Links */}
        <div className="space-y-3 mb-8">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className={`group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 ${
                    link.highlight
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-orange-500/50'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    link.highlight ? 'bg-white/20' : 'bg-orange-500/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${link.highlight ? 'text-white' : 'text-orange-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{link.title}</h3>
                    <p className={`text-sm ${link.highlight ? 'text-white/80' : 'text-gray-400'}`}>
                      {link.description}
                    </p>
                  </div>
                  <ExternalLink className={`h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 ${
                    link.highlight ? 'text-white' : 'text-orange-500'
                  }`} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 text-center">
            Contact Us
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center gap-1 rounded-lg bg-white/5 p-3 text-center transition-colors hover:bg-white/10 border border-white/5 hover:border-orange-500/30"
                >
                  <Icon className="h-5 w-5 text-orange-500" />
                  <span className="text-xs text-gray-400">{item.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Follow Us
          </h2>
          <div className="flex justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-all hover:bg-orange-500 hover:text-white hover:scale-110 border border-white/10 hover:border-orange-500"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} A Startup Biz. All rights reserved.
          </p>
          <a
            href="https://astartupbiz.com"
            className="mt-2 inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400"
          >
            <Globe className="h-3 w-3" />
            astartupbiz.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
