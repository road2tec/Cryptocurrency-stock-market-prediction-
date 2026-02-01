import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Zap } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (e) {
                localStorage.removeItem('token');
            }
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setUser(null);
        navigate('/');
    };

    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/' + id);
            return;
        }
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo(0, 0)}>
                    <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className={`text-2xl font-black tracking-tight ${scrolled ? 'text-white' : 'text-gray-900'}`}>
                        Crypto<span className="text-blue-500">Predict</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {['Home', 'Features', 'How It Works', 'About'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(`#${item.toLowerCase().replace(/\s+/g, '-')}`)}
                            className={`text-sm font-bold transition tracking-wide ${scrolled ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {item}
                        </button>
                    ))}

                    {/* Auth Buttons */}
                    {user ? (
                        <div className={`pl-6 flex items-center gap-4 border-l ${scrolled ? 'border-white/20' : 'border-gray-200'}`}>
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-sm font-bold text-blue-500 hover:text-blue-400 transition">
                                <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    Dashboard
                                </span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`text-sm font-bold transition hover:text-red-500 ${scrolled ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className={`pl-6 flex items-center gap-4 border-l ${scrolled ? 'border-white/20' : 'border-gray-200'}`}>
                            <Link to="/login" className={`text-sm font-bold transition ${scrolled ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'}`}>
                                Log In
                            </Link>
                            <Link to="/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
