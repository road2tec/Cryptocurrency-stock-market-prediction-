import React from 'react';
import { Zap, Twitter, Linkedin, Facebook, Github, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-20 pb-12 font-sans text-gray-300">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight">Crypto<span className="text-blue-500">Predict</span></span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Pioneering the future of algorithmic trading with institutional-grade AI models accessible to everyone.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter size={18} />} />
                            <SocialIcon icon={<Linkedin size={18} />} />
                            <SocialIcon icon={<Github size={18} />} />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">API Access</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Integrations</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Carrers</a> <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold ml-1 border border-blue-500/30">Hiring</span></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition">Press Kit</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Stay Updated</h4>
                        <p className="text-sm text-gray-400 mb-4">Get the latest market insights delivered to your inbox weekly.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full text-white placeholder-gray-500"
                            />
                            <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                                <Mail size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2026 CryptoPredict Inc. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300 transition">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition border border-gray-700 hover:border-blue-600">
        {icon}
    </a>
);

export default Footer;
