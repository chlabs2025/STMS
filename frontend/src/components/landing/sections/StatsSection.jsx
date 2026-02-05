import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
    { value: 500, label: "Farmers Empowered", suffix: "+" },
    { value: 1200, label: "Tons Processed", suffix: "MT" },
    { value: 15, label: "Global Partners", suffix: "+" },
    { value: 10, label: "Years Experience", suffix: "+" },
];

const StatsSection = () => {
    return (
        <section id="stats" className="py-24 bg-gradient-to-b from-white via-[#fff7f1] to-white border-y border-black/5 section-reveal">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-sm font-bold text-[#ff5a1f] tracking-widest uppercase mb-3">Impact At A Glance</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Numbers That Prove Our Scale</h3>
                    <p className="text-gray-600 text-base md:text-lg">
                        From farm partnerships to global distribution, these milestones show the strength of our tamarind network.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-gray-900">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="text-4xl md:text-5xl font-bold mb-2 flex justify-center items-center text-gray-900">
                                <AnimatedCounter end={stat.value} duration={2000} />
                                <span>{stat.suffix}</span>
                            </div>
                            <p className="text-gray-600 font-medium tracking-wide">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
