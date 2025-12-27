'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { TrendingUp, Users, BarChart3, Award } from 'lucide-react';

export default function StatisticsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const stats = [
    {
      id: 1,
      image: '/images/stat-business-growth.jpg',
      alt: '56.7% increase in new businesses',
      icon: TrendingUp,
      label: 'Business Growth',
      description: 'Record-breaking startup acceleration',
    },
    {
      id: 2,
      image: '/images/stat-q4-acceleration.webp',
      alt: 'Q4 2023 acceleration chart',
      icon: BarChart3,
      label: 'Market Momentum',
      description: 'Q4 acceleration signals opportunity',
    },
    {
      id: 3,
      image: '/images/stat-4-7-million.jpg',
      alt: '4.7 Million businesses started every year',
      icon: Users,
      label: 'Annual Startups',
      description: '4.7M new businesses launched yearly',
    },
    {
      id: 4,
      image: '/images/comparison-consultants.jpg',
      alt: 'Other Consultants vs Tory Zweigle comparison',
      icon: Award,
      label: 'Experience Gap',
      description: 'Real experience vs. theory',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#ff6a1a]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#ff6a1a]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 mb-6"
          >
            <BarChart3 className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-medium text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Data-Driven Insights
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            The Numbers{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Don't Lie
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Real statistics from the business landscape—and why experience matters more than credentials
          </motion.p>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={stat.image}
                    alt={stat.alt}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />

                  {/* Gradient Overlay on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Icon Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center group-hover:bg-[#ff6a1a] transition-colors duration-300"
                  >
                    <stat.icon className="w-6 h-6 text-[#ff6a1a] group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <motion.h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {stat.label}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 text-sm leading-relaxed"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {stat.description}
                  </motion.p>
                </div>

                {/* Bottom Accent Bar */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-[#ff6a1a]/5 via-orange-50/50 to-[#ff6a1a]/5 rounded-2xl p-8 border border-[#ff6a1a]/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-[#ff6a1a]" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Experience Over Theory
              </h3>
            </div>
            <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              While millions start businesses every year, only a select few have launched{' '}
              <span className="font-bold text-[#ff6a1a]">100+ ventures</span> over{' '}
              <span className="font-bold text-[#ff6a1a]">46+ years</span>.
            </p>
            <p className="text-base text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Theory doesn't pay the bills. Real-world experience does.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
