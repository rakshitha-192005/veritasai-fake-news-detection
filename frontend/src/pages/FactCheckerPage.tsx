import React, { useState } from 'react';
import { Search, CheckCircle2, Globe, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { FactCheckItem } from '../types';

export const FactCheckerPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FactCheckItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await apiService.getHistory(); // standard query
      // Live search call
      const res = await fetch(`/api/v1/factcheck/search?query=${encodeURIComponent(searchQuery)}`);
      const items = await res.json();
      setResults(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    "Moon landing conspiracy",
    "5G cellular health claims",
    "Climate change scientific consensus",
    "Vaccine clinical trial data"
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-blue-500" /> Global Fact Check Directory
        </h1>
        <p className="text-xs text-slate-400">Search claims directly across Google Fact Check Tools API, Wikipedia, Reuters, and PolitiFact</p>
      </div>

      {/* Search Input Box */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search any rumor, viral headline, or disputed claim..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Search Claims
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500">Popular Searches:</span>
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(pq);
                handleSearch(pq);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-blue-500/50 hover:text-white transition"
            >
              {pq}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Verification Results ({results.length})</h2>

          <div className="space-y-3">
            {results.map((item, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                      {item.publisher}
                    </span>
                    <span className="text-xs text-slate-500">• {item.claimant || 'Public Media'}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.claim}</h3>
                  <p className="text-xs text-slate-400">Verified Rating: <span className="text-amber-400 font-semibold">{item.rating}</span></p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-blue-400 flex items-center justify-center gap-1.5 shrink-0 transition"
                >
                  Source Record <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
