'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { ThinkingAnimation } from '@/components/animations/thinking-animation'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-900">

            {/* Background Image - High Quality "Up-Rendered" */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/tory-desk-books.jpg"
                    alt="Tory R. Zweigle at his desk"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={100}
                />
                {/* Gradient Overlay for Text Readability & blending animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-black/40 dark:from-gray-950/95 dark:via-gray-950/70 dark:to-transparent z-10"></div>
            </div>

            {/* 4K Animation Overlay - blended for "connected" feel */}
            <div className="absolute inset-0 z-10 opacity-60 mix-blend-overlay pointer-events-none">
                <ThinkingAnimation shape="circle" />
            </div>

            {/* Content Container */}
            <div className="container relative z-20 mx-auto px-4 md:px-6 lg:px-8 py-20 min-h-screen flex items-center justify-start">
                <div className="max-w-3xl w-full text-left flex flex-col items-start">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-start space-y-10"
                    >
                        {/* BIG LOGO */}
                        <div className="relative w-full max-w-[500px] h-auto mb-2 -ml-2">
                            <Image
                                src="/logo-new.jpg"
                                alt="A Start Up Biz Logo"
                                width={800}
                                height={300}
                                className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-normal"
                                priority
                            />
                        </div>

                        {/* HEADLINE - Updated Copy */}
                        <div className="space-y-6 bg-white/30 dark:bg-black/30 backdrop-blur-md p-8 -ml-6 rounded-3xl border border-white/20 shadow-2xl">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                My name is
                                <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff6a1a] to-[#d65d50]">
                                    Tory Zweigle
                                </span>
                            </h1>

                            <p className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold leading-relaxed">
                                and I am a <span className="text-[#ff6a1a]">Serial Entrepreneur</span>.
                            </p>

                            {/* STATS ROW */}
                            <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-[#ff6a1a]">
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className="font-bold text-gray-800 dark:text-white">Expert Authority</span>
                                </div>
                                <div className="h-6 w-px bg-gray-400 dark:bg-gray-500 hidden sm:block"></div>
                                <span className="text-gray-700 dark:text-gray-300 font-semibold tracking-wide uppercase text-sm">46+ Years Experience</span>
                            </div>
                        </div>

                        {/* CTA BUTTONS - Left aligned */}
                        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto pt-4">
                            <Link
                                href="/book-call"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#ff6a1a] text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-orange-500/40 hover:bg-[#e85d0f] hover:-translate-y-1 transition-all duration-300 transform hover:scale-105"
                            >
                                Start Your Journey
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <Link
                                href="#about"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all duration-300"
                            >
                                Meet Tory
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
