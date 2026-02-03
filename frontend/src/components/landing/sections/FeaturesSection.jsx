import { Truck, ShieldCheck, Leaf, Globe } from 'lucide-react';

const features = [
    {
        icon: <Leaf className="w-8 h-8 text-orange-500" />,
        title: "Ethical Sourcing",
        description: "Direct partnerships with local farmers ensure fair prices and sustainable harvesting practices."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
        title: "Quality Assurance",
        description: " rigorous testing and grading processes to meet international food safety standards."
    },
    {
        icon: <Truck className="w-8 h-8 text-orange-500" />,
        title: "Efficient Logistics",
        description: "Optimized supply chain management reducing waste and ensuring timely delivery."
    },
    {
        icon: <Globe className="w-8 h-8 text-orange-500" />,
        title: "Global Reach",
        description: "Building strong connections to export high-quality tamarind to markets worldwide."
    }
];

const FeaturesSection = () => {
    return (
        <section id="process" className="py-24 bg-zinc-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-orange-600 tracking-wider uppercase mb-3">Why Choose Us</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Excellence in Every Step</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="mb-6 bg-orange-50 w-16 h-16 rounded-xl flex items-center justify-center">
                                {feature.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
