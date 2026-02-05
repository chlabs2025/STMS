import { CheckCircle2 } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-white section-reveal">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Image Side */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#ff5a1f]/10 rounded-3xl transform rotate-3 transition-transform group-hover:rotate-0" />
                        <div className="relative h-[500px] w-full bg-zinc-100 rounded-3xl overflow-hidden shadow-xl">
                            {/* Placeholder for About Image */}
                            <img
                                src="https://images.unsplash.com/photo-1599579040776-e17f4add4582?q=80&w=2574&auto=format&fit=crop"
                                alt="Processing tamarind"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div>
                        <h2 className="text-sm font-bold text-[#ff5a1f] tracking-wider uppercase mb-3">Who We Are</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Empowering Farmers, <br />
                            <span className="text-gray-400">Delivering Excellence.</span>
                        </h3>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Super Imli Traders is more than just a supply chain; we are a community-driven ecosystem. We focus on ethical sourcing, state-of-the-art processing, and reliable distribution to bring the finest tamarind to the world stage.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Fair trade practices with local farmers",
                                "Advanced cleaning and processing units",
                                "Sustainable packaging solutions",
                                "Global export quality standards"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#ff5a1f]/15 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-[#ff5a1f]" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
