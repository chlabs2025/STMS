"use client"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/layout/Navbar'
import HeroSection from '../components/landing/sections/HeroSection'
import AboutSection from '../components/landing/sections/AboutSection'
import FeaturesSection from '../components/landing/sections/FeaturesSection'
import GallerySection from '../components/landing/sections/GallerySection'
import StatsSection from '../components/landing/sections/StatsSection'
import Footer from '../components/landing/sections/Footer'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  useEffect(() => {
    const elements = document.querySelectorAll('.section-reveal')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Global Styles for Animations */}
      <style>{`
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes revealUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }

                .animate-slideInUp {
                    animation: slideInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 1.5s ease-out forwards;
                }

                .section-reveal {
                    opacity: 0;
                    transform: translateY(24px);
                }

                .section-reveal.is-visible {
                    animation: revealUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                .float-slow {
                    animation: floatSlow 6s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-slideInUp,
                    .animate-fadeIn,
                    .section-reveal {
                        animation: none;
                    }
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                /* Hide Scrollbar */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <GallerySection />
      <Footer />
    </div>
  )
}

export default LandingPage
