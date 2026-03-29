import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToHowItWorksSection = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
            {/* Minimal Background with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Background matching original theme but modernized */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fff4ec] via-white to-white opacity-100" />
                <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#ff5a1f]/20 blur-[140px] float-slow" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621961942700-1c9c4db96c78?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-white/70 text-[#ff5a1f] text-sm font-medium border border-[#ff5a1f]/20 mb-6 backdrop-blur-sm animate-fadeIn">
                    EST. 2004 • PREMIUM TAMARIND SOURCE
                </span>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 mb-8 leading-tight animate-slideInUp drop-shadow-sm">
                    Nature's Best, <br />
                    <span className="text-gray-600">
                        Delivered.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-12 font-medium leading-relaxed animate-fadeIn animation-delay-200 text-justify [text-align-last:center]">
                    We bridge the gap between local tamarind farmers and global markets, ensuring fair trade and premium quality processing every step of the way.
                </p>

                <div className="flex flex-row items-center justify-center gap-3 md:gap-4 animate-fadeIn animation-delay-500">
                    <button
                        onClick={scrollToAbout}
                        className="px-4 md:px-8 py-3.5 md:py-4 rounded-full bg-[#ff5a1f] text-white text-sm md:text-base font-bold hover:bg-[#e64f1b] transition-all flex items-center gap-2 group shadow-lg shadow-[#ff5a1f]/20"
                    >
                        Learn More
                    </button>
                    <button
                        onClick={scrollToHowItWorksSection}
                        className="px-4 md:px-8 py-3.5 md:py-4 rounded-full border-2 border-[#ff5a1f]/30 text-[#ff5a1f] text-sm md:text-base font-semibold hover:bg-[#ff5a1f]/10 transition-all backdrop-blur-sm">
                        Our Process
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToAbout}>
                <ArrowDown className="text-gray-500 w-8 h-8" />
            </div>
        </section>
    );
};

export default HeroSection;
