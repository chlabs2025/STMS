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
        const elementId = id === 'process' ? 'how-it-works' : id;
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'backdrop-blur-[20px] bg-gradient-to-r from-white/70 via-white/50 to-white/70 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-saturate-200 py-4'
                : 'backdrop-blur-sm bg-white/10 border-b border-white/10 py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
                    <img
                        src="/stms-logo.svg"
                        alt="Super Imli Traders"
                        className={`h-10 w-auto transition-all duration-300 ${scrolled ? 'brightness-0' : 'brightness-0'}`}
                    />

                </div>

                {/* Centered Navigation */}
                <div className="hidden md:flex items-center gap-18 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {['About', 'Process', 'Gallery'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className={`text-sm font-medium hover:text-[#ff7a1a] transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:block">
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${scrolled
                            ? 'bg-[#ff5a1f] text-white hover:bg-[#e64f1b]'
                            : 'bg-[#ff5a1f] text-white hover:bg-[#e64f1b]'
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
                        <X className={scrolled ? 'text-gray-900' : 'text-gray-900'} />
                    ) : (
                        <Menu className={scrolled ? 'text-gray-900' : 'text-gray-900'} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-black/10 shadow-lg p-6 md:hidden flex flex-col gap-4">
                    {['About', 'Process', 'Gallery'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className="text-left text-lg font-medium text-gray-900 py-2 border-b border-black/10"
                        >
                            {item}
                        </button>
                    ))}
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        className="mt-2 w-full bg-[#ff5a1f] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                        Access Portal <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
