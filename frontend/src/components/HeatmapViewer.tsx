import React from 'react';
import { HighlightToken } from '../types';

interface HeatmapViewerProps {
  highlights: HighlightToken[];
  contentSnippet: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({ highlights, contentSnippet }) => {
  const words = contentSnippet.split(/\s+/);

  const getWordHighlight = (word: string): { bg: string; text: string; scoreStr: string } | null => {
    const clean = word.replace(/[^\w]/g, '').lowerCase ? word.replace(/[^\w]/g, '').toLowerCase() : '';
    const item = highlights.find(h => h.token.toLowerCase() === clean);
    if (!item) return null;

    if (item.type === 'fake' || item.type === 'misleading') {
      return {
        bg: 'bg-rose-500/25 border-rose-500/40 text-rose-200',
        text: 'text-rose-300',
        scoreStr: `LIME Score: ${item.score} (Disinformation Marker)`
      };
    } else if (item.type === 'real') {
      return {
        bg: 'bg-emerald-500/25 border-emerald-500/40 text-emerald-200',
        text: 'text-emerald-300',
        scoreStr: `LIME Score: +${item.score} (Verification Marker)`
      };
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500"></span>
          <span className="text-slate-300">Fake / Misleading Attribution (LIME -)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500"></span>
          <span className="text-slate-300">Verified Evidence Attribution (LIME +)</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 leading-relaxed text-sm text-slate-200 font-normal space-x-1.5">
        {words.map((w, idx) => {
          const hl = getWordHighlight(w);
          if (hl) {
            return (
              <span
                key={idx}
                title={hl.scoreStr}
                className={`inline-block px-1.5 py-0.5 rounded border font-semibold cursor-help transition-all transform hover:scale-105 ${hl.bg}`}
              >
                {w}
              </span>
            );
          }
          return <span key={idx}>{w} </span>;
        })}
      </div>
    </div>
  );
};
