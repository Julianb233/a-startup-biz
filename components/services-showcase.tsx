"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Bot,
  Users,
  Globe,
  TrendingUp,
  Lightbulb,
  UserCheck,
  Server,
  Share2,
  Search,
  Headphones,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import AddToCartButton from "./add-to-cart-button";

interface Service {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  slug: string;
  price: number;
}

const services: Service[] = [
  {
    icon: FileText,
    title: "EIN Filing",
    description:
      "Fast and compliant EIN registration for your business entity with IRS-certified processing.",
    href: "/services/ein-filing",
    slug: "ein-filing",
    price: 160,
  },
  {
    icon: Scale,
    title: "Legal Services",
    description:
      "Comprehensive business legal support including contracts, compliance, and entity formation.",
    href: "/services/legal-services",
    slug: "legal-services",
    price: 500,
  },
  {
    icon: Calculator,
    title: "Accounting",
    description:
      "Professional accounting services to keep your finances accurate and tax-ready year-round.",
    href: "/services/accounting-services",
    slug: "accounting-services",
    price: 500,
  },
  {
    icon: BookOpen,
    title: "Bookkeeping",
    description:
      "Daily bookkeeping and financial record management to maintain clean, organized books.",
    href: "/services/bookkeeping",
    slug: "bookkeeping",
    price: 300,
  },
  {
    icon: Bot,
    title: "AI Solutions",
    description:
      "Custom AI implementation and automation to streamline operations and boost productivity.",
    href: "/services/ai-solutions",
    slug: "ai-solutions",
    price: 2500,
  },
  {
    icon: Users,
    title: "CRM Implementation",
    description:
      "Complete CRM setup and integration to manage customer relationships effectively.",
    href: "/services/crm-implementation",
    slug: "crm-implementation",
    price: 1500,
  },
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Modern, responsive websites built with cutting-edge technology and optimized for conversions.",
    href: "/services/website-development",
    slug: "website-development",
    price: 3000,
  },
  {
    icon: TrendingUp,
    title: "Marketing",
    description:
      "Data-driven marketing strategies to grow your brand and reach your target audience.",
    href: "/services/marketing-strategy",
    slug: "marketing-strategy",
    price: 1500,
  },
  {
    icon: Lightbulb,
    title: "Business Strategy",
    description:
      "Strategic planning and consulting to accelerate growth and achieve your business goals.",
    href: "/services/business-strategy",
    slug: "business-strategy",
    price: 2000,
  },
  {
    icon: UserCheck,
    title: "HR Solutions",
    description:
      "Complete HR management including hiring, onboarding, compliance, and employee relations.",
    href: "/services/hr-solutions",
    slug: "hr-solutions",
    price: 800,
  },
  {
    icon: Server,
    title: "IT Services",
    description:
      "Comprehensive IT support, infrastructure management, and cybersecurity solutions.",
    href: "/services/it-services",
    slug: "it-services",
    price: 1000,
  },
  {
    icon: Share2,
    title: "Social Media",
    description:
      "Social media management and content creation to build engagement and brand awareness.",
    href: "/services/social-media",
    slug: "social-media",
    price: 1200,
  },
  {
    icon: Search,
    title: "SEO Services",
    description:
      "Search engine optimization to improve rankings and drive organic traffic to your site.",
    href: "/services/seo-services",
    slug: "seo-services",
    price: 1000,
  },
  {
    icon: Headphones,
    title: "Virtual Assistants",
    description:
      "Skilled virtual assistants to handle administrative tasks and support daily operations.",
    href: "/services/virtual-assistants",
    slug: "virtual-assistants",
    price: 25,
  },
  {
    icon: GraduationCap,
    title: "Business Coaching",
    description:
      "One-on-one coaching and mentorship to develop leadership skills and business acumen.",
    href: "/services/business-coaching",
    slug: "business-coaching",
    price: 500,
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function ServicesShowcase() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,26,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,106,26,0.03)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff6a1a] animate-pulse" />
            <span className="text-sm font-semibold text-[#ff6a1a] uppercase tracking-wide">
              Comprehensive Solutions
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6 leading-tight">
            Everything Your Business Needs
          </h2>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            From formation to optimization, we provide end-to-end services to
            start, grow, and scale your business with confidence.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            Not sure which service you need?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-all duration-300 hover:shadow-lg hover:shadow-[#ff6a1a]/25 hover:-translate-y-0.5"
          >
            Schedule a Consultation
            <svg
              className="w-5 h-5"
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
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = service.icon;

  return (
    <motion.div variants={item} className="group h-full">
      <div className="relative h-full">
        <Link href={service.href} className="block h-full">
          <motion.div
            whileHover={{
              y: -8,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="relative h-full bg-white dark:bg-gray-800 rounded-xl border-2 border-[#c0c0c0]/30 dark:border-gray-700 p-6 transition-all duration-300 hover:border-[#ff6a1a]/50 hover:shadow-xl hover:shadow-[#ff6a1a]/10 overflow-hidden"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/0 via-[#ff6a1a]/0 to-[#ff6a1a]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ff6a1a]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon container */}
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 mb-5 rounded-lg bg-gradient-to-br from-[#ff6a1a]/10 to-[#ff6a1a]/5 flex items-center justify-center group-hover:from-[#ff6a1a] group-hover:to-[#ea580c] transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#ff6a1a] group-hover:text-white transition-colors duration-300" />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-[#ff6a1a] transition-colors duration-300">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                {service.description}
              </p>

              {/* Price and Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm font-semibold text-[#ff6a1a]">
                  From ${service.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-[#ff6a1a] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Learn More</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </div>
              </div>
            </div>

            {/* Bottom border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6a1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </Link>

        {/* Add to Cart Button - Floating */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <AddToCartButton
            slug={service.slug}
            name={service.title}
            price={service.price}
            variant="icon"
          />
        </div>
      </div>
    </motion.div>
  );
}
