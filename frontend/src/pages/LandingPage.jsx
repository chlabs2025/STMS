"use client"

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MdInventory,
    MdPeople,
    MdAnalytics,
    MdLocalShipping,
    MdEco,
    MdHandshake,
    MdWarehouse,
    MdTrendingUp,
    MdLogin
} from 'react-icons/md'

// ============================================
// Glass Header Component
// ============================================
const GlassHeader = ({ onLogin }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
            <div className={`transition-all duration-300 rounded-2xl ${scrolled
                ? 'backdrop-blur-xl bg-white/80 shadow-lg border border-white/20'
                : 'backdrop-blur-md bg-white/10 border border-white/10'
                }`}>
                <div className="px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <img
                                src="/stms-logo.svg"
                                alt="Super Imli Traders"
                                className={`h-8 w-auto transition-all duration-300 ${scrolled ? 'filter brightness-0' : 'filter brightness-0 invert'
                                    }`}
                            />
                            <span className={`text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-gray-800' : 'text-white'
                                }`}>
                                Super Imli Traders
                            </span>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={onLogin}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${scrolled
                                ? 'bg-[#ff741f] text-white hover:bg-[#ff8c42] shadow-md hover:shadow-lg'
                                : 'backdrop-blur-md bg-white/20 text-white border border-white/30 hover:bg-white/30'
                                }`}
                        >
                            <MdLogin className="text-base" />
                            <span>Login</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ============================================
// 3D Floating Element Component
// ============================================
const FloatingElement = ({ children, delay = 0, duration = 3, className = "" }) => {
    return (
        <div
            className={`animate-float ${className}`}
            style={{
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
            }}
        >
            {children}
        </div>
    )
}

// ============================================
// 3D Card Component with Tilt Effect
// ============================================
const Card3D = ({ children, className = "" }) => {
    const cardRef = useRef(null)
    const [transform, setTransform] = useState('')

    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    }

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-300 ease-out ${className}`}
            style={{ transform, transformStyle: 'preserve-3d' }}
        >
            {children}
        </div>
    )
}

// ============================================
// Glass Card Component
// ============================================
const GlassCard = ({ children, className = "" }) => {
    return (
        <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl ${className}`}>
            {children}
        </div>
    )
}

// ============================================
// Animated Counter Component
// ============================================
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const counterRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.5 }
        )
        if (counterRef.current) observer.observe(counterRef.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return
        let start = 0
        const increment = end / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [isVisible, end, duration])

    return (
        <span ref={counterRef} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    )
}

// ============================================
// Scroll Reveal Component
// ============================================
const ScrollReveal = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay * 1000)
                }
            },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [delay])

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                } ${className}`}
        >
            {children}
        </div>
    )
}

// ============================================
// Hero Section Component
// ============================================
const HeroSection = () => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff741f] via-[#ff8c42] to-[#ffab6b]">
            {/* Animated Background - Floating Tamarind Leaves/Logos */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large tamarind leaf - top left */}
                <FloatingElement delay={0} duration={4} className="absolute top-20 left-10">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-24 h-24 opacity-20 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.2}px) rotate(-15deg)` }}
                    />
                </FloatingElement>

                {/* Medium tamarind leaf - top right */}
                <FloatingElement delay={1} duration={5} className="absolute top-32 right-20">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-32 h-32 opacity-15 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.15}px) rotate(20deg)` }}
                    />
                </FloatingElement>

                {/* Small tamarind leaf - bottom left */}
                <FloatingElement delay={0.5} duration={6} className="absolute bottom-32 left-1/4">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-20 h-20 opacity-25 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.25}px) rotate(-30deg)` }}
                    />
                </FloatingElement>

                {/* Extra small leaf - center right */}
                <FloatingElement delay={2} duration={4.5} className="absolute top-1/3 right-1/4">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-16 h-16 opacity-20 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.1}px) rotate(45deg)` }}
                    />
                </FloatingElement>

                {/* Medium leaf - bottom right */}
                <FloatingElement delay={1.5} duration={5} className="absolute bottom-40 right-10">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-28 h-28 opacity-15 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.18}px) rotate(10deg)` }}
                    />
                </FloatingElement>

                {/* Small leaf - center left */}
                <FloatingElement delay={0.8} duration={4} className="absolute top-60 left-1/3">
                    <img
                        src="/leaf.svg"
                        alt=""
                        className="w-14 h-14 opacity-20 filter brightness-0 invert"
                        style={{ transform: `translateY(${scrollY * 0.12}px) rotate(-45deg)` }}
                    />
                </FloatingElement>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

                {/* Main Heading with Gradient Text */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="inline-block animate-slideInUp">Super Imli</span>
                    <br />
                    <span className="inline-block animate-slideInUp animation-delay-200 bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">
                        Traders
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-500">
                    Your trusted partner in tamarind processing. From raw imli collection to premium cleaned products —
                    we manage the complete supply chain with local vendors and bulk buyers.
                </p>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
                        <div className="w-2 h-3 bg-white/70 rounded-full animate-scrollDown" />
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// How It Works Section Component
// ============================================
const HowItWorksSection = () => {
    const steps = [
        {
            icon: MdEco,
            title: "Raw Imli Collection",
            description: "We procure quality raw tamarind and store it in our central godown for processing"
        },
        {
            icon: MdPeople,
            title: "Distribute to Vendors",
            description: "Raw imli is distributed to our network of trusted local freelancers and vendors for cleaning"
        },
        {
            icon: MdHandshake,
            title: "Quality Cleaning",
            description: "Vendors clean and process the tamarind, ensuring premium quality standards are met"
        },
        {
            icon: MdWarehouse,
            title: "Return to Godown",
            description: "Cleaned imli is returned to our godown, weighed, and prepared for bulk sale"
        },
        {
            icon: MdLocalShipping,
            title: "Bulk Distribution",
            description: "Premium cleaned tamarind is sold to buyers in tons, completing the supply chain"
        }
    ]

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50">
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full filter blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        How It <span className="text-[#ff741f]">Works</span>
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                        Our streamlined process ensures quality at every step
                    </p>
                </ScrollReveal>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-[#ff741f] to-orange-200 transform -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            return (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <Card3D>
                                        <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full min-h-[240px] group relative flex flex-col">
                                            {/* Step Number */}
                                            <div className="absolute -top-4 -right-2 w-8 h-8 bg-[#ff741f] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                                                {index + 1}
                                            </div>
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#ff741f] to-[#ff9b54] rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0">
                                                <IconComponent className="text-3xl text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center group-hover:text-[#ff741f] transition-colors flex-shrink-0">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm text-center leading-relaxed flex-1">
                                                {step.description}
                                            </p>
                                        </div>
                                    </Card3D>
                                </ScrollReveal>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// Features Section Component
// ============================================
const FeaturesSection = () => {
    const features = [
        {
            icon: MdInventory,
            title: "Stock Management",
            description: "Track raw and cleaned tamarind inventory with real-time updates and smart stock alerts"
        },
        {
            icon: MdPeople,
            title: "Vendor Management",
            description: "Manage your network of local vendors, assign stock, and track their cleaning progress"
        },
        {
            icon: MdAnalytics,
            title: "Analytics & Reports",
            description: "Gain insights with detailed dashboards showing stock flow, vendor performance, and sales"
        },
        {
            icon: MdTrendingUp,
            title: "Business Growth",
            description: "Scale your operations efficiently with our comprehensive management tools"
        }
    ]

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
                        Powerful <span className="text-[#ff741f]">Features</span>
                    </h2>
                    <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                        Everything you need to manage your tamarind trading business
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <ScrollReveal key={index} delay={index * 0.15}>
                                <Card3D>
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full group">
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#ff741f] to-[#ff9b54] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                            <IconComponent className="text-2xl text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#ff741f] transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </Card3D>
                            </ScrollReveal>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

// ============================================
// Stats Section Component
// ============================================
const StatsSection = () => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const stats = [
        { value: 78045, suffix: " KG", label: "Stock Managed" },
        { value: 150, suffix: "+", label: "Local Vendors" },
        { value: 99, suffix: "%", label: "Accuracy Rate" },
        { value: 500, suffix: " Tons", label: "Monthly Sales" }
    ]

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#ff741f] via-[#ff8c42] to-[#ff9b54]">
            {/* Parallax Background Elements */}
            <div
                className="absolute inset-0 opacity-20"
                style={{ transform: `translateY(${(scrollY - 1500) * 0.1}px)` }}
            >
                <div className="absolute top-10 left-20 w-40 h-40 border-2 border-white/30 rounded-full" />
                <div className="absolute bottom-20 right-32 w-60 h-60 border-2 border-white/20 rounded-full" />
                <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-white/25 rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
                        Trusted by <span className="text-orange-100">Traders</span>
                    </h2>
                </ScrollReveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={index} delay={index * 0.1}>
                            <Card3D>
                                <GlassCard className="p-8 text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <p className="text-white/80 font-medium">
                                        {stat.label}
                                    </p>
                                </GlassCard>
                            </Card3D>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ============================================
// CTA Section Component
// ============================================
const CTASection = ({ onGetStarted }) => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-50 rounded-full filter blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-40" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Ready to <span className="text-[#ff741f]">Streamline</span> Your Business?
                        </h2>
                        <p className="text-xl text-gray-600 mb-10">
                            Join Super Imli Traders and experience seamless tamarind trading management
                        </p>
                        <Card3D>
                            <button
                                onClick={onGetStarted}
                                className="px-12 py-5 bg-gradient-to-r from-[#ff741f] to-[#ff9b54] text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105"
                            >
                                Start Managing Now
                            </button>
                        </Card3D>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}

// ============================================
// Footer Component
// ============================================
const Footer = () => {
    return (
        <footer className="py-12 bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-3 mb-6 md:mb-0">
                        <img
                            src="/stms-logo.svg"
                            alt="Super Imli Traders"
                            className="h-10 w-auto filter brightness-0 invert"
                        />
                        <span className="text-xl font-bold">Super Imli Traders</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        © 2025 Super Imli Traders. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

// ============================================
// Main Landing Page Component
// ============================================
const LandingPage = () => {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/login')
    }

    return (
        <div className="min-h-screen overflow-x-hidden">
            {/* Custom Styles for Animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scrollDown {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-slideInUp {
          animation: slideInUp 1s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-scrollDown {
          animation: scrollDown 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>

            <GlassHeader onLogin={handleGetStarted} />
            <HeroSection />
            <HowItWorksSection />
            <FeaturesSection />
            <StatsSection />
            <CTASection onGetStarted={handleGetStarted} />
            <Footer />
        </div>
    )
}

export default LandingPage
