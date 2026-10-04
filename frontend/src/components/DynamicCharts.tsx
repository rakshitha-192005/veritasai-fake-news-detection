import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  AreaChart, Area 
} from 'recharts';

interface DynamicChartsProps {
  classProbabilities?: Record<string, number>;
  weeklyTrends?: Array<{ day: string; real: number; fake: number; misleading: number }>;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899'];

export const DynamicCharts: React.FC<DynamicChartsProps> = ({ classProbabilities, weeklyTrends }) => {
  // Class probabilities pie data
  const probData = classProbabilities 
    ? Object.entries(classProbabilities).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Real', value: 72.5 },
        { name: 'Fake', value: 14.2 },
        { name: 'Misleading', value: 8.3 },
        { name: 'Satire', value: 2.0 },
        { name: 'Clickbait', value: 3.0 }
      ];

  const defaultWeekly = [
    { day: 'Mon', real: 120, fake: 45, misleading: 15 },
    { day: 'Tue', real: 140, fake: 52, misleading: 18 },
    { day: 'Wed', real: 110, fake: 68, misleading: 22 },
    { day: 'Thu', real: 155, fake: 40, misleading: 12 },
    { day: 'Fri', real: 130, fake: 85, misleading: 30 },
    { day: 'Sat', real: 95,  fake: 60, misleading: 15 },
    { day: 'Sun', real: 85,  fake: 40, misleading: 8 }
  ];

  const trends = weeklyTrends || defaultWeekly;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Classification Probability Breakdown */}
      <div className="glass-card p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Model Probability Spectrum</span>
          <span className="text-xs text-blue-400 font-normal">RoBERTa + DistilBERT</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={probData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {probData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [`${value}%`, 'Probability']}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Disinformation Activity Trend */}
      <div className="glass-card p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Weekly Disinformation Monitor</span>
          <span className="text-xs text-slate-400 font-normal">7-Day Real vs Fake Volume</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFake" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="real" name="Verified Real" stroke="#22c55e" fillOpacity={1} fill="url(#colorReal)" />
              <Area type="monotone" dataKey="fake" name="Flagged Fake" stroke="#ef4444" fillOpacity={1} fill="url(#colorFake)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
