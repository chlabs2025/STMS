"use client"
import { useState, useEffect } from 'react'
import { MdLogin } from 'react-icons/md'
const GlassHeader = ({ onLogin }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <style>{`
                .logo-scrolled {
                    filter: invert(1) brightness(0);
                }
            `}</style>
            <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
                <div className={`transition-all duration-300 rounded-2xl ${scrolled
                    ? 'backdrop-blur-[20px] bg-gradient-to-br from-white/60 to-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 ring-1 ring-white/40 backdrop-saturate-200'
                    : 'backdrop-blur-[10px] bg-gradient-to-br from-white/30 to-white/10 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-saturate-150'
                    }`}>
                    <div className="px-6">
                        <div className="flex items-center justify-between h-14">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <img
                                    src="/stms-logo.svg"
                                    alt="SIT - Super Imli Traders"
                                    className={`h-8 w-auto transition-all duration-300 ${scrolled ? 'logo-scrolled' : ''}`}
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={onLogin}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-[#ff741f] text-white hover:bg-[#ff8c42] shadow-md hover:shadow-lg"
                            >
                                <MdLogin className="text-base" />
                                <span>Login</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default GlassHeader


