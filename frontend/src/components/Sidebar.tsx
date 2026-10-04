import React from 'react';
import { 
  Sparkles, LayoutDashboard, History, CheckCircle2, 
  BarChart3, MessageSquare, ShieldAlert, FileText, Settings 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'analyzer', label: 'Live AI Analyzer', icon: Sparkles, badge: 'Realtime' },
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'factchecker', label: 'Global Fact Checker', icon: CheckCircle2 },
    { id: 'analytics', label: 'Deep Analytics', icon: BarChart3 },
    { id: 'history', label: 'Prediction Archive', icon: History },
    { id: 'chat', label: 'TruthGPT Assistant', icon: MessageSquare },
    { id: 'admin', label: 'Admin Operations', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 p-4 hidden md:flex flex-col justify-between min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Core Platform</p>
          <div className="mt-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Supported Codecs</p>
          <div className="mt-2 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between"><span>DistilBERT / RoBERTa</span><span className="text-emerald-400 font-medium">Ready</span></div>
            <div className="flex justify-between"><span> spaCy NER</span><span className="text-emerald-400 font-medium">Ready</span></div>
            <div className="flex justify-between"><span> EasyOCR / Tesseract</span><span className="text-emerald-400 font-medium">Ready</span></div>
            <div className="flex justify-between"><span> LIME / SHAP XAI</span><span className="text-emerald-400 font-medium">Active</span></div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/20">
        <p className="text-xs font-bold text-white mb-1">VeritasAI Extension</p>
        <p className="text-[11px] text-slate-400 mb-2">Detect fake news on Twitter, Facebook & Chrome articles instantly.</p>
        <button 
          onClick={() => alert("Chrome Extension package source is available in /extension folder.")}
          className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
        >
          Download Extension
        </button>
      </div>
    </aside>
  );
};
