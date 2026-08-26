import React, { useState } from 'react';
import { UserRole } from '../types';
import { CURRENT_USERS } from '../data/mockData';
import { 
  Sparkles, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  Store, 
  LayoutDashboard, 
  Bell, 
  PlayCircle,
  Wheat,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onStartDemoTour: () => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onStartDemoTour,
  unreadNotifsCount,
  onOpenNotifs,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const currentUser = CURRENT_USERS[currentRole];

  const navTabs = [
    { id: 'marketplace', label: 'AI Bulk Match ⭐', icon: Store, badge: 'Core Demo' },
    { id: 'logistics', label: 'Smart Logistics', icon: Truck },
    { id: 'forecast', label: 'AI Demand Forecast', icon: TrendingUp, badge: 'Gemini' },
    { id: 'quality', label: 'Quality & Trust Record', icon: ShieldCheck },
    { id: 'farmer_portal', label: currentRole === 'fpo' ? 'FPO Aggregation' : 'Farmer Portal', icon: Wheat },
    { id: 'admin', label: 'Admin Command', icon: LayoutDashboard },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar: Live Mandi Price Ticker & Problem Statement Tag */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-emerald-700/90 text-emerald-100 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
            Live Mandi Feed
          </span>
          <div className="flex items-center gap-4 text-xs font-mono tracking-tight text-emerald-200">
            <span>🍅 Nashik Tomato: <strong className="text-white">₹28.0/kg</strong> <span className="text-emerald-300 font-bold">↑4.2%</span></span>
            <span className="text-emerald-700">|</span>
            <span>🧅 Lasalgaon Onion: <strong className="text-white">₹33.5/kg</strong> <span className="text-emerald-300 font-bold">↑2.1%</span></span>
            <span className="text-emerald-700">|</span>
            <span>🥔 Indore Potato: <strong className="text-white">₹22.0/kg</strong> <span className="text-amber-300 font-bold">↓1.5%</span></span>
            <span className="text-emerald-700">|</span>
            <span>🌶️ Chittoor Chilli: <strong className="text-white">₹42.0/kg</strong> <span className="text-emerald-300 font-bold">↑6.8%</span></span>
            <span className="text-emerald-700">|</span>
            <span>🌾 Karnal Basmati: <strong className="text-white">₹78.0/kg</strong> <span className="text-emerald-300 font-bold">↑1.2%</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto text-[11px] font-medium text-emerald-200">
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-700/60">
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            SIH Problem: 26033 (Agri Supply-Chain Optimization)
          </span>
          <button
            onClick={onStartDemoTour}
            className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold px-3 py-0.5 rounded-full shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Start 60-Second Demo Presentation Script"
          >
            <PlayCircle className="w-3.5 h-3.5 fill-slate-900 text-amber-400" />
            <span>60s SIH Demo Tour</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onTabChange('marketplace')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Wheat className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900">Agri<span className="text-emerald-600">Link</span></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    B2B AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">Direct Farm-to-Buyer Aggregation & Logistics</p>
              </div>
            </div>
          </div>

          {/* Persona Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                title="Switch Active Persona for Demo"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentRole === 'farmer' ? '👨‍🌾' : currentRole === 'fpo' ? '🏢' : currentRole === 'buyer' ? '🛒' : '⚙️'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] text-slate-500 uppercase font-medium leading-none">Demo Persona</div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name} ({currentUser.role.toUpperCase()})
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showRoleMenu ? 'rotate-90' : ''}`} />
              </button>

              {/* Persona Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Stakeholder Persona</p>
                  </div>
                  
                  <button
                    onClick={() => { onRoleChange('farmer'); setShowRoleMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 text-xs transition-colors ${currentRole === 'farmer' ? 'bg-emerald-50/80 font-bold text-emerald-900' : 'text-slate-700'}`}
                  >
                    <span className="text-base">👨‍🌾</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Farmer: Ramesh Patil</span>
                        {currentRole === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500">Patil Organic Farms (Nashik) • 500kg Tomato</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('fpo'); setShowRoleMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 text-xs transition-colors ${currentRole === 'fpo' ? 'bg-emerald-50/80 font-bold text-emerald-900' : 'text-slate-700'}`}
                  >
                    <span className="text-base">🏢</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">FPO: Sahyadri Kisan Producer Co.</span>
                        {currentRole === 'fpo' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500">Aggregator • 480 Member Farmers</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('buyer'); setShowRoleMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 text-xs transition-colors ${currentRole === 'buyer' ? 'bg-emerald-50/80 font-bold text-emerald-900' : 'text-slate-700'}`}
                  >
                    <span className="text-base">🛒</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Bulk Buyer: Metro Fresh Retail</span>
                        {currentRole === 'buyer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500">Supermarkets & Hotels • 2,000kg Bulk Orders</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { onRoleChange('admin'); setShowRoleMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-emerald-50 text-xs transition-colors ${currentRole === 'admin' ? 'bg-emerald-50/80 font-bold text-emerald-900' : 'text-slate-700'}`}
                  >
                    <span className="text-base">⚙️</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Admin: Platform Operations</span>
                        {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[11px] text-slate-500">AgriLink Central Command & Analytics</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifs}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
