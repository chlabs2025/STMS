import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-50 text-gray-600 py-16 border-t border-black/5 section-reveal">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <img
                            src="/stms-logo.svg"
                            alt="SIT - Super Imli Traders"
                            className="h-10 w-auto mb-6 brightness-0"
                        />
                        <p className="text-sm leading-relaxed mb-6">
                            Redefining the tamarind supply chain with transparency, quality, and innovation. Connecting nature to your doorstep.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-[#ff5a1f] hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm">
                            {['Home', 'About Us', 'Our Process', 'Products', 'Contact'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-[#ff5a1f] transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm">
                            {['FAQ', 'Privacy Policy', 'Terms of Service', 'Shipping Info'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="hover:text-[#ff5a1f] transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#ff5a1f] shrink-0 mt-1" />
                                <span>123 Market Yard, Tamarind Road,<br />Bangalore, KA 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-[#ff5a1f] shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-[#ff5a1f] shrink-0" />
                                <span>info@superimlitraders.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; 2004 SIT - Super Imli Traders. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
