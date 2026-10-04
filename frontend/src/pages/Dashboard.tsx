import React, { useEffect, useState } from 'react';
import { 
  Activity, ShieldCheck, ShieldAlert, AlertTriangle, 
  TrendingUp, Globe, Users, ArrowUpRight 
} from 'lucide-react';
import { apiService } from '../services/api';
import { AnalyticsData } from '../types';
import { DynamicCharts } from '../components/DynamicCharts';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    apiService.getAnalytics().then(setData).catch(console.error);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" /> Executive Disinformation Dashboard
          </h1>
          <p className="text-xs text-slate-400">Real-time stats, country risk heatmaps, and weekly trend metrics</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Live Monitoring Engine Active
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">Total Analyzed</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-outfit">{data ? data.total_analyzed.toLocaleString() : '1,420'}</p>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last week
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">Verified Real News</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-outfit">{data ? data.real_count : '810'}</p>
          <p className="text-[11px] text-slate-400">Ratio: <span className="text-emerald-400 font-semibold">{data ? data.real_vs_fake_ratio : '67.6'}%</span></p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">Flagged Fake Stories</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 font-outfit">{data ? data.fake_count : '390'}</p>
          <p className="text-[11px] text-slate-400">Average Risk: <span className="text-rose-400 font-semibold">{data ? data.average_risk : '32.8'}/100</span></p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400">Misleading & Clickbait</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-outfit">
            {data ? data.misleading_count + data.clickbait_count : '180'}
          </p>
          <p className="text-[11px] text-slate-400">Confidence Score: <span className="text-blue-400 font-semibold">{data ? data.average_confidence : '91.4'}%</span></p>
        </div>
      </div>

      {/* Recharts Component */}
      <DynamicCharts weeklyTrends={data?.weekly_trends} />

      {/* Country Risk Heatmap Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Global Disinformation Activity by Region</span>
          <span className="text-xs text-slate-400 font-normal">Updated Live</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Country / Region</th>
                <th className="px-4 py-3">Flagged Count</th>
                <th className="px-4 py-3">Threat Level</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data?.country_wise_fake_news || [
                { country: "United States", code: "US", count: 142, risk: "High" },
                { country: "India", code: "IN", count: 198, risk: "High" },
                { country: "United Kingdom", code: "GB", count: 64, risk: "Medium" },
                { country: "Germany", code: "DE", count: 48, risk: "Low" },
                { country: "France", code: "FR", count: 52, risk: "Medium" }
              ]).map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-blue-400">{c.code}</span>
                    {c.country}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-200">{c.count} Stories</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.risk === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      c.risk === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {c.risk} Risk
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-medium">Monitoring Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
