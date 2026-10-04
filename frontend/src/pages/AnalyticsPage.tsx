import React from 'react';
import { BarChart3, PieChart, ShieldAlert, Cpu } from 'lucide-react';
import { DynamicCharts } from '../components/DynamicCharts';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-outfit flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-500" /> Deep Disinformation Analytics & NLP Insights
        </h1>
        <p className="text-xs text-slate-400">Multi-dimensional analysis across sentiment, political bias, clickbait patterns, and transformer embeddings</p>
      </div>

      <DynamicCharts />

      {/* Sentiment & Emotion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Emotion Spectrum Distribution</h3>
          <div className="space-y-2">
            {[
              { label: 'Fear & Alarmism', val: '42%' },
              { label: 'Anger & Outrage', val: '31%' },
              { label: 'Surprise / Shock', val: '18%' },
              { label: 'Neutrality', val: '9%' }
            ].map((emo, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{emo.label}</span>
                  <span className="text-slate-200 font-semibold">{emo.val}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: emo.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Political Bias Spectrum</h3>
          <div className="space-y-2">
            {[
              { label: 'Left-Leaning', val: '22%' },
              { label: 'Center-Left', val: '15%' },
              { label: 'Neutral / Balanced', val: '38%' },
              { label: 'Center-Right', val: '14%' },
              { label: 'Right-Leaning', val: '11%' }
            ].map((pb, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{pb.label}</span>
                  <span className="text-amber-400 font-semibold">{pb.val}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: pb.val }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Model Benchmark Metrics</h3>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">RoBERTa-Large F1:</span>
              <span className="text-emerald-400 font-bold">0.984</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">DistilBERT Precision:</span>
              <span className="text-emerald-400 font-bold">0.979</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
              <span className="text-slate-400">LIME Attribution Acc:</span>
              <span className="text-blue-400 font-bold">96.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
