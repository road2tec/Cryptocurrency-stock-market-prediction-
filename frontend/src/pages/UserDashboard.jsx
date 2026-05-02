import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    TrendingUp, Activity, DollarSign, AlertTriangle, CheckCircle, Search, Clock,
    ArrowUpRight, ArrowDownRight, LayoutDashboard, History, Settings, LogOut, Bell, User, Zap, Shield, ChevronDown
} from 'lucide-react';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [coin, setCoin] = useState('Bitcoin');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [ticker, setTicker] = useState({ BTC: 42000, ETH: 2800, DOGE: 0.15 });
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Trader', email: 'trader@example.com' });

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email');
        if (storedName) setUser(prev => ({ ...prev, name: storedName }));
        if (storedEmail) setUser(prev => ({ ...prev, email: storedEmail }));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        navigate('/login');
    };

    // LIVE TICKER & HISTORY FETCH
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/history');
                setHistory(res.data);
            } catch (err) { console.error("History fetch error", err); }
        };
        fetchHistory();

        const interval = setInterval(() => {
            setTicker(prev => ({
                BTC: prev.BTC * (1 + (Math.random() * 0.002 - 0.001)),
                ETH: prev.ETH * (1 + (Math.random() * 0.003 - 0.0015)),
                DOGE: prev.DOGE * (1 + (Math.random() * 0.005 - 0.0025))
            }));
            if (Math.random() > 0.8) fetchHistory();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // PREDICTION LOGIC
    const handlePredict = async () => {
        setLoading(true);
        setPrediction(null);
        try {
            const res = await axios.post('http://localhost:5000/api/predict', { 
                coin, 
                email: user.email 
            });
            setPrediction(res.data);
            setActiveTab('market'); // Auto-switch to market view to show result

            // Refresh history
            const histRes = await axios.get('http://localhost:5000/api/history');
            setHistory(histRes.data);
        } catch (err) {
            alert('Prediction failed. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // MOCK CHART GENERATOR
    const generateChartData = (basePrice) => {
        const data = [];
        let currentPrice = basePrice * 0.9;
        for (let i = 0; i < 10; i++) {
            currentPrice = currentPrice * (1 + (Math.random() * 0.1 - 0.04));
            data.push({ name: `T-${10 - i}`, price: Math.round(currentPrice) });
        }
        data.push({ name: 'Now', price: basePrice });
        // Forecast
        let futurePrice = basePrice;
        for (let i = 0; i < 5; i++) {
            futurePrice = futurePrice * (1 + (Math.random() * 0.05 - 0.01));
            data.push({ name: `Fut-${i + 1}`, price: Math.round(futurePrice), isForecast: true });
        }
        return data;
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'market': return <MarketView coin={coin} prediction={prediction} loading={loading} handlePredict={handlePredict} setCoin={setCoin} generateChartData={generateChartData} />;
            case 'history': return <HistoryView history={history} />;
            case 'settings': return <SettingsView user={user} />;
            default: return <Overview ticker={ticker} history={history} handlePredict={handlePredict} setCoin={setCoin} coin={coin} loading={loading} user={user} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 text-blue-600 mb-8">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">Crypto<span className="text-blue-600">Predict</span></span>
                    </div>

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Dashboard</div>
                    <nav className="space-y-2">
                        <SidebarBtn icon={<LayoutDashboard />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <SidebarBtn icon={<TrendingUp />} label="Market Analysis" active={activeTab === 'market'} onClick={() => setActiveTab('market')} />
                        <SidebarBtn icon={<History />} label="My History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                    </nav>

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-2">Account</div>
                    <nav className="space-y-2">
                        <SidebarBtn icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="w-full py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 text-gray-600">
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10 text-gray-500">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
                        <p className="text-xs">Welcome back, {user.name}</p>
                    </div>
                    {/* Live Ticker Marquee */}
                    <div className="flex-1 mx-12 overflow-hidden mask-gradient relative h-8">
                        <div className="absolute animate-marquee whitespace-nowrap flex gap-8 items-center h-full">
                            <TickerItem symbol="BTC" price={ticker.BTC} />
                            <TickerItem symbol="ETH" price={ticker.ETH} />
                            <TickerItem symbol="DOGE" price={ticker.DOGE} decimals={4} />
                            <TickerItem symbol="SOL" price={145.20} />
                        </div>
                    </div>
                    <button className="p-2 relative hover:bg-gray-100 rounded-full transition">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </header>

                <div className="p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// --- SUB-VIEWS ---

const Overview = ({ ticker, history, handlePredict, setCoin, coin, loading, user }) => (
    <div className="space-y-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
            <div className="relative z-10 max-w-lg">
                <h3 className="text-3xl font-black mb-2">Market is <span className="text-green-300">Bullish</span> Today</h3>
                <p className="text-blue-100 mb-6">Bitcoin has surged +2.4% in the last 24h. Our AI detects a strong buying signal based on social sentiment.</p>
                <button
                    onClick={() => { setCoin('Bitcoin'); handlePredict(); }}
                    disabled={loading}
                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
                >
                    {loading ? 'Analyzing...' : 'Analyze Bitcoin Now'}
                </button>
            </div>
            {/* Decoration */}
            <div className="relative z-10 mt-6 md:mt-0 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Live Price</p>
                <p className="text-4xl font-mono font-bold">${ticker.BTC.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <div className="flex items-center gap-1 text-green-300 text-sm font-bold mt-2">
                    <TrendingUp size={16} /> +2.4%
                </div>
            </div>
            <Activity className="absolute -bottom-8 -right-8 w-64 h-64 text-white opacity-5" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {/* User Stats - Replaces redundant history list */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> My Performance
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-black text-gray-900">{history.length}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase">Total Scans</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                        Pro
                    </div>
                </div>
                <div className="mt-6 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">75% of monthly limit used</p>
            </div>

            {/* Favorite Asset */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-500" /> Top Asset
                </h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <span className="font-bold text-xl">BTC</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">Bitcoin</p>
                        <p className="text-xs text-gray-500">Most analyzed</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                            High Accuracy
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Alert - Summary only */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell size={18} className="text-red-500" /> Latest Alert
                </h3>
                {history.length > 0 ? (
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold text-gray-800">{history[0].coin}</span>
                            <span className="text-sm font-medium text-gray-500">{new Date(history[0].date).toLocaleTimeString()}</span>
                        </div>
                        <div className={`p-3 rounded-xl border ${history[0].alert.includes('GOOD') ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                            <p className={`font-bold text-sm ${history[0].alert.includes('GOOD') ? 'text-green-700' : 'text-red-700'}`}>
                                {history[0].alert}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No recent alerts.</p>
                )}
            </div>
        </div>
    </div>
);

const MarketView = ({ coin, prediction, loading, handlePredict, setCoin, generateChartData }) => (
    <div className="space-y-6 animate-fade-in-up">
        {/* Control Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <span className="font-bold text-gray-500">Asset:</span>
                <select
                    value={coin} onChange={(e) => setCoin(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="Bitcoin">Bitcoin (BTC)</option>
                    <option value="Ethereum">Ethereum (ETH)</option>
                    <option value="Dogecoin">Dogecoin (DOGE)</option>
                </select>
            </div>
            <button
                onClick={handlePredict} disabled={loading}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
                {loading ? 'Running AI Models...' : 'Run Prediction Model'}
            </button>
        </div>

        {prediction ? (
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Price Forecast</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={generateChartData(prediction.predicted_price)}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" hide />
                                <YAxis orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={['auto', 'auto']} />
                                <Tooltip />
                                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Signals */}
                <div className="space-y-6">
                    <div className={`p-8 rounded-3xl text-white text-center shadow-lg ${prediction.alert.includes('GOOD') ? 'bg-gradient-to-br from-green-500 to-emerald-700' : 'bg-gradient-to-br from-red-500 to-rose-700'}`}>
                        <div className="mb-4 opacity-50">
                            {prediction.alert.includes('GOOD') ? <TrendingUp size={48} className="mx-auto" /> : <AlertTriangle size={48} className="mx-auto" />}
                        </div>
                        <h2 className="text-3xl font-black uppercase mb-1">{prediction.alert.includes('GOOD') ? 'STRONG BUY' : 'HIGH RISK'}</h2>
                        <p className="opacity-80 text-sm font-medium">{prediction.alert}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                            <span className="text-gray-500 font-medium">Predicted Price</span>
                            <span className="text-xl font-bold text-gray-900">${prediction.predicted_price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Sentiment</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${prediction.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {prediction.sentiment}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                <Search className="w-12 h-12 opacity-20 mb-4" />
                <p>Select an asset and click "Run Prediction Model" to see results.</p>
            </div>
        )}
    </div>
);

const HistoryView = ({ history }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Historical Signal Log</h3>
        </div>
        <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                    <th className="px-6 py-4 text-left">Asset</th>
                    <th className="px-6 py-4 text-center">Sentiment</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Time</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">{h.coin}</td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${h.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {h.sentiment}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-gray-600">${h.predicted_price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-xs text-gray-400">{new Date(h.date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const SettingsView = ({ user }) => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 text-blue-600">
                    <Settings size={16} />
                </div>
            </div>
            <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">Pro Plan</span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">Verified</span>
                </div>
            </div>
            <button className="px-6 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
                Edit Profile
            </button>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-8">
            {/* General */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                    <User size={18} className="text-blue-600" /> Account Preferences
                </div>
                <div className="p-6 space-y-6">
                    <SettingItem label="Language" value="English (US)" />
                    <SettingItem label="Timezone" value="UTC-5 (Eastern Time)" />
                    <SettingItem label="Currency" value="USD ($)" />
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={18} className="text-purple-600" /> Notifications
                </div>
                <div className="p-6 space-y-6">
                    <ToggleItem label="Email Alerts" desc="Receive daily summaries" checked={true} />
                    <ToggleItem label="Price Triggers" desc="Alert when price moves >5%" checked={true} />
                    <ToggleItem label="Product Updates" desc="News about new features" checked={false} />
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 font-bold text-gray-900 flex items-center gap-2">
                    <Shield size={18} className="text-green-600" /> Security
                </div>
                <div className="p-6 space-y-6">
                    <ToggleItem label="Two-Factor Auth" desc="Secure your account" checked={true} />
                    <div className="pt-2">
                        <button className="text-blue-600 text-sm font-bold hover:underline">Change Password</button>
                    </div>
                </div>
            </div>

            {/* Billing */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden text-white">
                <div className="p-6 border-b border-white/10 font-bold flex items-center gap-2">
                    <DollarSign size={18} className="text-yellow-500" /> Billing
                </div>
                <div className="p-6">
                    <p className="text-gray-400 text-sm mb-4">Next billing date: <span className="text-white font-bold">March 1, 2026</span></p>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                        <span className="font-medium">Pro Plan</span>
                        <span className="font-bold text-xl">$29/mo</span>
                    </div>
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition">
                        Manage Subscription
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const SettingItem = ({ label, value }) => (
    <div className="flex justify-between items-center group cursor-pointer">
        <span className="text-gray-600 font-medium group-hover:text-blue-600 transition">{label}</span>
        <span className="text-gray-900 font-bold flex items-center gap-2">
            {value} <ChevronDown size={14} className="text-gray-400" />
        </span>
    </div>
);

const ToggleItem = ({ label, desc, checked }) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="text-gray-900 font-bold text-sm">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
        <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition ${checked ? 'bg-blue-600 justify-end' : 'bg-gray-200 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
        </div>
    </div>
);

// --- HELPERS ---

const SidebarBtn = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
        {React.cloneElement(icon, { size: 18, className: active ? 'text-blue-600' : 'text-gray-400' })}
        <span className="text-sm">{label}</span>
    </button>
);

const TickerItem = ({ symbol, price, decimals = 2 }) => (
    <div className="flex items-center gap-2 px-4 border-r border-gray-200">
        <span className="font-bold text-gray-400">{symbol}</span>
        <span className="font-mono text-gray-700 font-medium">${price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
        <ArrowUpRight size={14} className="text-green-500" />
    </div>
);

export default UserDashboard;
