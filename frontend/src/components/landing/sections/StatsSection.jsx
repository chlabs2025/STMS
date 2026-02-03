import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
    { value: 500, label: "Farmers Empowered", suffix: "+" },
    { value: 1200, label: "Tons Processed", suffix: "MT" },
    { value: 15, label: "Global Partners", suffix: "+" },
    { value: 10, label: "Years Experience", suffix: "+" },
];

const StatsSection = () => {
    return (
        <section id="stats" className="py-20 bg-orange-600">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-4">
                            <div className="text-4xl md:text-5xl font-bold mb-2 flex justify-center items-center">
                                <AnimatedCounter end={stat.value} duration={2000} />
                                <span>{stat.suffix}</span>
                            </div>
                            <p className="text-orange-100 font-medium tracking-wide">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
