import { ArrowDown } from 'lucide-react';
import CursorShower from '../ui/CursorShower';

const HeroSection = () => {
    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#ff741f]">
            {/* Minimal Background with Overlay */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Background matching original theme but modernized */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff741f] via-[#f7802b] to-[#fc9d51] opacity-100" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621961942700-1c9c4db96c78?q=80&w=2576&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            </div>

            {/* Subtle Interactive Element */}
            <CursorShower />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-medium border border-white/20 mb-6 backdrop-blur-sm animate-fadeIn">
                    EST. 2024 • PREMIUM TAMARIND SOURCE
                </span>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-tight animate-slideInUp drop-shadow-sm">
                    Nature's Best, <br />
                    <span className="text-white/90">
                        Delivered.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-fadeIn animation-delay-200">
                    We bridge the gap between local tamarind farmers and global markets, ensuring fair trade and premium quality processing every step of the way.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fadeIn animation-delay-500">
                    <button
                        onClick={scrollToAbout}
                        className="px-8 py-4 rounded-full bg-white text-[#ff741f] font-bold hover:bg-gray-50 transition-all flex items-center gap-2 group shadow-lg"
                    >
                        Learn More
                        <ArrowDown className="w-4 h-4 text-[#ff741f] group-hover:translate-y-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm">
                        Our Process
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToAbout}>
                <ArrowDown className="text-white/70 w-8 h-8" />
            </div>
        </section>
    );
};

export default HeroSection;
