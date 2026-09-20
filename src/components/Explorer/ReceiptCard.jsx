// src/components/Explorer/ReceiptCard.jsx
import React from 'react';
import ReceiptBadge from '../common/ReceiptBadge';
import { formatReceiptDate, formatCurrency } from '../../utils/formatters';
import { MapPin, Share2, Tag, ArrowUpRight } from 'lucide-react';

export default function ReceiptCard({ 
  receipt, 
  connectedCount = 0, 
  onClick 
}) {
  return (
    <div
      onClick={() => onClick && onClick(receipt)}
      className="group relative cursor-pointer rounded-xl border border-[#232D42] bg-[#131A29] p-5 transition-all duration-200 hover:border-cyan-500/50 hover:bg-[#172236] hover:shadow-receipt hover:-translate-y-0.5 flex flex-col justify-between"
    >
      {/* Top Bar: Category & Value or Connected Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <ReceiptBadge category={receipt.category} size="sm" />
          
          <div className="flex items-center gap-1.5">
            {receipt.value !== null && receipt.value !== undefined && (
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                {formatCurrency(receipt.value)}
              </span>
            )}
            {connectedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded">
                <Share2 className="w-3 h-3" />
                <span>{connectedCount}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
          {receipt.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {receipt.description}
        </p>
      </div>

      {/* Footer Info: Timestamp, Location & Tags */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{formatReceiptDate(receipt.timestamp)}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
        </div>

        {receipt.location && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 truncate font-mono">
            <MapPin className="w-3 h-3 shrink-0 text-emerald-400" />
            <span className="truncate">{receipt.location}</span>
          </div>
        )}

        {/* Tags */}
        {receipt.tags && receipt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {receipt.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/70 text-slate-400 border border-slate-700/40"
              >
                #{tag}
              </span>
            ))}
            {receipt.tags.length > 3 && (
              <span className="text-[10px] font-mono text-slate-500">
                +{receipt.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
