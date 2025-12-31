 'use client';
 
 import { motion, useInView } from 'framer-motion';
 import { useRef } from 'react';
 import { DollarSign, ArrowRight, Quote, AlertTriangle } from 'lucide-react';
 import Link from 'next/link';
 
 export default function ThousandDollarSolution() {
   const sectionRef = useRef<HTMLDivElement>(null);
   const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
 
   return (
     <section
       id="solution"
       ref={sectionRef}
       className="relative bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 sm:py-32 overflow-hidden"
     >
       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.6 }}
           className="text-center mb-12"
         >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 mb-6">
             <DollarSign className="w-4 h-4 text-[#ff6a1a]" />
             <span className="text-sm font-medium text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
               $1000 Solution
             </span>
           </div>
 
           <h2
             className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
             style={{ fontFamily: 'Montserrat, sans-serif' }}
           >
             The <span className="text-[#ff6a1a]">$1,000</span> Solution
           </h2>
           <p
             className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
             style={{ fontFamily: 'Montserrat, sans-serif' }}
           >
             A 30-minute clarity call designed to save you time, money, and painful mistakes.
           </p>
         </motion.div>
 
         {/* The $1,000 Investment Section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8, delay: 0.1 }}
           className="bg-black rounded-3xl p-8 sm:p-12 relative overflow-hidden"
         >
           {/* Background pattern */}
           <div className="absolute inset-0 opacity-10">
             <div
               className="absolute inset-0"
               style={{
                 backgroundImage:
                   'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                 backgroundSize: '32px 32px',
               }}
             />
           </div>
 
           <div className="relative z-10 max-w-4xl mx-auto">
             <div className="flex items-center justify-center gap-2 mb-6">
               <DollarSign className="w-8 h-8 text-[#ff6a1a]" />
               <h3
                 className="text-3xl sm:text-4xl font-bold text-white"
                 style={{ fontFamily: 'Montserrat, sans-serif' }}
               >
                 What You Get
               </h3>
             </div>
 
             <div
               className="space-y-6 text-white/80 text-lg text-center mb-8"
               style={{ fontFamily: 'Montserrat, sans-serif' }}
             >
               <p>
                 I charge <span className="text-[#ff6a1a] font-bold">$1,000 for a 30-minute Zoom call</span>. You’ll fill out our questionnaire
                 beforehand so I can prepare and understand your idea, funding, timeline, and plan.
               </p>
               <p>
                 During the call, I will tell you exactly what I see—good or bad. After the call, I follow up with an email explaining why your idea works
                 or why it doesn’t.
               </p>
               <p className="text-white font-semibold">
                 It will be the best $1,000 you ever spend for your future in business and in life.
               </p>
             </div>
 
             {/* Quote */}
             <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20">
               <Quote className="w-8 h-8 text-[#ff6a1a] mb-4" />
               <p className="text-white text-lg italic mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                 &quot;Think of this as insurance. If you listen to the advice, you will save yourself money, stress, and possibly your life savings. Stop
                 throwing good money after bad.&quot;
               </p>
               <p className="text-[#ff6a1a] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                 — Tory R. Zweigle
               </p>
             </div>
 
             {/* CTA */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/book-call">
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#ff6a1a] text-white font-bold text-lg shadow-lg shadow-[#ff6a1a]/30 hover:shadow-[#ff6a1a]/50 transition-all duration-300"
                   style={{ fontFamily: 'Montserrat, sans-serif' }}
                 >
                   Book Your $1,000 Clarity Call
                   <ArrowRight className="w-5 h-5" />
                 </motion.div>
               </Link>
               <Link href="/services">
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all duration-300"
                   style={{ fontFamily: 'Montserrat, sans-serif' }}
                 >
                   View All Services
                 </motion.div>
               </Link>
             </div>
           </div>
         </motion.div>
 
         {/* Final Warning/Truth Section */}
         <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={isInView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="mt-16 text-center max-w-3xl mx-auto"
         >
           <div className="bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
             <h4
               className="text-xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-2"
               style={{ fontFamily: 'Montserrat, sans-serif' }}
             >
               <AlertTriangle className="w-5 h-5 text-[#ff6a1a]" />
               The Bottom Line
             </h4>
             <p className="text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
               Most businesses fail within the first five years. Solid advice from someone seasoned can help you avoid the biggest potholes before you spend
               your savings.
             </p>
             <p className="text-gray-700 dark:text-gray-300 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
               <span className="text-[#ff6a1a] font-bold">My goal</span> is to help people understand whether they are true entrepreneurs—or wantrepreneurs.
             </p>
           </div>
         </motion.div>
       </div>
     </section>
   );
 }
 
