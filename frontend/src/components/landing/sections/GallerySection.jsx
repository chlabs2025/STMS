import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const galleryImages = [
    {
        title: "Raw Collection",
        desc: "Sourcing directly from farms",
        url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Sorting & Grading",
        desc: "Ensuring premium quality",
        url: "https://images.unsplash.com/photo-1595855793315-0219c6c74751?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Hygienic Packaging",
        desc: "Sealed for freshness",
        url: "https://images.unsplash.com/photo-1605626966159-88339b362031?q=80&w=2670&auto=format&fit=crop"
    },
    {
        title: "Distribution",
        desc: "Reaching global markets",
        url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
    }
];

const GallerySection = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="gallery" className="py-24 bg-zinc-950 text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex items-end justify-between">
                <div>
                    <h2 className="text-sm font-bold text-orange-500 tracking-wider uppercase mb-3">Our Work</h2>
                    <h3 className="text-4xl font-bold">Captured Moments</h3>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto px-6 pb-8 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {galleryImages.map((img, idx) => (
                    <div
                        key={idx}
                        className="min-w-[300px] md:min-w-[400px] h-[500px] relative group rounded-2xl overflow-hidden snap-center cursor-pointer"
                    >
                        <img
                            src={img.url}
                            alt={img.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                            <h4 className="text-2xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</h4>
                            <p className="text-gray-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
