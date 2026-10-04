import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, 
  ExternalLink, Download, Bookmark, Share2, HelpCircle, Eye, RefreshCw
} from 'lucide-react';
import { PredictionResponse } from '../types';
import { HeatmapViewer } from './HeatmapViewer';
import { apiService } from '../services/api';

interface PredictionCardProps {
  prediction: PredictionResponse;
  onOpenChatWithContext?: (pred: PredictionResponse) => void;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onOpenChatWithContext }) => {
  const [activeView, setActiveView] = useState<'summary' | 'xai' | 'factcheck' | 'metrics'>('summary');
  const [isBookmarked, setIsBookmarked] = useState(prediction.is_bookmarked || false);

  const getVerdictBadge = () => {
    switch (prediction.verdict) {
      case 'Real':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          color: '#10b981'
        };
      case 'Fake':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: ShieldAlert,
          color: '#f43f5e'
        };
      case 'Misleading':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: AlertTriangle,
          color: '#f59e0b'
        };
      case 'Clickbait':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          icon: Sparkles,
          color: '#a855f7'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          icon: CheckCircle2,
          color: '#3b82f6'
        };
    }
  };

  const badge = getVerdictBadge();
  const Icon = badge.icon;

  const handleBookmarkToggle = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      await apiService.toggleBookmark(prediction.id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 shadow-2xl transition-all">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm uppercase tracking-wider ${badge.bg}`}>
            <Icon className="w-5 h-5" />
            <span>VERDICT: {prediction.verdict}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Credibility Grade:</span>
            <span className="font-extrabold text-blue-400 text-sm">{prediction.credibility_grade}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg border transition ${
              isBookmarked ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Bookmark Analysis"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          <a
            href={apiService.getExportPdfUrl(prediction.id)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </a>
          <a
            href={apiService.getExportCsvUrl(prediction.id)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            CSV
          </a>
          <a
            href={apiService.getExportJsonUrl(prediction.id)}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            JSON
          </a>

          {onOpenChatWithContext && (
            <button
              onClick={() => onOpenChatWithContext(prediction)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Ask VeritasGPT
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row (Confidence Gauge & Risk Rating) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-1">AI Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-outfit">{prediction.confidence_score}%</span>
            <span className="text-[10px] text-emerald-400 font-semibold">High Precision</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${prediction.confidence_score}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-1">Disinformation Risk Score</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-outfit ${prediction.risk_score > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {prediction.risk_score}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${prediction.risk_score > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${prediction.risk_score}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-1">Clickbait Density</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-400 font-outfit">{prediction.clickbait_score}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${prediction.clickbait_score}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-1">Political Bias Rating</p>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-amber-400">{prediction.political_bias}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Sentiment: {prediction.sentiment}</p>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveView('summary')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeView === 'summary' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI Reasoning & Summary
        </button>
        <button
          onClick={() => setActiveView('xai')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeView === 'xai' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Explainable AI (LIME / SHAP)
        </button>
        <button
          onClick={() => setActiveView('factcheck')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeView === 'factcheck' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Fact Verification ({prediction.fact_checks.length})
        </button>
      </div>

      {/* View Content */}
      {activeView === 'summary' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed AI Explanation</h4>
            <p className="text-sm text-slate-200 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
              {prediction.explanation}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Key Findings
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {prediction.key_findings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h5 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Recommendations
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {prediction.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Topics & Entities badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-500">Entities Detected:</span>
            {prediction.entities.map((ent, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                {ent.text} <span className="text-slate-500 text-[9px]">({ent.label})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {activeView === 'xai' && (
        <div className="space-y-4">
          <HeatmapViewer highlights={prediction.lime_highlights} contentSnippet={prediction.content_snippet} />
        </div>
      )}

      {activeView === 'factcheck' && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cross-Referenced Fact Checks</h4>
          <div className="space-y-2">
            {prediction.fact_checks.map((fc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-200">{fc.claim}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Publisher: <span className="text-blue-400 font-medium">{fc.publisher}</span></p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400">
                    {fc.rating}
                  </span>
                  <a href={fc.url} target="_blank" rel="noreferrer" className="block text-[10px] text-blue-400 hover:underline mt-1">
                    View Source Source ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Similar Verified Stories</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prediction.similar_news.map((sim, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-bold text-slate-200 line-clamp-2">{sim.title}</p>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                  <span>{sim.source}</span>
                  <span className="text-emerald-400 font-semibold">{sim.similarity_score}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
