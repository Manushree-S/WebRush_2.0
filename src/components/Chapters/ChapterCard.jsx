// src/components/Chapters/ChapterCard.jsx
import React from 'react';
import ReceiptBadge from '../common/ReceiptBadge';
import { formatReceiptDate } from '../../utils/formatters';
import { Calendar, ArrowRight, Share2, DollarSign, Layers } from 'lucide-react';

export default function ChapterCard({
  chapter,
  onExploreChapter,
  onSelectReceipt
}) {
  return (
    <div className="relative rounded-2xl border border-[#232D42] bg-[#131A29] p-6 space-y-6 hover:border-slate-600 transition-all duration-200 shadow-xl">
      
      {/* Chapter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{
                borderColor: `${chapter.themeColor}55`,
                backgroundColor: `${chapter.themeColor}18`,
                color: chapter.themeColor
              }}
            >
              {chapter.id.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{chapter.dateRangeStr}</span>
            </span>
          </div>

          <h3 className="text-xl font-extrabold font-mono text-white tracking-tight">
            {chapter.title}
          </h3>
          <p className="text-xs text-cyan-300/80 font-mono">
            {chapter.subtitle}
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 text-xs font-mono bg-[#0E1524] border border-slate-800 rounded-xl px-3.5 py-2">
          <div>
            <span className="text-[10px] text-slate-500 block">TOTAL MOMENTS</span>
            <span className="font-bold text-white">{chapter.receiptCount}</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">SPEND</span>
            <span className="font-bold text-amber-400">${chapter.stats.totalSpend}</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-500 block">MOMENTS</span>
            <span className="font-bold text-purple-400">{chapter.connectedMomentsCount}</span>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <p className="text-sm text-slate-300 leading-relaxed font-sans">
        {chapter.summary}
      </p>

      {/* Dominant Categories */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
          DOMINANT LIFE CHANNELS IN THIS ERA:
        </span>
        <div className="flex flex-wrap gap-2">
          {chapter.dominantCategories?.map(cat => (
            <div 
              key={cat.category}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1524] border border-slate-800 text-xs font-mono"
            >
              <ReceiptBadge category={cat.category} size="sm" />
              <span className="text-slate-300 font-semibold">{cat.count}</span>
              <span className="text-[10px] text-slate-500">({cat.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anchor Receipts Showcase */}
      {chapter.keyReceipts && chapter.keyReceipts.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
            KEY ANCHOR FRAGMENTS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {chapter.keyReceipts.map(r => (
              <div
                key={r.id}
                onClick={() => onSelectReceipt && onSelectReceipt(r)}
                className="cursor-pointer rounded-lg border border-slate-800 bg-[#0E1524] p-3 space-y-1 hover:border-cyan-400 hover:bg-[#162133] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <ReceiptBadge category={r.category} size="sm" />
                  <span className="text-[10px] font-mono text-slate-500">
                    {r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 line-clamp-1">
                  {r.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1">
                  {r.location || r.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Era CTA */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onExploreChapter && onExploreChapter(chapter)}
          className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Explore All {chapter.receiptCount} Receipts from this Era</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
