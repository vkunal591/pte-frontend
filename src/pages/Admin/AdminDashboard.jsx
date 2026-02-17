import React from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { DollarSign, Share2, ThumbsUp, Star } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Earning"
                    value="$ 628"
                    icon={<DollarSign size={16} className="text-white" />}
                    bgIcon="bg-[#1A1F3D]"
                    subtitle="john@company.com"
                    textColor="text-slate-800"
                    dark={true}
                />
                <StatCard
                    title="Share"
                    value="2434"
                    icon={<Share2 size={16} className="text-orange-500" />}
                    bgIcon="bg-transparent"
                    textColor="text-slate-800"
                />
                <StatCard
                    title="Likes"
                    value="1259"
                    icon={<ThumbsUp size={16} className="text-orange-500" />}
                    bgIcon="bg-transparent"
                    textColor="text-slate-800"
                />
                <StatCard
                    title="Rating"
                    value="8,5"
                    icon={<Star size={16} className="text-orange-500 fill-orange-500" />}
                    bgIcon="bg-transparent"
                    textColor="text-slate-800"
                />
            </div>

            {/* Placeholders for Charts (Recharts removed due to React 19 incompatibility) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm flex items-center justify-center h-64 border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">Bar Chart Placeholder (Chart Library Pending)</p>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm flex items-center justify-center h-64 border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">Pie Chart Placeholder</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm flex items-center justify-center h-40 border-2 border-dashed border-slate-200">
                    <p className="text-slate-400">Wave Graph Placeholder</p>
                </div>
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-400 mb-2">Check Now</h3>
                        <div className="flex gap-2 mb-4">
                            <span className="w-8 h-8 flex items-center justify-center bg-[#1A1F3D] text-white rounded font-bold text-xs">12</span>
                            <span className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-400 rounded font-bold text-xs">13</span>
                        </div>
                    </div>
                    <button className="bg-orange-500 text-white py-3 rounded-xl font-bold uppercase text-sm shadow-xl shadow-orange-200">Check Now</button>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, bgIcon, subtitle, textColor, dark }) => (
    <div className={`p-6 rounded-3xl shadow-sm flex flex-col justify-between h-32 relative overflow-hidden transition-transform hover:scale-105 ${dark ? 'bg-[#1A1F3D]' : 'bg-white'}`}>
        <div className="flex justify-between items-start">
            <div>
                <span className={`text-xs font-medium uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{title}</span>
                <div className="flex items-center gap-1 mt-1">
                    <h3 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{value}</h3>
                    {dark && <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white ml-2">$</div>}
                </div>
                {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgIcon} shadow-sm`}>
                {icon}
            </div>
        </div>
    </div>
);

export default AdminDashboard;
