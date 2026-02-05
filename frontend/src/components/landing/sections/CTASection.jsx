import { ArrowRight } from 'lucide-react';

const CTASection = ({ onGetStarted }) => {
    return (
        <section className="py-32 bg-white relative overflow-hidden flex items-center justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#ff5a1f]/15 blur-[140px]" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Ready to Transform Your Supply Chain?
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light">
                    Join a network of efficiency, transparency, and quality. Experience the future of tamarind trading today.
                </p>

                <button
                    onClick={onGetStarted}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#ff5a1f] text-white font-semibold rounded-full overflow-hidden transition-all hover:bg-[#e64f1b] hover:pr-10 shadow-lg shadow-[#ff5a1f]/20"
                >
                    <span className="relative z-10">Get Started Now</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    );
};

export default CTASection;
