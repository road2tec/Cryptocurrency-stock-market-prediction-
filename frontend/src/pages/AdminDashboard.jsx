import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
    Users, BarChart2, Shield, Activity, RefreshCw, LayoutDashboard, FileText, Bell, LogOut,
    Search, Filter, ChevronDown, MoreVertical, AlertTriangle, TrendingUp, Calendar
} from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate network delay for smooth skeleton loading effect
                const [usersRes, historyRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users'),
                    axios.get('http://localhost:5000/api/history')
                ]);
                setUsers(usersRes.data);
                setHistory(historyRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Admin fetch error", err);
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000); // Live polling
        return () => clearInterval(interval);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'users': return <UsersView users={users} />;
            case 'predictions': return <PredictionsView history={history} />;
            case 'alerts': return <AlertsView history={history} />;
            default: return <Overview users={users} history={history} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl z-20">
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 text-blue-600 mb-8">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <Shield size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">Admin<span className="text-blue-600">Panel</span></span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                    <nav className="space-y-2">
                        <SidebarBtn icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <SidebarBtn icon={<Users />} label="User Management" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                        <SidebarBtn icon={<Activity />} label="Predictions" active={activeTab === 'predictions'} onClick={() => setActiveTab('predictions')} />
                        <SidebarBtn
                            icon={<Bell />}
                            label="Alerts"
                            active={activeTab === 'alerts'}
                            onClick={() => setActiveTab('alerts')}
                            badge={history.filter(h => h.alert.includes('RISK')).length}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <span className="font-bold">A</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Admin User</p>
                                <p className="text-xs text-gray-400">Super Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Header */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
                        <p className="text-xs text-gray-500">Real-time system overview</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-500 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition">
                            <Search size={16} />
                            <input type="text" placeholder="Global search..." className="bg-transparent outline-none w-48 placeholder-gray-400" />
                        </div>
                        <button className="p-2 relative text-gray-500 hover:bg-gray-100 rounded-full transition">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// --- Sub-Views ---

const Overview = ({ users, history }) => (
    <div className="space-y-8 animate-fade-in-up">
        {/* KPI Grid */}
        <div className="grid md:grid-cols-4 gap-6">
            <KpiCard title="Total Users" value={users.length} change="+12.5%" icon={<Users />} color="blue" />
            <KpiCard title="Predictions" value={history.length} change="+8.2%" icon={<Activity />} color="purple" />
            <KpiCard title="Revenue" value="$0.00" change="0%" icon={<Shield />} color="green" />
            <KpiCard title="System Load" value="Normal" change="Stable" icon={<RefreshCw />} color="orange" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800">Prediction Volume</h3>
                    <select className="text-xs border-none bg-gray-50 rounded-lg px-2 py-1 text-gray-500 font-medium cursor-pointer outline-none"><option>Last 7 Days</option></select>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history.slice(0, 10).map((h, i) => ({ name: i, value: h.predicted_price }))}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" hide />
                            <YAxis orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6">User Types</h3>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#f59e0b' },
                                    { name: 'Users', value: users.filter(u => u.role !== 'admin').length, color: '#3b82f6' }
                                ]}
                                cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                                dataKey="value"
                            >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#f59e0b" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-3xl font-black text-gray-800">{users.length}</span>
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const UsersView = ({ users }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 className="font-bold text-gray-900 text-lg">User Directory</h3>
                <p className="text-sm text-gray-500">Manage system access and permissions.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-blue-200">
                + Add Member
            </button>
        </div>
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {users.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{u.name}</div>
                                    <div className="text-xs text-gray-500">{u.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                {u.role}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition">
                                <MoreVertical size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PredictionsView = ({ history }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search by coin..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition" />
            </div>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <Filter size={14} /> Filter
            </button>
        </div>

        <table className="w-full">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-semibold">
                <tr>
                    <th className="px-6 py-4 text-left">Asset</th>
                    <th className="px-6 py-4 text-left">Signal</th>
                    <th className="px-6 py-4 text-right">Predicted Price</th>
                    <th className="px-6 py-4 text-right">Time</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">{h.coin}</td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${h.alert.includes('GOOD') ? 'bg-green-100 text-green-700' :
                                h.alert.includes('RISK') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {h.alert.includes('GOOD') ? <TrendingUp size={12} /> : <AlertTriangle size={12} />}
                                {h.alert}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-gray-600">${h.predicted_price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right text-xs text-gray-400">{new Date(h.date).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AlertsView = ({ history }) => {
    const alerts = history.filter(h => h.alert.includes('RISK') || h.alert.includes('GOOD'));

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {alerts.length === 0 ? <p className="text-gray-400 col-span-3 text-center py-10">No alerts found.</p> : null}
            {alerts.map((a, i) => (
                <div key={i} className={`relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border transition hover:shadow-md ${a.alert.includes('RISK') ? 'border-red-100' : 'border-green-100'}`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-10 ${a.alert.includes('RISK') ? 'text-red-500' : 'text-green-500'}`}>
                        {a.alert.includes('RISK') ? <AlertTriangle size={80} /> : <TrendingUp size={80} />}
                    </div>
                    <div className="relative z-10">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold mb-4 ${a.alert.includes('RISK') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {a.alert.includes('RISK') ? 'CRITICAL RISK' : 'BUY SIGNAL'}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{a.coin}</h3>
                        <p className="text-gray-500 text-sm mb-6 flex items-center gap-2">
                            <Calendar size={14} /> {new Date(a.date).toLocaleString()}
                        </p>
                        <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Target</p>
                                <p className="font-mono font-bold text-gray-800">${a.predicted_price.toLocaleString()}</p>
                            </div>
                            <button className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition ${a.alert.includes('RISK') ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Components ---

const SidebarBtn = ({ icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        <div className="flex items-center gap-3">
            {React.cloneElement(icon, { size: 20, className: active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600' })}
            <span className="text-sm">{label}</span>
        </div>
        {badge > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                {badge}
            </span>
        )}
    </button>
);

const KpiCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 bg-${color}-50 text-${color}-600 rounded-xl`}>{icon}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${change.includes('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                {change}
            </span>
        </div>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{value}</h3>
        </div>
    </div>
);

export default AdminDashboard;
