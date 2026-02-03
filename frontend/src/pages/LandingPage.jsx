"use client"
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/layout/Navbar'
import HeroSection from '../components/landing/sections/HeroSection'
import AboutSection from '../components/landing/sections/AboutSection'
import FeaturesSection from '../components/landing/sections/FeaturesSection'
import GallerySection from '../components/landing/sections/GallerySection'
import StatsSection from '../components/landing/sections/StatsSection'
import CTASection from '../components/landing/sections/CTASection'
import Footer from '../components/landing/sections/Footer'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-900">
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

                .animate-slideInUp {
                    animation: slideInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 1.5s ease-out forwards;
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
      <GallerySection />
      <StatsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  )
}

export default LandingPage
