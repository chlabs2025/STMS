
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const OurProductSection = () => {
    return (
        <section id="our-product" className="py-24 bg-white overflow-hidden section-reveal">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content Side */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-sm font-bold text-[#ff5a1f] tracking-wider capitalize mb-3">Our Product</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Gatagat: The Taste of <span className="text-[#ff5a1f]">Tradition</span>
                        </h3>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Experience the perfect balance of sweet and tangy flavors with our signature Gatagat.
                            Handcrafted from the finest Imli (Tamarind) and a secret blend of digestive spices,
                            it's not just a candy—it's a nostalgic journey in every bite.
                        </p>

                        <div className="space-y-4 mb-10">
                            {[
                                "100% Natural Ingredients",
                                "Authentic Traditional Recipe",
                                "Perfect Digestive Aid",
                                "No Artificial Preservatives"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#ff5a1f] flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button className="group inline-flex items-center gap-2 bg-[#ff5a1f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#e0450d] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200">
                            Order Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Image Side */}
                    <div className="order-1 lg:order-2 relative max-w-md mx-auto">
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                            {/* Using Rawimli.jpeg as a placeholder since it relates to Imli */}
                            <img
                                src="/Rawimli.jpeg"
                                alt="Gatagat - Premium Tamarind Product"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl animate-bounce-slow hidden md:block border border-orange-100">
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-[#ff5a1f]">100%</span>
                                <span className="text-sm text-gray-600 font-medium capitalize tracking-wide">Pure Imli</span>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-10 -right-10 w-24 h-24 bg-orange-100 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurProductSection;

