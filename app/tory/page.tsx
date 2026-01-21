import Image from 'next/image';
import Link from 'next/link';

export default function ToryPage() {
    return (
        <main className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/tory/Banner_Tory.jpg"
                        alt="Tory Zweigle"
                        fill
                        className="object-cover object-center opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
                    <h1 className="text-7xl md:text-9xl font-bold font-heading tracking-tighter mb-6 animate-fadeIn">
                        <span className="text-white drop-shadow-2xl">TORY</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 drop-shadow-2xl ml-4">
                            ZWEIGLE
                        </span>
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-200 font-light max-w-3xl mx-auto mb-12 leading-relaxed text-glow-orange animate-fadeIn animation-delay-2000">
                        The Art and Soul of Common Sense in Business
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center animate-fadeIn animation-delay-4000">
                        <Link
                            href="/tory/journey"
                            className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-lg font-bold transition-all duration-300 shadow-premium hover:shadow-premium-orange transform hover:scale-105"
                        >
                            Explore His Journey
                        </Link>
                        <Link
                            href="/tory/philosophy"
                            className="px-8 py-4 border border-white/30 hover:bg-white/10 backdrop-blur-sm text-white rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105"
                        >
                            Our Philosophy
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24 px-4 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl group tilt-card">
                            <Image
                                src="/assets/tory/about_02.jpg"
                                alt="Tory Zweigle Portrait"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8">
                                <p className="text-orange-400 font-bold tracking-widest uppercase mb-2">The Visionary</p>
                                <h3 className="text-3xl font-bold text-white">Inventor. Industrialist. Mentor.</h3>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-6xl font-bold font-heading leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    Building Bridges,
                                </span>
                                <br />
                                <span className="text-orange-500">Creating Wealth.</span>
                            </h2>
                            <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />

                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                For over two decades, Tory Zweigle has been the bridge between Western innovation and Eastern manufacturing. Starting as an inventor at 14, he has founded over <strong className="text-white">100 businesses</strong> and currently owns <strong className="text-white">22 factories</strong> in China.
                            </p>

                            <p className="text-xl text-gray-300 leading-relaxed font-light">
                                He doesn't just teach business; he lives it. His "Art and Soul of Common Sense" approach has helped countless entrepreneurs turn simple ideas into high-margin empires.
                            </p>

                            <div className="pt-4">
                                <Link href="/tory/journey" className="inline-flex items-center text-orange-500 hover:text-orange-400 font-bold text-lg group transition-colors">
                                    Read His Full Story
                                    <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Cards */}
            <section className="py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-heading">
                        Explore the <span className="text-orange-500">Legacy</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Journey */}
                        <Link href="/tory/journey" className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                            <Image
                                src="/assets/tory/about_03.jpg"
                                alt="The Journey"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">The Journey</h3>
                                <p className="text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity">From a 14-year-old inventor to a global business magnate.</p>
                            </div>
                        </Link>

                        {/* Card 2: Philosophy */}
                        <Link href="/tory/philosophy" className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                            <Image
                                src="/assets/tory/consultant.jpg"
                                alt="Philosophy"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">The Philosophy</h3>
                                <p className="text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity">Common sense strategies for uncommon results.</p>
                            </div>
                        </Link>

                        {/* Card 3: Achievements */}
                        <Link href="/tory/achievements" className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                            <Image
                                src="/assets/tory/inventor.jpg"
                                alt="Achievements"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Achievements</h3>
                                <p className="text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity">22 Factories. 100+ Businesses. 1 Legacy.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
