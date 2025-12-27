'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle,
  Calendar,
  Download,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const submissionId = searchParams.get('id');
  const companyName = searchParams.get('company');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const nextSteps = [
    {
      icon: Mail,
      title: 'Confirmation Email',
      description: 'Check your inbox for a detailed summary of your submission',
      timeline: 'Within 5 minutes',
      status: 'completed',
    },
    {
      icon: Users,
      title: 'Team Review',
      description: 'Our team will review your requirements and prepare a customized proposal',
      timeline: '1-2 business days',
      status: 'pending',
    },
    {
      icon: Phone,
      title: 'Discovery Call',
      description: 'We\'ll schedule a call to discuss your needs in detail',
      timeline: '2-3 business days',
      status: 'pending',
    },
    {
      icon: Sparkles,
      title: 'Custom Proposal',
      description: 'Receive a tailored solution with timeline and pricing',
      timeline: '3-5 business days',
      status: 'pending',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <CheckCircle className="w-24 h-24 text-orange-500 relative" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to A Startup Biz{companyName ? `, ${companyName}` : ''}!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for completing your onboarding
          </p>
          {submissionId && (
            <p className="text-sm text-gray-500">
              Reference ID: <span className="font-mono font-semibold">{submissionId}</span>
            </p>
          )}
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">What Happens Next?</h2>
          </div>

          <div className="space-y-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-100'
                          : 'bg-orange-100'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          step.status === 'completed'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {/* Schedule Call Card */}
          <Link
            href="/book-call"
            className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <Calendar className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold mb-2">Schedule Your Call</h3>
            <p className="text-orange-100 mb-4">
              Book a convenient time for your discovery call with our team
            </p>
            <div className="flex items-center gap-2 text-white font-semibold">
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Download Summary Card */}
          <button
            onClick={() => {
              // In production, this would generate and download a PDF
              alert('PDF download would be implemented here');
            }}
            className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
          >
            <Download className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Download Summary
            </h3>
            <p className="text-gray-600 mb-4">
              Get a PDF copy of your intake form for your records
            </p>
            <div className="flex items-center gap-2 text-orange-500 font-semibold">
              Download PDF
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            While You Wait...
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/services"
              className="p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="text-orange-500 mb-2 group-hover:scale-110 transition-transform inline-block">
                ✨
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Explore Services
              </h4>
              <p className="text-sm text-gray-600">
                Learn more about what we offer
              </p>
            </Link>

            <Link
              href="/blog"
              className="p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="text-orange-500 mb-2 group-hover:scale-110 transition-transform inline-block">
                📚
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Read Our Blog</h4>
              <p className="text-sm text-gray-600">
                Insights and best practices
              </p>
            </Link>

            <Link
              href="/about"
              className="p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
            >
              <div className="text-orange-500 mb-2 group-hover:scale-110 transition-transform inline-block">
                👥
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Meet the Team</h4>
              <p className="text-sm text-gray-600">
                Get to know who you'll work with
              </p>
            </Link>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-12 pb-8"
        >
          <p className="text-gray-600 mb-4">
            Have questions? We're here to help!
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/contact"
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>
            <Link
              href="/faqs"
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowRight className="w-5 h-5" />
              View FAQs
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ConfirmationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading confirmation...</p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationContent />
    </Suspense>
  );
}
