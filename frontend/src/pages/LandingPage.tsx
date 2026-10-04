import React from 'react';
import { 
  ShieldCheck, Sparkles, Activity, FileText, Image as ImageIcon, 
  Globe, Cpu, Zap, Lock, ArrowRight, CheckCircle2 
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalyzing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalyzing }) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Enterprise AI Disinformation Defense Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight font-outfit">
          Verify Truth in Real-Time with <br />
          <span className="gradient-text-blue">Explainable Deep Learning AI</span>
        </h1>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Detect fake news, clickbait, hate speech, political bias, and propaganda across articles, PDFs, screenshot OCR, and social media URLs using RoBERTa, DistilBERT, spaCy, and LIME XAI.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartAnalyzing}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base flex items-center gap-2 shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 transition"
          >
            Launch Live AI Analyzer <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onStartAnalyzing}
            className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition"
          >
            View Demo Dashboard
          </button>
        </div>

        {/* Live Counters */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: 'Articles Analyzed', value: '1.4M+' },
            { label: 'Detection Accuracy', value: '98.4%' },
            { label: 'Supported Languages', value: '10+' },
            { label: 'Verification Latency', value: '< 45ms' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl text-center">
              <p className="text-2xl font-extrabold text-white font-outfit">{stat.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider font-outfit">Enterprise AI Capabilities</h2>
          <p className="text-xs text-slate-400">Multi-modal input support with instant explainability</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: "Multi-Modal Input Engine",
              desc: "Paste articles, raw headlines, social media post URLs, or upload PDFs and screenshot images for instant OCR extraction."
            },
            {
              icon: Cpu,
              title: "Explainable AI (LIME & SHAP)",
              desc: "Don't just get a binary label. Inspect exact word attributions, token weights, probability distributions, and attention heatmaps."
            },
            {
              icon: Globe,
              title: "Global Fact-Check Verification",
              desc: "Cross-reference claims automatically against Google Fact Check Tools API, Wikipedia Knowledge Graph, and Reuters Wire Services."
            },
            {
              icon: Activity,
              title: "Multi-Class News Categorization",
              desc: "Classifies content into Real, Fake, Misleading, Satire, Clickbait, and Partially True with precision confidence scoring."
            },
            {
              icon: Zap,
              title: "VeritasGPT Chat Assistant",
              desc: "Interactive LLM assistant answers 'Why is this fake?', 'What evidence supports this?', and provides source credibility guidance."
            },
            {
              icon: Lock,
              title: "Enterprise SaaS Security",
              desc: "Role-based access control, JWT authentication, rate limiting, and encrypted REST / WebSocket architecture."
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-blue-500/40 transition">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-outfit">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
