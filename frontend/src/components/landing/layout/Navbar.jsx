import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                    <img
                        src="/stms-logo.svg"
                        alt="Super Imli Traders"
                        className={`h-10 w-auto transition-all duration-300 ${scrolled ? 'brightness-0' : 'brightness-0 invert'}`}
                    />
                    <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
                        }`}>
                        Super Imli Traders
                    </span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {['About', 'Process', 'Gallery', 'Stats'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className={`text-sm font-medium hover:text-[#ff741f] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-200'
                                }`}
                        >
                            {item}
                        </button>
                    ))}

                    <button
                        onClick={() => navigate('/login')}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${scrolled
                                ? 'bg-[#ff741f] text-white hover:bg-[#e06316]'
                                : 'bg-white text-[#ff741f] hover:bg-gray-100'
                            }`}
                    >
                        Login
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className={scrolled ? 'text-black' : 'text-white'} />
                    ) : (
                        <Menu className={scrolled ? 'text-black' : 'text-white'} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg p-6 md:hidden flex flex-col gap-4">
                    {['About', 'Process', 'Gallery', 'Stats'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className="text-left text-lg font-medium text-gray-900 py-2 border-b border-gray-100"
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-2 w-full bg-[#ff741f] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                        Access Portal <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
