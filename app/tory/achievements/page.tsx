'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CallbackCategory = 'all' | 'inventions' | 'businesses' | 'publishing';

export default function AchievementsPage() {
    const [activeCategory, setActiveCategory] = useState<CallbackCategory>('all');

    const galleryItems = [
        // Inventions
        { src: '/assets/tory/inventions/inventor_bike.jpeg', category: 'inventions', title: 'Start of a Revolution', size: 'large' },
        { src: '/assets/tory/inventions/EB_01.jpg', category: 'inventions', title: 'Electric Mobility', size: 'small' },
        { src: '/assets/tory/inventions/EB_02.jpg', category: 'inventions', title: 'Prototype Engineering', size: 'small' },
        { src: '/assets/tory/inventions/EB_03.jpg', category: 'inventions', title: 'Advanced Mechanics', size: 'medium' },

        // Businesses
        { src: '/assets/tory/businesses/glove_01.jpg', category: 'businesses', title: 'Precision Manufacturing', size: 'medium' },
        { src: '/assets/tory/businesses/glove_02.jpg', category: 'businesses', title: 'Global Supply Chain', size: 'small' },
        { src: '/assets/tory/businesses/res_01.jpg', category: 'businesses', title: 'Modular Architecture', size: 'large' },
        { src: '/assets/tory/businesses/res_02.jpg', category: 'businesses', title: 'Innovative Spaces', size: 'small' },
        { src: '/assets/tory/businesses/wall_01.jpg', category: 'businesses', title: 'Artistic Infrastructure', size: 'medium' },

        // Publishing
        { src: '/assets/tory/publishing/publisher_book.jpg', category: 'publishing', title: 'Bestselling Author', size: 'medium' },
        { src: '/assets/tory/publishing/publisher_mag.jpg', category: 'publishing', title: 'Media Features', size: 'small' },
    ];

    const filteredItems = activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeCategory);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <Link href="/tory" className="text-2xl font-bold font-heading tracking-tight hover:text-orange-500 transition-colors">
                    TORY ZWEIGLE
                </Link>
                <div className="flex gap-6">
                    <Link href="/tory/journey" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">JOURNEY</Link>
                    <Link href="/tory/philosophy" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">PHILOSOPHY</Link>
                </div>
            </nav>

            <section className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fadeIn">
                    <h1 className="text-6xl md:text-8xl font-bold font-heading mb-8">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Empire</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A visual archive of innovation. From patents to production lines, explore the tangible proof of Tory's methodology.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fadeIn animation-delay-2000">
                    {['all', 'inventions', 'businesses', 'publishing'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat as CallbackCategory)}
                            className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 uppercase
                ${activeCategory === cat
                                    ? 'bg-orange-600 text-white shadow-premium-orange scale-105'
                                    : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.src}
                            className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-premium-orange transition-all duration-500
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'medium' ? 'md:row-span-2' : ''}
              `}
                        >
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {item.category}
                                </span>
                                <h3 className="text-2xl font-bold text-white drop-shadow-md">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-32 text-center pb-20">
                    <h3 className="text-2xl font-light mb-8 font-heading">Inspired by the scale of execution?</h3>
                    <Link
                        href="/"
                        className="inline-block px-12 py-5 bg-white text-black hover:bg-orange-500 hover:text-white rounded-full text-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                        Work With Him
                    </Link>
                </div>
            </section>
        </main>
    );
}
