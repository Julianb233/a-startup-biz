'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Consult',
    description: 'Book a consultation to discuss your business needs',
    icon: MessageCircle,
  },
  {
    number: 2,
    title: 'Match',
    description: 'We connect you with the right vetted service providers',
    icon: Users,
  },
  {
    number: 3,
    title: 'Execute',
    description: 'Your project gets done while you focus on growing',
    icon: Rocket,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      delay: 0.4,
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple three-step process takes you from idea to execution seamlessly
          </p>
        </motion.div>

        {/* Steps Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines - Desktop */}
            <div className="absolute top-20 left-0 right-0 flex items-center justify-between px-[20%] pointer-events-none">
              <motion.div
                variants={lineVariants}
                className="h-0.5 bg-[#c0c0c0] flex-1 origin-left"
              />
              <motion.div
                variants={lineVariants}
                className="h-0.5 bg-[#c0c0c0] flex-1 origin-left ml-[33.33%]"
              />
            </div>

            {/* Arrow Icons - Desktop */}
            <div className="absolute top-[4.5rem] left-0 right-0 flex items-center justify-between px-[33%] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <ArrowRight className="w-6 h-6 text-[#c0c0c0]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <ArrowRight className="w-6 h-6 text-[#c0c0c0]" />
              </motion.div>
            </div>

            {/* Steps */}
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative z-10"
              >
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <motion.div variants={itemVariants}>
                  <StepCard step={step} />
                </motion.div>

                {/* Connecting Line - Mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <motion.div
                      variants={lineVariants}
                      className="w-0.5 h-12 bg-[#c0c0c0] origin-top"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <Link
            href="/contact"
            className="inline-block bg-[#ff6a1a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#e55a0a] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
          >
            Book Your Consultation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon Container with Number Badge */}
      <div className="relative mb-6">
        {/* Number Badge */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ff6a1a] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
          {step.number}
        </div>

        {/* Icon Circle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border-4 border-[#ff6a1a] shadow-md"
        >
          <Icon className="w-10 h-10 text-[#ff6a1a]" />
        </motion.div>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-xs">{step.description}</p>
    </div>
  );
}
