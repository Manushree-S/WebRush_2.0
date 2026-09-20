// src/components/Overview/LifeOverview.jsx
import React from 'react';
import { CATEGORIES } from '../../data/normalizedData';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Share2, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Database, 
  Play,
  TrendingUp,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import ReceiptBadge from '../common/ReceiptBadge';

export default function LifeOverview({
  metrics,
  connectionNetwork,
  metadata,
  onNavigateToExplorer,
  onStartStory,
  onSelectCategory
}) {
  const categoriesList = Object.values(CATEGORIES);
  const total = metrics.totalReceipts || 1;

  // Format date range
  const startDateStr = metrics.dateRange?.start
    ? new Date(metrics.dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Oct 1, 2024';
  const endDateStr = metrics.dateRange?.end
    ? new Date(metrics.dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Dec 31, 2024';

  const statCards = [
    {
      label: 'TOTAL RECEIPTS',
      value: metrics.totalReceipts.toLocaleString(),
      subtext: 'Normalized life fragments',
      icon: Layers,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'from-cyan-950/30 to-slate-900/40'
    },
    {
      label: 'ACTIVE CATEGORIES',
      value: categoriesList.length,
      subtext: 'Multi-modal lifelog channels',
      icon: Database,
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'from-purple-950/30 to-slate-900/40'
    },
    {
      label: 'MONITORED DAYS',
      value: metrics.distinctDaysCount,
      subtext: `${startDateStr} — ${endDateStr}`,
      icon: Calendar,
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'from-emerald-950/30 to-slate-900/40'
    },
    {
      label: 'DISCOVERED LINKS',
      value: (connectionNetwork.links?.length || 0).toLocaleString(),
      subtext: 'Client-side relationships found',
      icon: Share2,
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'from-amber-950/30 to-slate-900/40'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131A29] via-[#0E1524] to-[#0B0F17] border border-[#232D42] p-8 md:p-12 shadow-2xl">
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
        
        {/* Luminous accent flare */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Digital Life Archaeology</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white font-mono">
              LIFE<span className="text-cyan-400">//</span>RECEIPTS
            </h1>
            <p className="text-xl md:text-2xl font-light text-cyan-300 font-sans tracking-wide">
              "Your digital life, decoded."
            </p>
          </div>

          <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Hundreds of moments. Countless connections. One story.<br />
            Every day, your phone and apps log songs, places, purchases, searches, and notes.
            Individually, these moments seem random. Here, we decode the hidden patterns that connect them into a single human narrative.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onNavigateToExplorer}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-glow-cyan hover:scale-[1.02] active:scale-98"
            >
              <span>EXPLORE YOUR STORY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStartStory}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/50 text-purple-200 font-semibold text-sm tracking-wide transition-all hover:border-purple-400 hover:scale-[1.02] active:scale-98"
            >
              <Play className="w-4 h-4 fill-current text-purple-400" />
              <span>TELL MY STORY</span>
            </button>
          </div>

          {/* Data Authenticity Badge */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Harmonized Kaggle Research Datasets · Client-Side Data Processing · No Server Storage</span>
          </div>
        </div>
      </section>

      {/* Dataset Statistics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">
            [01] SYSTEM METRICS & ARCHAEOLOGY OVERVIEW
          </h2>
          <span className="text-xs text-slate-500 font-mono">100% Calculated from Raw Logs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className={`relative rounded-xl border bg-gradient-to-b ${stat.bg} ${stat.border} p-5 space-y-3 shadow-lg hover:border-slate-500 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400">
                  {stat.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Category Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400">
            [02] MULTI-MODAL LIFE RECEIPT CHANNELS
          </h2>
          <span className="text-xs text-slate-500 font-mono">Click category to filter in Explorer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map(cat => {
            const count = metrics.categoryCounts[cat.key] || 0;
            const pct = Math.round((count / total) * 100);

            return (
              <div
                key={cat.key}
                onClick={() => onSelectCategory && onSelectCategory(cat.key)}
                className="group cursor-pointer rounded-xl border border-[#232D42] bg-[#131A29] p-5 space-y-4 hover:border-slate-600 hover:bg-[#182133] transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <ReceiptBadge category={cat.key} size="md" />
                  <span className="text-lg font-mono font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {count} <span className="text-xs text-slate-500 font-normal">({pct}%)</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {cat.description}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: cat.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dataset Attribution & Provenance Card */}
      <section className="rounded-xl border border-[#232D42] bg-[#0E1524] p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>KAGGLE DATASET PROVENANCE & MAPPING SUMMARY</span>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          This digital life archaeology application is grounded in publicly available Kaggle research datasets.
          Sensors, streaming logs, and financial records were transparently harmonized without fabricating fake personal claims:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {metadata.kaggleSources?.map((src, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {src.name}
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 p-1"
                  title="View on Kaggle"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Kaggle: <code className="text-cyan-300">{src.kaggleSlug}</code>
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {src.contributions?.map((c, ci) => (
                  <span key={ci} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
