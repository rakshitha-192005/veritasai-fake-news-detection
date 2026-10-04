import React from 'react';
import { ShieldCheck, Sparkles, Activity, Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Logo */}
      <div 
        onClick={() => setActiveTab('landing')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-white font-outfit">Veritas<span className="text-blue-500">AI</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Real-Time AI Fact Verification</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
        {[
          { id: 'analyzer', label: 'Live Analyzer', icon: Sparkles },
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'factchecker', label: 'Fact Checker' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'history', label: 'History' },
          { id: 'chat', label: 'VeritasGPT' },
          { id: 'admin', label: 'Admin Panel' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AI Models Live
        </div>

        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
            EX
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-200">Senior Analyst</p>
            <p className="text-[10px] text-slate-400">Enterprise Edition</p>
          </div>
        </div>
      </div>
    </header>
  );
};
