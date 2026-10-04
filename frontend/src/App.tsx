import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LiveAnalyzer } from './pages/LiveAnalyzer';
import { Dashboard } from './pages/Dashboard';
import { FactCheckerPage } from './pages/FactCheckerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPanel } from './pages/AdminPanel';
import { ChatBotWindow } from './components/ChatBotWindow';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { PredictionResponse } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<PredictionResponse | null>(null);

  const handleOpenChatWithContext = (pred: PredictionResponse) => {
    setChatContext(pred);
    setChatOpen(true);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onStartAnalyzing={() => setActiveTab('analyzer')} />;
      case 'analyzer':
        return <LiveAnalyzer onOpenChatWithContext={handleOpenChatWithContext} />;
      case 'dashboard':
        return <Dashboard />;
      case 'factchecker':
        return <FactCheckerPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'history':
        return <HistoryPage />;
      case 'chat':
        return <ChatBotWindow contextPrediction={chatContext} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <LandingPage onStartAnalyzing={() => setActiveTab('analyzer')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Layout */}
      <div className="flex-1 flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating VeritasGPT Assistant Chat Trigger Button */}
      {activeTab !== 'chat' && (
        <div className="fixed bottom-6 right-6 z-40">
          {chatOpen ? (
            <div className="w-80 md:w-96 shadow-2xl">
              <ChatBotWindow contextPrediction={chatContext} onClose={() => setChatOpen(false)} />
            </div>
          ) : (
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-2xl shadow-blue-600/50 transform hover:scale-105 transition"
            >
              <MessageSquare className="w-4 h-4" /> Ask VeritasGPT Assistant
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 px-8 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-slate-300">VeritasAI Enterprise</span> — Disinformation Defense & Fact Verification SaaS Platform
        </div>
        <p>© 2026 VeritasAI Platform. Production Ready. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
