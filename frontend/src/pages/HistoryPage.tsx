import React, { useEffect, useState } from 'react';
import { History, Search, Bookmark, Trash2, Download, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/api';
import { PredictionResponse } from '../types';

export const HistoryPage: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHistory(search, verdictFilter, bookmarkedOnly);
      setPredictions(data.predictions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, verdictFilter, bookmarkedOnly]);

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteHistoryItem(id);
      setPredictions(predictions.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    try {
      await apiService.toggleBookmark(id);
      setPredictions(predictions.map(p => p.id === id ? { ...p, is_bookmarked: !p.is_bookmarked } : p));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
          <History className="w-6 h-6 text-blue-500" /> Prediction Archive & History
        </h1>
        <p className="text-xs text-slate-400">View, search, bookmark, and export previous AI verification records</p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prediction history..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="">All Verdicts</option>
            <option value="Real">Real</option>
            <option value="Fake">Fake</option>
            <option value="Misleading">Misleading</option>
            <option value="Clickbait">Clickbait</option>
          </select>

          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              bookmarkedOnly ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" /> Bookmarked Only
          </button>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {predictions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold">No prediction history records found.</p>
            <p className="text-xs text-slate-500">Run a news verification analysis in the Live Analyzer to populate your archive.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {predictions.map((p) => (
              <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                      p.verdict === 'Real' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      p.verdict === 'Fake' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {p.verdict}
                    </span>
                    <span className="text-[10px] text-slate-500">Confidence: {p.confidence_score}%</span>
                    <span className="text-[10px] text-slate-500">• {new Date(p.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{p.title || p.content_snippet}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.content_snippet}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBookmark(p.id)}
                    className={`p-2 rounded-lg border transition ${
                      p.is_bookmarked ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>

                  <a
                    href={apiService.getExportPdfUrl(p.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
                    title="Download PDF Report"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-900/30 border border-slate-800 text-rose-400 text-xs transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
