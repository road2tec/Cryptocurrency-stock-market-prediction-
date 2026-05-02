import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            localStorage.setItem('email', res.data.email);

            navigate(res.data.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Absolute Back Link */}
            <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-blue-600 transition flex items-center gap-2 font-bold text-sm z-20">
                <ArrowLeft size={16} />
                Back to Home
            </Link>

            {/* Visual Side (Left) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden text-white">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-overlay filter blur-[120px] opacity-20"></div>

                <div className="relative z-10 p-16 max-w-xl">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-8 border border-white/10">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <h2 className="text-5xl font-black mb-6 leading-tight tracking-tight">Welcome back to the future.</h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Join 50,000+ traders using AI to outperform the market. Your dashboard is ready.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={20} />
                            <span className="font-semibold text-gray-200">Real-time market signals</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={20} />
                            <span className="font-semibold text-gray-200">Portfolio risk analysis</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={20} />
                            <span className="font-semibold text-gray-200">Institutional-grade data</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="text-center mb-10">
                        <div className="inline-block p-3 rounded-full bg-gray-100 text-gray-900 mb-4 lg:hidden">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">Sign In</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg text-sm flex items-center gap-3 animate-shake">
                            <div className="font-bold">Error:</div> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Email Address</label>
                            <input
                                type="email" name="email" required
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition shadow-sm"
                                placeholder="name@company.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold text-xs uppercase tracking-wider">Password</label>
                                <a href="#" className="text-sm text-blue-600 font-bold hover:text-blue-700">Forgot password?</a>
                            </div>
                            <input
                                type="password" name="password" required
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition shadow-sm"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl hover:bg-black transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center">
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Social Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition text-sm font-bold text-gray-700 w-full">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Continue with Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
