import React from 'react';
import { 
  Building2, 
  Users, 
  Store, 
  Truck, 
  ShieldCheck, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Wheat, 
  Sparkles,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const regionalActivityData = [
    { region: 'Nashik Cluster', farmers: 480, tonnageKg: 18500, gmvInr: 580000 },
    { region: 'Pune Junnar', farmers: 320, tonnageKg: 12400, gmvInr: 395000 },
    { region: 'Kolar Corridor', farmers: 540, tonnageKg: 24000, gmvInr: 720000 },
    { region: 'Indore Malwa', farmers: 290, tonnageKg: 16800, gmvInr: 410000 },
    { region: 'Karnal Belt', farmers: 210, tonnageKg: 22000, gmvInr: 1716000 },
  ];

  const valueShareComparison = [
    { name: 'Direct Farmer Share', traditional: 32, agrilink: 74 },
    { name: 'Logistics & Cold Chain', traditional: 18, agrilink: 14 },
    { name: 'Quality Inspection & Platform', traditional: 0, agrilink: 4 },
    { name: 'Intermediary Broker Markups', traditional: 50, agrilink: 0 },
  ];

  const pieColors = ['#059669', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Platform Command & Telemetry
            </span>
            <span className="text-xs text-slate-300">AgriLink Governance Node</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National Agricultural Aggregation & Logistics Oversight
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Real-time monitoring of farmer onboarding, FPO aggregation clusters, bulk purchase matching rates, and supply-chain efficiency gains.
          </p>
        </div>

        <div className="bg-emerald-900/80 border border-emerald-700/60 rounded-xl p-3.5 text-right">
          <div className="text-[10px] uppercase font-bold text-emerald-300">Gross Platform GMV</div>
          <div className="text-2xl font-black font-mono text-white">₹38,21,000</div>
          <span className="text-[10px] text-emerald-300 font-semibold">↑ 34.2% MoM growth</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">1,840</div>
          <p className="text-[11px] text-slate-500">Across 42 registered FPO federations</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Active Bulk Buyers</span>
            <Store className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">128</div>
          <p className="text-[11px] text-slate-500">Supermarkets, Hotels, Quick-Commerce</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Produce Aggregated</span>
            <Wheat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            93.7 <span className="text-xs font-normal text-slate-500">Tonnes</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">98.4% bulk match fulfillment</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Farmer Income Uplift</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">+32.4%</div>
          <p className="text-[11px] text-emerald-700 font-semibold">5 middleman layers bypassed</p>
        </div>
      </div>

      {/* Macro Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disintermediation & Value Realization Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Supply Chain Value Realization Breakdown (%)</span>
            </h3>
            <span className="text-xs text-slate-500">Traditional vs AgriLink</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueShareComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="traditional" name="Traditional 5-Layer Chain" fill="#ef4444" radius={[0, 4, 4, 0]} />
                <Bar dataKey="agrilink" name="AgriLink Direct Platform" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-950">
            <span className="font-bold">Key Economic Impact:</span> Small farmers receive <strong>74%</strong> of final wholesale value under AgriLink, compared to just <strong>32%</strong> under traditional intermediary channels.
          </div>
        </div>

        {/* Regional Activity Volume */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Regional Agricultural Aggregation Volume (kg)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Active Clusters
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val.toLocaleString('en-IN')} kg`, 'Aggregated Volume']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="tonnageKg" name="Aggregated Produce (kg)" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <span>Leading Aggregation Corridor: <strong>Kolar-Chittoor Hub (24 Tonnes)</strong></span>
            <span className="text-emerald-700 font-bold">100% On-Time Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};
