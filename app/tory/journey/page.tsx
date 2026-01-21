import Image from 'next/image';
import Link from 'next/link';

export default function JourneyPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
                <Link href="/tory" className="text-2xl font-bold font-heading tracking-tight hover:text-orange-500 transition-colors">
                    TORY ZWEIGLE
                </Link>
                <div className="flex gap-6">
                    <Link href="/tory/philosophy" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">PHILOSOPHY</Link>
                    <Link href="/tory/achievements" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">ACHIEVEMENTS</Link>
                </div>
            </nav>

            <section className="relative pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-bold font-heading mb-24 text-center">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Journey</span>
                </h1>

                <div className="space-y-32 relative">
                    {/* Timeline center line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/50 to-transparent hidden md:block" />

                    {/* Item 1: The Spark */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 md:text-right pr-0 md:pr-12">
                            <span className="text-orange-500 font-bold tracking-widest text-sm mb-2 block">THE BEGINNING</span>
                            <h2 className="text-4xl font-bold mb-6">The High-Torque Inventor</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                It started at age 14. While other kids were playing games, Tory was engineering solutions. His first invention, a high-torque motor mount, wasn't just a hobby project—it was the spark of a lifelong obsession with manufacturing and efficiency.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 h-[400px] relative rounded-2xl overflow-hidden shadow-premium-orange group">
                            <Image
                                src="/assets/tory/inventions/inventor_bike.jpeg"
                                alt="Original Electric Bike Prototype"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                            <div className="absolute bottom-6 left-6">
                                <span className="text-white/80 text-sm font-mono">FIG. 001 - PROTOTYPE</span>
                            </div>
                        </div>
                    </div>

                    {/* Item 2: The Expansion */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-1 h-[400px] relative rounded-2xl overflow-hidden shadow-premium group">
                            <Image
                                src="/assets/tory/publisher.jpg"
                                alt="Business Expansion"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="order-2 pl-0 md:pl-12">
                            <span className="text-orange-500 font-bold tracking-widest text-sm mb-2 block">THE GROWTH</span>
                            <h2 className="text-4xl font-bold mb-6">100+ Businesses</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                From real estate to retail, art to publishing. Tory didn't just stick to one lane; he mastered the highway. Over the years, he has founded and developed over 100 distinct businesses, proving that the principles of success are universal across industries.
                            </p>
                        </div>
                    </div>

                    {/* Item 3: The Bridge */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 md:text-right pr-0 md:pr-12">
                            <span className="text-orange-500 font-bold tracking-widest text-sm mb-2 block">THE GLOBAL STAGE</span>
                            <h2 className="text-4xl font-bold mb-6">The China Connection</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Recognizing the power of global manufacturing early, Tory built a bridge where others saw a barrier. Today, he owns 22 factories in China and has maintained a "special relationship" with the country for over two decades, navigating complex markets with ease.
                            </p>
                        </div>
                        <div className="order-1 md:order-2 h-[400px] relative rounded-2xl overflow-hidden shadow-premium-orange group">
                            <Image
                                src="/assets/tory/about_03.jpg"
                                alt="Global Manufacturing"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Item 4: The Legacy */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="order-1 h-[400px] relative rounded-2xl overflow-hidden shadow-premium group">
                            <Image
                                src="/assets/tory/Banner_Tory.jpg"
                                alt="Mentorship"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="order-2 pl-0 md:pl-12">
                            <span className="text-orange-500 font-bold tracking-widest text-sm mb-2 block">THE MISSION</span>
                            <h2 className="text-4xl font-bold mb-6">Edifying the Next Generation</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Now, Tory focuses on passing the torch. Through his consultancy and mentorship, he helps ambitious entrepreneurs skip the learning curve, avoid costly mistakes, and achieve profit margins that defy industry standards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <Link
                        href="/tory/philosophy"
                        className="inline-block px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xl font-bold transition-all duration-300 shadow-premium hover:shadow-premium-orange transform hover:scale-105"
                    >
                        Discover His Philosophy
                    </Link>
                </div>
            </section>
        </main>
    );
}
