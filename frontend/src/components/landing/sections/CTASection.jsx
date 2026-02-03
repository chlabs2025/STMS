import { ArrowRight } from 'lucide-react';

const CTASection = ({ onGetStarted }) => {
    return (
        <section className="py-32 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4d4d4d_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    Ready to Transform Your Supply Chain?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
                    Join a network of efficiency, transparency, and quality. Experience the future of tamarind trading today.
                </p>

                <button
                    onClick={onGetStarted}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white font-semibold rounded-full overflow-hidden transition-all hover:bg-orange-700 hover:pr-10"
                >
                    <span className="relative z-10">Get Started Now</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    );
};

export default CTASection;
