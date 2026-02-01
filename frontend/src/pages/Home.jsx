import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Zap, CheckCircle, TrendingUp, Users, Lock, ChevronRight, Activity, Cpu, Globe, Star, Quote } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const Home = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    const mockData = [
        { name: '1', value: 400 }, { name: '2', value: 300 }, { name: '3', value: 550 },
        { name: '4', value: 450 }, { name: '5', value: 700 }, { name: '6', value: 650 },
        { name: '7', value: 800 }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <div id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-blue-100/40 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-100/40 to-transparent rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3"></div>

                <div className="container mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center z-10 relative">

                    {/* Text Content */}
                    <div className="text-left space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            v2.0: AI-Powered Insights Live
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                            Predict the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Crypto</span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                            Leverage institutional-grade AI models to analyze market sentiment and forecast price trends with 94% accuracy.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                Live Demo
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-8 text-sm font-bold text-gray-400">
                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> No credit card required</div>
                            <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> 14-day free trial</div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative hidden lg:block perspective-1000">
                        <div className="relative transform rotate-y-6 rotate-x-3 hover:rotate-0 transition duration-700 ease-out shadow-2xl rounded-2xl bg-white border border-gray-100 p-2">
                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                <div className="h-8 border-b border-gray-200 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-6 bg-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase">Bitcoin Forecast</p>
                                            <h3 className="text-2xl font-black text-gray-900">$48,250.00</h3>
                                        </div>
                                        <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-bold flex items-center gap-1">
                                            <TrendingUp size={16} /> +12%
                                        </div>
                                    </div>
                                    <div className="h-40 w-full bg-blue-50/50 rounded-xl overflow-hidden relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={mockData}>
                                                <defs>
                                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fill="url(#colorVal)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">New Signal</p>
                                <p className="text-xs text-gray-500">ETH Buy @ $2,800</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TRUST BADGES --- */}
            <div className="py-10 border-y border-gray-50 bg-white">
                <div className="container mx-auto px-6 flex flex-wrap justify-center gap-12 opacity-30 grayscale items-center">
                    <span className="text-2xl font-black font-serif">Bloomberg</span>
                    <span className="text-2xl font-black font-serif">Forbes</span>
                    <span className="text-2xl font-black font-serif">TechCrunch</span>
                    <span className="text-2xl font-black font-serif">CoinDesk</span>
                    <span className="text-2xl font-black font-serif">Reuters</span>
                </div>
            </div>

            {/* --- FEATURES GRID --- */}
            <div id="features" className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">Why CryptoPredict?</span>
                        <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Intelligence, Simplified.</h2>
                        <p className="text-xl text-gray-500 font-medium leading-relaxed">We decode millions of data points effectively, so you can focus on executing your strategy.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart2 className="w-6 h-6 text-blue-600" />}
                            title="Predictive Analytics"
                            desc="Proprietary ML algorithms trained on 5+ years of OHLCV data to forecast price movements with high precision."
                            color="blue"
                        />
                        <FeatureCard
                            icon={<Activity className="w-6 h-6 text-purple-600" />}
                            title="Sentiment Engine"
                            desc="Real-time NLP analysis of Twitter, Reddit, and News to quantify market fear, greed, and hype cycles."
                            color="purple"
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-green-600" />}
                            title="Risk Management"
                            desc="Automated risk scoring identifies rugs, high-volatility traps, and safe entry points instantly."
                            color="green"
                        />
                    </div>
                </div>
            </div>

            {/* --- HOW IT WORKS --- */}
            <div id="how-it-works" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">Workflow</span>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">From Sign-up to Signal in Seconds.</h2>
                            <p className="text-lg text-gray-500 mb-8">Stop wasting time with complex charts. Our platform simplifies the trading process into three easy steps.</p>

                            <div className="space-y-8">
                                <StepItem number="01" title="Create Account" desc="Sign up in 30 seconds. No credit card required for the trial." />
                                <StepItem number="02" title="Select Asset" desc="Choose from Bitcoin, Ethereum, or 50+ other altcoins." />
                                <StepItem number="03" title="Get AI Insight" desc="Receive instant buy/sell signals and risk analysis." />
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            {/* Visual representation of workflow */}
                            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">analysis_result.json</span>
                                </div>
                                <div className="space-y-4 font-mono text-sm leading-relaxed opacity-90">
                                    <p><span className="text-purple-400">def</span> <span className="text-yellow-400">analyze_market</span>(coin):</p>
                                    <p className="pl-4">sentiment = <span className="text-green-400">"Bullish"</span></p>
                                    <p className="pl-4">volatility = <span className="text-blue-400">"Low"</span></p>
                                    <p className="pl-4"><span className="text-purple-400">return</span> Signal(<span className="text-green-400">"BUY"</span>)</p>
                                    <p className="text-gray-500 mt-4">// AI Confidence: 94.2%</p>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TESTIMONIALS (New) --- */}
            <div className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">Community</span>
                        <h2 className="text-4xl font-black text-gray-900">Loved by Traders</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Alex Morgan"
                            role="Day Trader"
                            text="The sentiment analysis is a game changer. I used to spend hours on Twitter, now I get the pulse of the market in seconds."
                        />
                        <TestimonialCard
                            name="Sarah Chen"
                            role="Crypto Analyst"
                            text="Finally, a tool that cuts through the noise. The price predictions have been uncannily accurate for my ETH swings."
                        />
                        <TestimonialCard
                            name="David Miller"
                            role="Hobbyist Investor"
                            text="I'm not a pro, but CryptoPredict makes me feel like one. Simple interface, powerful data. Highly recommended."
                        />
                    </div>
                </div>
            </div>

            {/* --- ABOUT SECTION --- */}
            <div id="about" className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-3 block">Our Mission</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-8">Democratizing Financial Intelligence</h2>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed mb-6">
                        CryptoPredict was founded by a team of ex-Wall Street quants and Google AI engineers. We believe that professional-grade market data shouldn't be reserved for hedge funds.
                    </p>
                    <div className="grid grid-cols-3 gap-8 mt-12">
                        <div>
                            <Globe className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="font-bold text-gray-900">Global Reach</p>
                        </div>
                        <div>
                            <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="font-bold text-gray-900">Community First</p>
                        </div>
                        <div>
                            <Cpu className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="font-bold text-gray-900">AI Driven</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CTA SECTION --- */}
            <div className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="relative bg-gray-900 rounded-[2.5rem] p-12 md:p-24 text-center text-white shadow-2xl overflow-hidden isolated">
                        {/* Background Gradients */}
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[128px] opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[128px] opacity-40 translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to outperform the market?</h2>
                            <p className="text-xl text-gray-300">Join thousands of smart investors who are using AI to make better trading decisions today.</p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/signup" className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-400 transition shadow-lg shadow-blue-900/20">
                                    Get Started Free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Note: Global Footer is rendered by Layout in App.jsx */}
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${color}-50 group-hover:bg-${color}-100 transition-colors`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 font-medium leading-relaxed">{desc}</p>
        <div className={`mt-6 flex items-center gap-2 text-${color}-600 font-bold text-sm group-hover:gap-3 transition-all cursor-pointer`}>
            Learn more <ChevronRight size={14} />
        </div>
    </div>
);

const StepItem = ({ number, title, desc }) => (
    <div className="flex gap-6 items-start">
        <div className="text-2xl font-black text-gray-200">{number}</div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500">{desc}</p>
        </div>
    </div>
);

const TestimonialCard = ({ name, role, text }) => (
    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex gap-1 text-yellow-400 mb-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
        </div>
        <p className="text-gray-600 mb-6 italic leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">
                {name.charAt(0)}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-900">{name}</p>
                <p className="text-xs text-gray-400">{role}</p>
            </div>
        </div>
    </div>
);

export default Home;
