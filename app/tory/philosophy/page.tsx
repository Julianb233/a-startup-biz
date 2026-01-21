import Image from 'next/image';
import Link from 'next/link';

export default function PhilosophyPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
                <Link href="/tory" className="text-2xl font-bold font-heading tracking-tight hover:text-orange-500 transition-colors">
                    TORY ZWEIGLE
                </Link>
                <div className="flex gap-6">
                    <Link href="/tory/journey" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">JOURNEY</Link>
                    <Link href="/tory/achievements" className="text-sm font-semibold tracking-widest hover:text-orange-500 transition-colors">ACHIEVEMENTS</Link>
                </div>
            </nav>

            {/* Hero Header */}
            <section className="relative py-32 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/tory/consultant.jpg"
                        alt="Philosophy Background"
                        fill
                        className="object-cover opacity-20 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold font-heading mb-8">
                        The Art & Soul of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Common Sense</span>
                    </h1>
                    <p className="text-2xl text-gray-300 font-light leading-relaxed">
                        "Business isn't about complexity. It's about seeing the obvious when everyone else is looking for the impossible."
                    </p>
                </div>
            </section>

            {/* Core Principles Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-2xl hover:border-orange-500/50 transition-colors duration-300 group">
                        <div className="text-orange-500 mb-6 group-transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading">High-Margin Thinking</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Why settle for 10% when you can have 800%? Tory's philosophy centers on identifying inefficiencies in the supply chain and owning the manufacturing process to unlock exponential profit margins.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-2xl hover:border-orange-500/50 transition-colors duration-300 group">
                        <div className="text-orange-500 mb-6 group-transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading">Global Connectivity</h3>
                        <p className="text-gray-400 leading-relaxed">
                            The world is your factory. By bridging the gap between Western innovation and Eastern manufacturing power, Tory enables businesses to scale at speeds that local-only competitors cannot match.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-zinc-900/50 border border-white/10 p-10 rounded-2xl hover:border-orange-500/50 transition-colors duration-300 group">
                        <div className="text-orange-500 mb-6 group-transform group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading">Continuous Education</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Knowledge is the only asset that compounds indefinitely. Through his books and mentorship, Tory emphasizes that the "basics" of business are often the most overlooked secrets to success.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-32 bg-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/tory/about_04.jpg')] bg-cover bg-center mix-blend-multiply opacity-30" />
                <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
                    <svg className="w-20 h-20 text-white/40 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM8.01691 21L8.01691 18C8.01691 16.8954 8.91234 16 10.0169 16H13.0169C13.5692 16 14.0169 15.5523 14.0169 15V9C14.0169 8.44772 13.5692 8 13.0169 8H9.01691C8.46462 8 8.01691 8.44772 8.01691 9V11C8.01691 11.5523 7.56919 12 7.01691 12H6.01691V5H16.0169V15C16.0169 18.3137 13.3306 21 10.0169 21H8.01691Z" />
                    </svg>
                    <blockquote className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight">
                        "I don't just teach you how to fish.<br />
                        I teach you how to <span className="text-black">own the pond</span>."
                    </blockquote>
                    <cite className="block mt-8 text-xl font-medium not-italic text-white/80">— Tory Zweigle</cite>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <h2 className="text-3xl font-bold mb-8">Ready to see the results?</h2>
                <Link
                    href="/tory/achievements"
                    className="inline-block px-12 py-4 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full text-xl font-bold transition-all duration-300"
                >
                    View Achievements
                </Link>
            </section>
        </main>
    );
}
