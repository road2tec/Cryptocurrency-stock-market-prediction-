import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
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
            await axios.post('http://localhost:5000/api/signup', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
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

            {/* Form Side (Left) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="text-center mb-10">
                        <div className="inline-block p-3 rounded-full bg-blue-50 text-blue-600 mb-4 lg:hidden">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 font-medium">Start your journey to smarter trading today.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg text-sm flex items-center gap-3 animate-shake">
                            <div className="font-bold">Error:</div> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Full Name</label>
                            <input
                                type="text" name="name" required
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                placeholder="John Doe"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Email Address</label>
                            <input
                                type="email" name="email" required
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                placeholder="name@company.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Password</label>
                            <input
                                type="password" name="password" required
                                className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                placeholder="Create a strong password"
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 mt-2">Must be at least 8 characters.</p>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 flex justify-center items-center mt-4">
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Sign Up Free'}
                        </button>
                    </form>

                    {/* Social Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or sign up with</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition text-sm font-bold text-gray-700 w-full">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Continue with Google
                        </button>
                    </div>

                    <p className="mt-8 text-center text-gray-500 text-sm font-medium">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Visual Side (Right) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden text-white">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[120px] opacity-20"></div>

                <div className="relative z-10 p-16 max-w-xl">
                    <h2 className="text-4xl font-black mb-8 leading-tight">Reviewing the stats? <br /> Let AI do it for you.</h2>

                    <div className="grid gap-4">
                        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/15 transition cursor-default">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-bold">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Instant Sentiment Analysis</p>
                                <p className="text-xs text-gray-400">Scan 50k+ news sources in seconds.</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-4 hover:bg-white/15 transition cursor-default">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 font-bold">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">94% Prediction Accuracy</p>
                                <p className="text-xs text-gray-400">Backtested on 5 years of market data.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Signup;
