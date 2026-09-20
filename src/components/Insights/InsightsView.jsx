// src/components/Insights/InsightsView.jsx
import React from 'react';
import InsightCard from './InsightCard';
import { Lightbulb, Sparkles, Database } from 'lucide-react';

export default function InsightsView({
  insights = [],
  onExploreInsight
}) {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-[#232D42] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>AUTONOMOUS PATTERN MINING</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
          DISCOVERED LIFE PATTERNS
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Algorithmic observations derived from sensor distributions, timestamp clustering, and multi-modal behavior. Every pattern is backed by concrete receipt evidence.
        </p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map(insight => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onExplore={onExploreInsight}
          />
        ))}
      </div>

      {/* Methodological Transparency Note */}
      <div className="rounded-xl border border-slate-800 bg-[#0E1524] p-5 flex items-start gap-3">
        <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-mono font-bold text-slate-100 uppercase tracking-wide block">
            DATA TRUTH GUARANTEE
          </span>
          <p className="text-slate-400 leading-relaxed">
            Zero fictional assumptions or hallucinated metrics. Every nocturnal percentage, merchant count, and nexus degree is mathematically computed in real-time from the normalized Kaggle dataset records in your browser.
          </p>
        </div>
      </div>

    </div>
  );
}
