// src/components/Insights/InsightCard.jsx
import React from 'react';
import { 
  ArrowRight, 
  Moon, 
  MapPin, 
  Headphones, 
  Share2, 
  Zap, 
  Coffee,
  Sparkles 
} from 'lucide-react';

const ICON_MAP = {
  Moon,
  MapPin,
  Headphones,
  Share2,
  Zap,
  Coffee
};

export default function InsightCard({ insight, onExplore }) {
  const IconComponent = ICON_MAP[insight.icon] || Sparkles;

  return (
    <div className="rounded-2xl border border-[#232D42] bg-[#131A29] p-6 space-y-5 flex flex-col justify-between hover:border-slate-500 hover:bg-[#162133] transition-all duration-200 shadow-lg group">
      
      <div className="space-y-4">
        {/* Header Badge & Icon */}
        <div className="flex items-center justify-between">
          <span 
            className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
            style={{
              borderColor: `${insight.accentColor}55`,
              backgroundColor: `${insight.accentColor}18`,
              color: insight.accentColor
            }}
          >
            {insight.badge}
          </span>

          <div 
            className="p-2 rounded-lg border border-slate-700/50 bg-[#0E1524]"
            style={{ color: insight.accentColor }}
          >
            <IconComponent className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
          {insight.title}
        </h3>

        {/* Short Explanation */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {insight.explanation}
        </p>

        {/* Supporting Data Grid */}
        <div className="rounded-xl bg-[#0E1524] border border-slate-800 p-3.5 space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            DATA EVIDENCE:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {insight.supportingData.map((d, i) => (
              <div key={i} className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 block">{d.label}</span>
                <span className="text-xs font-mono font-semibold text-slate-200 block truncate">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Button */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onExplore && onExplore(insight)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-300 font-mono text-xs font-bold transition-all group-hover:border-cyan-400"
        >
          <span>EXPLORE THESE MOMENTS ({insight.receiptIds?.length || 0})</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
